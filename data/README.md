# Panduan Migrasi Data Spreadsheet ke Sveltia CMS

Folder ini berisi file template CSV dan panduan untuk mengimpor artikel, halaman, dan portofolio dari **Google Sheets / Microsoft Excel** ke **Sveltia CMS** secara otomatis.

---

## 🚀 Cara Cepat Menggunakan

1. Buat spreadsheet di Google Sheets atau Excel dengan kolom-kolom seperti tabel di bawah.
2. Ekspor spreadsheet ke file `.csv` (**File** $\rightarrow$ **Download** $\rightarrow$ **Comma Separated Values (.csv)**).
3. Letakkan file CSV di folder ini:
   - Untuk artikel: `data/posts.csv`
   - Untuk halaman statis: `data/pages.csv`
   - Untuk portofolio: `data/portfolio.csv`
4. Jalankan script impor di terminal:
   ```bash
   npm run migrate:posts
   npm run migrate:pages
   npm run migrate:portfolio
   ```
5. File Markdown (`.md`) akan langsung ter-generate di `src/content/`. Jalankan `npm run dev:cms` untuk melihat hasilnya di Sveltia CMS!

---

## 📋 Struktur Kolom Spreadsheet

### 1. Posts / Artikel (`data/posts.csv`)

| Nama Kolom | Wajib? | Keterangan | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `language` | Ya | `en` untuk Inggris, `id` untuk Indonesia | `en` atau `id` |
| `title` | Ya | Judul artikel | `What is an API?` |
| `custom_slug` | Opsional | URL slug artikel | `what-is-an-api` |
| `translation_key` | Disarankan | Kunci penghubung artikel EN dan ID | `api-guide` |
| `category` | Opsional | Kategori artikel (Information, Website, Tutorial) | `Information` |
| `author` | Opsional | Nama author yang terdaftar | `Ahmad Muzakki` |
| `pubDate` | Ya | Tanggal publikasi (YYYY-MM-DD) | `2026-09-17` |
| `description` | Opsional | Ringkasan / kutipan artikel | `A complete beginner guide...` |
| `seo_title` | Opsional | Meta title SEO (default ke title) | `What is an API? - Kukode` |
| `seo_description` | Opsional | Meta description SEO | `Learn all about APIs...` |
| `seo_image` | Opsional | Gambar OG / Social Share | `/image/default-thumbnail.jpg` |
| `image` | Opsional | Featured image artikel | `/image/default-thumbnail.jpg` |
| `draft` | Opsional | `false` untuk terbit, `true` untuk draf | `false` |
| `body` | Opsional | Isi artikel dalam format Markdown | `## Introduction\n\nIsi artikel...` |

---

### 2. Pages / Halaman Statis (`data/pages.csv`)

| Nama Kolom | Wajib? | Keterangan | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `language` | Ya | `en` atau `id` | `en` atau `id` |
| `title` | Ya | Judul halaman | `About Kukode` |
| `custom_slug` | Opsional | URL slug halaman | `about` (EN) / `tentang` (ID) |
| `translation_key` | Disarankan | Penghubung bahasa | `about` |
| `template` | Ya | Pilihan template: `default`, `about`, atau `contact` | `default` |
| `hero_title` | Opsional | Judul hero section (khusus template about/contact) | `We build modern websites` |
| `hero_description` | Opsional | Deskripsi hero section | `Learn more about us...` |
| `hero_image` | Opsional | Gambar hero section | `/image/en-home-section-hero.png` |
| `form_email_forward`| Opsional | Tujuan email form (khusus template contact) | `hello@kukode.com` |
| `seo_title` | Opsional | Meta title SEO | `About Us | Kukode` |
| `seo_description` | Opsional | Meta description SEO | `About Kukode Digital...` |
| `seo_image` | Opsional | Gambar share sosial | `/image/default-thumbnail.jpg` |
| `draft` | Opsional | `false` atau `true` | `false` |
| `content` | Opsional | Isi teks markdown halaman | `## Our Story\n\nKukode adalah...` |

---

### 3. Portfolio (`data/portfolio.csv`)

| Nama Kolom | Wajib? | Keterangan | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `title` | Ya | Nama proyek | `E-Commerce Store Redesign` |
| `custom_slug` | Opsional | URL slug | `ecommerce-redesign` |
| `category` | Opsional | Company Profile, E-Commerce, Web App, dll. | `E-Commerce` |
| `client` | Opsional | Nama klien | `Acme Corp` |
| `image` | Opsional | Gambar cover proyek | `https://picsum.photos/600/400?1` |
| `summary` | Opsional | Ringkasan singkat proyek | `Rebuilding online store for 2x speed.` |
| `cta_heading` | Opsional | Judul box call to action | `Ready to start?` |
| `cta_subheading` | Opsional | Subjudul box call to action | `Contact us today.` |
| `cta_button_text` | Opsional | Teks tombol CTA | `Get a Quote` |
| `cta_button_link` | Opsional | Link tombol CTA | `/#contact` |
| `draft` | Opsional | `false` atau `true` | `false` |
| `body` | Opsional | Detail studi kasus / markdown | `## Challenge\n\nThe client needed...` |

