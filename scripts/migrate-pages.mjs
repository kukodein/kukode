import fs from 'fs';
import path from 'path';
import { parseCSV, slugify, escapeYaml } from './utils/csv-parser.mjs';

const argPath = process.argv[2];
const CSV_FILE = argPath
  ? path.resolve(process.cwd(), argPath)
  : fs.existsSync('./data/pages.csv')
  ? './data/pages.csv'
  : './data/sample-pages.csv';

console.log(`\n📂 Membaca data halaman dari: ${CSV_FILE}`);

if (!fs.existsSync(CSV_FILE)) {
  console.error(`❌ File ${CSV_FILE} tidak ditemukan!`);
  console.log(`💡 Letakkan file CSV Anda di data/pages.csv atau jalankan:`);
  console.log(`   node scripts/migrate-pages.mjs path/ke/file.csv\n`);
  process.exit(1);
}

const csvText = fs.readFileSync(CSV_FILE, 'utf-8');
const rows = parseCSV(csvText);

if (rows.length === 0) {
  console.error(`❌ File CSV kosong atau tidak memiliki data yang valid.`);
  process.exit(1);
}

let count = 0;

for (const item of rows) {
  const rawTitle = item.title || item.judul || item.page_title || '';
  if (!rawTitle.trim()) continue;

  const rawLanguage = (item.language || item.lang || item.locale || item.bahasa || 'en').toLowerCase().trim();
  const locale = rawLanguage.startsWith('id') ? 'id' : 'en';

  const generatedSlug = slugify(item.custom_slug || item.slug || rawTitle);
  const translationKey = (item.translation_key || item.translationkey || item.key || generatedSlug).trim();

  const title = rawTitle.trim();
  const customSlug = (item.custom_slug || item.slug || generatedSlug).trim();
  const template = (item.template || 'default').toLowerCase().trim();

  // SEO fields at root
  const seoTitle = (item.seo_title || item.meta_title || title).trim();
  const seoDesc = (item.seo_description || item.meta_description || item.description || '').trim();
  const seoImage = (item.seo_image || item.og_image || '/image/default-thumbnail.jpg').trim();

  // Template specific fields
  const heroTitle = (item.hero_title || title).trim();
  const heroDescription = (item.hero_description || '').trim();
  const heroImage = (item.hero_image || '').trim();
  const formEmail = (item.form_email_forward || item.email || '').trim();
  const isDraft = ['true', '1', 'yes', 'ya'].includes((item.draft || '').toLowerCase().trim());

  // Content body
  const content = (item.content || item.body || item.konten || '').trim();

  const targetDir = path.resolve(process.cwd(), `src/content/pages/${locale}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileName = `${customSlug}.md`;
  const targetFilePath = path.join(targetDir, fileName);

  // Construct frontmatter based on template
  let pageBlock = `page:
  template: ${escapeYaml(template)}
  title: ${escapeYaml(title)}`;

  if (template === 'about') {
    pageBlock += `
  hero:
    hero_title: ${escapeYaml(heroTitle)}
    hero_description: ${escapeYaml(heroDescription)}
    hero_image: ${escapeYaml(heroImage || '/image/en-home-section-hero.png')}`;
  } else if (template === 'contact') {
    pageBlock += `
  hero:
    hero_title: ${escapeYaml(heroTitle)}
  form_email_forward: ${escapeYaml(formEmail || 'hello@kukode.com')}`;
  }

  if (content) {
    // Format indented multiline content
    const indentedContent = content
      .split('\n')
      .map((line) => (line ? `    ${line}` : ''))
      .join('\n');
    pageBlock += `\n  content: |\n${indentedContent}`;
  }

  const fileContent = `---
custom_slug: ${escapeYaml(customSlug)}
translation_key: ${escapeYaml(translationKey)}
draft: ${isDraft}
seo:
  title: ${escapeYaml(seoTitle)}
  description: ${escapeYaml(seoDesc)}
  image: ${escapeYaml(seoImage)}
${pageBlock}
---
`;

  fs.writeFileSync(targetFilePath, fileContent, 'utf-8');
  console.log(`  ✅ [${locale.toUpperCase()}] ${fileName} (Template: ${template}) -> ${path.relative(process.cwd(), targetFilePath)}`);
  count++;
}

console.log(`\n🎉 Selesai! Berhasil mengonversi ${count} halaman ke Sveltia CMS.`);
console.log(`👉 Jalankan 'npm run dev:cms' lalu buka http://localhost:4321/admin/ untuk melihat di CMS.`);

