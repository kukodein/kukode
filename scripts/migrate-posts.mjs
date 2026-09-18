import fs from 'fs';
import path from 'path';
import { parseCSV, slugify, escapeYaml } from './utils/csv-parser.mjs';

// Support default data/posts.csv or custom path passed via argument: node scripts/migrate-posts.mjs my-file.csv
const argPath = process.argv[2];
const CSV_FILE = argPath
  ? path.resolve(process.cwd(), argPath)
  : fs.existsSync('./data/posts.csv')
  ? './data/posts.csv'
  : './data/sample-posts.csv';

console.log(`\n📂 Membaca data artikel dari: ${CSV_FILE}`);

if (!fs.existsSync(CSV_FILE)) {
  console.error(`❌ File ${CSV_FILE} tidak ditemukan!`);
  console.log(`💡 Letakkan file CSV Anda di data/posts.csv atau jalankan:`);
  console.log(`   node scripts/migrate-posts.mjs path/ke/file.csv\n`);
  process.exit(1);
}

const csvText = fs.readFileSync(CSV_FILE, 'utf-8');
const rows = parseCSV(csvText);

if (rows.length === 0) {
  console.error(`❌ File CSV kosong atau tidak memiliki data yang valid.`);
  process.exit(1);
}

let count = 0;
const today = new Date().toISOString().split('T')[0];

for (const item of rows) {
  const rawTitle = item.title || item.judul || item.post_title || '';
  if (!rawTitle.trim()) continue;

  const rawLanguage = (item.language || item.lang || item.locale || item.bahasa || 'en').toLowerCase().trim();
  const locale = rawLanguage.startsWith('id') ? 'id' : 'en';

  const generatedSlug = slugify(item.custom_slug || item.slug || rawTitle);
  const translationKey = (item.translation_key || item.translationkey || item.key || generatedSlug).trim();

  const title = rawTitle.trim();
  const customSlug = (item.custom_slug || item.slug || generatedSlug).trim();
  const description = (item.description || item.excerpt || item.ringkasan || '').trim();

  // SEO fields
  const seoTitle = (item.seo_title || item.meta_title || title).trim();
  const seoDesc = (item.seo_description || item.meta_description || description).trim();
  const seoImage = (item.seo_image || item.og_image || item.image || '/image/default-thumbnail.jpg').trim();

  // Metadata
  const pubDate = (item.pubdate || item.pub_date || item.date || item.tanggal || today).trim();
  const updatedDate = (item.updateddate || item.updated_date || item.lastmod || '').trim();
  const featuredImage = (item.image || item.featured_image || item.gambar || '/image/default-thumbnail.jpg').trim();
  const category = (item.category || item.kategori || 'Information').trim();
  const author = (item.author || item.penulis || 'Ahmad Muzakki').trim();
  const isDraft = ['true', '1', 'yes', 'ya'].includes((item.draft || '').toLowerCase().trim());

  // Markdown body
  const body = (item.body || item.content || item.konten || item.isi || '').trim();

  const targetDir = path.resolve(process.cwd(), `src/content/posts/${locale}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileName = `${customSlug}.md`;
  const targetFilePath = path.join(targetDir, fileName);

  const fileContent = `---
title: ${escapeYaml(title)}
custom_slug: ${escapeYaml(customSlug)}
translation_key: ${escapeYaml(translationKey)}
description: ${escapeYaml(description)}
seo:
  title: ${escapeYaml(seoTitle)}
  description: ${escapeYaml(seoDesc)}
  image: ${escapeYaml(seoImage)}
pubDate: ${pubDate}${updatedDate ? `\nupdatedDate: ${updatedDate}` : ''}
image: ${escapeYaml(featuredImage)}
category: ${escapeYaml(category)}
author: ${escapeYaml(author)}
draft: ${isDraft}
---

${body}
`;

  fs.writeFileSync(targetFilePath, fileContent, 'utf-8');
  console.log(`  ✅ [${locale.toUpperCase()}] ${fileName} -> ${path.relative(process.cwd(), targetFilePath)}`);
  count++;
}

console.log(`\n🎉 Selesai! Berhasil mengonversi ${count} artikel ke Sveltia CMS.`);
console.log(`👉 Jalankan 'npm run dev:cms' lalu buka http://localhost:4321/admin/ untuk melihat di CMS.`);

