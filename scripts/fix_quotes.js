const fs = require('fs');

let content = fs.readFileSync('scripts/build_full_dataset.js', 'utf8');

// Replace any occurrence of ' followed by a Bengali character and not end of string
// Or replace specific Bengali words that use ' as glottal stop / ayn
content = content.replace(/কা'বার/g, "কা\\'বার");
content = content.replace(/মা'ওয়া/g, "মা\\'ওয়া");
content = content.replace(/বা'ল/g, "বা\\'ল");
content = content.replace(/সা'দ/g, "সা\\'দ");
content = content.replace(/মা'মুর/g, "মা\\'মুর");

fs.writeFileSync('scripts/build_full_dataset.js', content, 'utf8');
console.log('scripts/build_full_dataset.js cleaned up successfully!');
