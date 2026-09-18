import fs from 'fs';
import path from 'path';
import { parseCSV, slugify, escapeYaml } from './utils/csv-parser.mjs';

const argPath = process.argv[2];
const CSV_FILE = argPath
  ? path.resolve(process.cwd(), argPath)
  : fs.existsSync('./data/portfolio.csv')
  ? './data/portfolio.csv'
  : './data/sample-portfolio.csv';

console.log(`\n📂 Membaca data portofolio dari: ${CSV_FILE}`);

if (!fs.existsSync(CSV_FILE)) {
  console.error(`❌ File ${CSV_FILE} tidak ditemukan!`);
  console.log(`💡 Letakkan file CSV Anda di data/portfolio.csv atau jalankan:`);
  console.log(`   node scripts/migrate-portfolio.mjs path/ke/file.csv\n`);
  process.exit(1);
}

const csvText = fs.readFileSync(CSV_FILE, 'utf-8');
const rows = parseCSV(csvText);

if (rows.length === 0) {
  console.error(`❌ File CSV kosong atau tidak memiliki data yang valid.`);
  process.exit(1);
}

let count = 0;
const targetDir = path.resolve(process.cwd(), 'src/content/portfolio');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

for (const item of rows) {
  const title = (item.title || item.project_title || item.nama_proyek || '').trim();
  if (!title) continue;

  const customSlug = (item.custom_slug || item.slug || slugify(title)).trim();
  const category = (item.category || item.kategori || 'Company Profile').trim();
  const client = (item.client || item.klien || 'Private Client').trim();
  const image = (item.image || item.gambar || 'https://picsum.photos/600/400?1').trim();
  const summary = (item.summary || item.ringkasan || item.description || '').trim();
  const isDraft = ['true', '1', 'yes', 'ya'].includes((item.draft || '').toLowerCase().trim());
  const body = (item.body || item.content || item.deskripsi || '').trim();

  // CTA
  const ctaHeading = (item.cta_heading || 'Ready to start your next project?').trim();
  const ctaSub = (item.cta_subheading || 'Contact us today for a free consultation.').trim();
  const ctaBtnText = (item.cta_button_text || 'Get a Quote').trim();
  const ctaBtnLink = (item.cta_button_link || '/#contact').trim();

  const fileName = `${customSlug}.md`;
  const targetFilePath = path.join(targetDir, fileName);

  const fileContent = `---
title: ${escapeYaml(title)}
custom_slug: ${escapeYaml(customSlug)}
category: ${escapeYaml(category)}
client: ${escapeYaml(client)}
image: ${escapeYaml(image)}
summary: ${escapeYaml(summary)}
cta:
  heading: ${escapeYaml(ctaHeading)}
  subheading: ${escapeYaml(ctaSub)}
  button_text: ${escapeYaml(ctaBtnText)}
  button_link: ${escapeYaml(ctaBtnLink)}
draft: ${isDraft}
---

${body}
`;

  fs.writeFileSync(targetFilePath, fileContent, 'utf-8');
  console.log(`  ✅ ${fileName} -> ${path.relative(process.cwd(), targetFilePath)}`);
  count++;
}

console.log(`\n🎉 Selesai! Berhasil mengonversi ${count} proyek portofolio ke Sveltia CMS.`);
console.log(`👉 Jalankan 'npm run dev:cms' lalu buka http://localhost:4321/admin/ untuk melihat di CMS.`);

