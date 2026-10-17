const fs = require('fs');

const samplePath = 'out/allah/tawheed-fundamentals/tawheed-meaning-and-impact-on-human-dignity/index.html';
const html = fs.readFileSync(samplePath, 'utf8');

console.log('HTML size:', html.length);

const titleMatch = html.match(/<title>([^<]+)<\/title>/);
console.log('Page Title:', titleMatch ? titleMatch[1] : 'None');

const jsonLdBlocks = html.split('<script type="application/ld+json">').slice(1).map(b => b.split('</script>')[0]);
console.log('Total JSON-LD schemas detected:', jsonLdBlocks.length);

jsonLdBlocks.forEach((block, idx) => {
  try {
    const parsed = JSON.parse(block);
    console.log(`Schema #${idx + 1}: Type = "${parsed['@type']}"`);
    if (parsed['@type'] === 'Article') {
      console.log('  Headline:', parsed.headline);
      console.log('  Author:', parsed.author.name);
      console.log('  Citation:', parsed.citation[0].name);
    }
    if (parsed['@type'] === 'BreadcrumbList') {
      console.log('  Breadcrumb items:', parsed.itemListElement.map(i => i.name).join(' > '));
    }
  } catch (err) {
    console.error('Failed to parse block', idx, err.message);
  }
});

// Check sitemap
const sitemap = fs.readFileSync('out/sitemap.xml', 'utf8');
const urlCount = (sitemap.match(/<loc>/g) || []).length;
console.log('Total URLs indexed in sitemap.xml:', urlCount);
