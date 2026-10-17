const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://esfpilzwcbodqiumlrkh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZnBpbHp3Y2JvZHFpdW1scmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNDU2ODgsImV4cCI6MjEwNzgyMTY4OH0.5T4vdm9x2O8fyfzNllbSfYBPxncqOtIRIvGzMkaQ8Ek';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('--- শুরু হচ্ছে Supabase ক্লাউড ডাটাবেজ সিঙ্ক ---');
  console.log('Target Project:', supabaseUrl);

  // 1. Load Sections & Categories
  const { SECTIONS } = require('./build_full_dataset.js');
  console.log(`মোট ${SECTIONS.length}টি প্রধান বিভাগ লোড হয়েছে।`);

  // Sync Sections
  const dbSections = SECTIONS.map(s => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    arabic_title: s.arabicTitle,
    tagline: s.tagline,
    description: s.description,
    filter_groups: s.filterGroups || []
  }));

  const { error: secErr } = await supabase.from('sections').upsert(dbSections, { onConflict: 'id' });
  if (secErr) {
    console.error('❌ Sections upsert error:', secErr.message);
    return;
  }
  console.log(`✓ ${dbSections.length}টি বিভাগ সফলভাবে Supabase-এ সিঙ্ক হয়েছে!`);

  // 2. Sync Categories
  const allCategories = [];
  SECTIONS.forEach(s => {
    s.categories.forEach(c => {
      allCategories.push({
        id: c.id,
        slug: c.slug,
        section_id: s.id,
        name: c.name,
        arabic_name: c.arabicName || null,
        badge: c.badge || '',
        group: c.group || '',
        article_count: c.articleCount || 0,
        short_desc: c.shortDesc || '',
        meta_info: c.metaInfo || ''
      });
    });
  });

  console.log(`মোট ${allCategories.length}টি ক্যাটেগরি আপলোড করা হচ্ছে...`);
  // Upload in chunks of 50
  for (let i = 0; i < allCategories.length; i += 50) {
    const chunk = allCategories.slice(i, i + 50);
    const { error: catErr } = await supabase.from('categories').upsert(chunk, { onConflict: 'id' });
    if (catErr) {
      console.error(`❌ Categories batch ${i}-${i + chunk.length} error:`, catErr.message);
      return;
    }
  }
  console.log(`✓ সকল ${allCategories.length}টি ক্যাটেগরি সফলভাবে Supabase-এ সিঙ্ক হয়েছে!`);

  // 3. Load & Sync Articles
  const artContent = fs.readFileSync(path.join(__dirname, '../src/data/articles.ts'), 'utf8');
  const startIdx = artContent.indexOf('INITIAL_ARTICLES');
  const bracketStart = artContent.indexOf('[', startIdx);
  const bracketEnd = artContent.indexOf('];', bracketStart) + 1;
  const artSnippet = artContent.substring(bracketStart, bracketEnd);
  const INITIAL_ARTICLES = new Function('return ' + artSnippet)();

  console.log(`মোট ${INITIAL_ARTICLES.length}টি প্রাথমিক প্রবন্ধ পাওয়া গেছে।`);

  const dbArticles = INITIAL_ARTICLES.map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle,
    section_id: a.sectionId,
    category_id: a.categoryId,
    author: a.author,
    reviewer: a.reviewer,
    published_at: a.publishedAt,
    read_time: a.readTime,
    is_lead: Boolean(a.isLead),
    status: 'published',
    tags: a.tags || [],
    citation: a.citation || {},
    summary: a.summary || '',
    key_takeaways: a.keyTakeaways || [],
    content_sections: a.contentSections || [],
    references: a.references || [],
    views_count: 142
  }));

  const { error: artErr } = await supabase.from('articles').upsert(dbArticles, { onConflict: 'id' });
  if (artErr) {
    console.error('❌ Articles upsert error:', artErr.message);
    return;
  }
  console.log(`✓ ${dbArticles.length}টি প্রবন্ধ সফলভাবে Supabase-এ সিঙ্ক হয়েছে!`);

  console.log('\n======================================================');
  console.log('আলহামদুলিল্লাহ! সম্পূর্ণ ডাটাসেট Supabase ক্লাউডে লাইভ হয়ে গেছে!');
  console.log('======================================================');
}

sync().catch(console.error);
