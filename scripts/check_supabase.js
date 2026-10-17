const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://esfpilzwcbodqiumlrkh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZnBpbHp3Y2JvZHFpdW1scmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNDU2ODgsImV4cCI6MjEwNzgyMTY4OH0.5T4vdm9x2O8fyfzNllbSfYBPxncqOtIRIvGzMkaQ8Ek';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing connection to Supabase:', supabaseUrl);
  
  // Test sections table
  const { data: secData, error: secErr } = await supabase.from('sections').select('count', { count: 'exact', head: true });
  if (secErr) {
    console.log('Table "sections" check error:', secErr.message, '| Code:', secErr.code);
  } else {
    console.log('Table "sections" exists! Status OK.');
  }

  // Test categories table
  const { data: catData, error: catErr } = await supabase.from('categories').select('count', { count: 'exact', head: true });
  if (catErr) {
    console.log('Table "categories" check error:', catErr.message, '| Code:', catErr.code);
  } else {
    console.log('Table "categories" exists! Status OK.');
  }

  // Test articles table
  const { data: artData, error: artErr } = await supabase.from('articles').select('count', { count: 'exact', head: true });
  if (artErr) {
    console.log('Table "articles" check error:', artErr.message, '| Code:', artErr.code);
  } else {
    console.log('Table "articles" exists! Status OK.');
  }
}

check();
