# Kukode - Astro v5 + Sveltia CMS

Website resmi Kukode Digital Technology berbasis **Astro v5**, **Sveltia CMS** (Git-based headless CMS), dan **Bootstrap 5**. Mendukung penuh arsitektur multi-bahasa (English & Bahasa Indonesia), optimasi SEO tingkat lanjut, sistem Page Template polymorphic, XML Sitemap bergaya RankMath/Yoast SEO, serta fitur dark/light mode tanpa flicker (anti-FOUC).

---

## 📌 Daftar Isi
1. [Penjelasan Singkat](#-penjelasan-singkat)
2. [Tech Stack](#-tech-stack)
3. [Fitur Utama](#-fitur-utama)
4. [Skema & Koleksi Konten (Content Collections)](#-skema--koleksi-konten-content-collections)
5. [Sistem Page Template](#-sistem-page-template)
6. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
7. [Panduan Instalasi & Menjalankan Lokal](#-panduan-instalasi--menjalankan-lokal)
8. [Panduan Manajemen Konten (Sveltia CMS)](#-panduan-manajemen-konten-sveltia-cms)
9. [Panduan Migrasi Data (Spreadsheet / CSV ke Sveltia CMS)](#-panduan-migrasi-data-spreadsheet--csv-ke-sveltia-cms)
10. [Panduan Deployment ke Server / Hosting](#-panduan-deployment-ke-server--hosting)
11. [Environment Variables](#-environment-variables)

---

## 📖 Penjelasan Singkat

Proyek ini dibangun sebagai platform website agensi/studio teknologi digital modern dengan prinsip:
- **Ultra Cepat**: Static Site Generation (SSG) menghasilkan file HTML statis yang dapat di-cache di CDN edge secara instan.
- **Git-based Headless CMS**: Seluruh artikel, halaman, portofolio, dan konfigurasi situs tersimpan sebagai file Markdown dan JSON di dalam repository Git, dikelola menggunakan Sveltia CMS tanpa memerlukan database SQL yang berat.
- **Bilingual Terintegrasi**: URL bahasa Inggris di root (`/`) dan bahasa Indonesia di subpath (`/id/`), lengkap dengan mapping slug kustom dan hreflang switcher otomatis.
- **SEO Ready**: Dilengkapi Schema.org JSON-LD (Organization, Article, Breadcrumb, FAQ), Open Graph, Twitter Cards, serta XML sitemap interaktif dengan visual preview XSLT.

---

## 🛠 Tech Stack

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework Utama** | [Astro v5](https://astro.build/) | Web framework berorientasi konten dengan arsitektur Islands dan Static Build (SSG) |
| **Content Management** | [Sveltia CMS](https://sveltiacms.app/) | Git-based Headless CMS ringan, modern, dan kompatibel dengan Decap/Netlify CMS |
| **Styling & UI** | [Bootstrap 5](https://getbootstrap.com/) + Custom CSS | Framework CSS responsif dengan styling kustom modern Kukode (`public/css/kukode.css`) |
| **Visual Lightbox** | [GLightbox](https://biati-digital.github.io/glightbox/) | Pustaka modal galeri gambar resolusi tinggi dengan zoom interaktif dan navigasi swipe mobile |
| **Page Transitions** | Astro ClientRouter | SPA-like navigation cepat tanpa reload browser penuh |
| **Type Safety & Schema** | [Zod](https://zod.dev/) & TypeScript | Validasi skema ketat untuk seluruh koleksi konten Markdown, JSON, dan pengaturan situs |
| **Markdown Parser** | [marked](https://marked.js.org/) | Parser markdown cepat untuk field konten WYSIWYG/Markdown di front-end |
| **SEO & Sitemap** | `@astrojs/sitemap` + Custom Endpoint | Generate `sitemap-index.xml`, `sitemap-0.xml`, `sitemap.xml`, dan `sitemap.xsl` |
| **Hosting & Edge CDN** | Cloudflare Pages / Netlify | Penyajian aset dari 300+ edge data center global dengan latensi sub-detik |

---

## ✨ Fitur Utama

- **Multi-Bahasa Terintegrasi (i18n)**:
  - English sebagai default locale di root URL (`https://kukode.com/`).
  - Bahasa Indonesia dengan subpath `/id/` (`https://kukode.com/id/`).
  - Slug kustom terpisah per bahasa (contoh: `/about/` di EN dan `/id/tentang/` di ID).
  - Field `translation_key` yang otomatis menyinkronkan pasangan halaman antar-bahasa pada language toggle header & mobile.
- **Sistem Page Template Dinamis (Polymorphic)**:
  - Mendukung 4 jenis template halaman di CMS: **Default Page**, **About Page V2**, **Contact Page**, dan **Service Page V2**.
  - Front-end otomatis memuat layout dan skema data yang sesuai dari direktori `src/page-template/`.
- **Template Halaman Service V2 (Layanan Komprehensif)**:
  - Didesain khusus untuk meyakinkan calon klien korporat dengan 10 section terstruktur:
    1. **Hero Section**: Headline persuasif, dual CTA, rating kepuasan klien 4.9/5, browser frame mockup, dan 3 kartu metrik kecepatan nyata (Load Time < 0.8s, 99.9% Uptime, Skor PageSpeed 100).
    2. **Solusi & Jenis Website**: 6 kategori spesifik yang bisa dibangun Kukode (*Corporate Profile, High-Converting Landing Page, Digital Catalog B2B, Studio Portfolio, Editorial Hub, Custom Web*).
    3. **Perbandingan Arsitektur Objektif**: Komparasi berdampingan antara website tradisional berbasis WordPress vs Arsitektur Modern Jamstack Kukode.
    4. **Deliverables Lengkap (4 Pilar)**: *UI/UX Design Modern*, *CMS Mandiri Sveltia*, *Technical SEO & PageSpeed 95+*, dan *Keamanan SSL & Kepemilikan Penuh*.
    5. **Pilihan Paket & Transparansi Harga**: Paket *Starter*, *Professional (Most Popular)*, dan *Enterprise Custom* yang dilengkapi kartu **100% Code Ownership Guarantee**.
    6. **Tech Stack Berlogo Vektor**: Kartu teknologi berbingkai modern dengan logo resmi SVG (`Astro`, `Sveltia CMS`, `Cloudflare Pages`, `GLightbox`).
    7. **Layanan Tambahan (Add-ons)**: *Copywriting*, *Ekspansi Bahasa ke-3*, dan *Maintenance Bulanan*.
    8. **Alur Kerja 5 Tahap Terukur**: Timeline transparan mulai dari Discovery, UI Concept, Koding & CMS, Audit QA, hingga Peluncuran Live & Training.
    9. **FAQ Interaktif & Schema.org**: Tanya jawab transparan dengan auto-injection schema JSON-LD `@type: FAQPage`.
    10. **High-Impact CTA Band**: Akses langsung konsultasi WhatsApp dengan teks pra-format dan formulir pesan.
- **Template Halaman About V2 (Studio Rekayasa Web)**:
  - **Interactive Audit Terminal Mockup**: Mockup CLI dark-mode yang mensimulasikan live audit Google PageSpeed (100/100, FCP 0.28s, 0ms TBT).
  - **4 Bento Pillars**: Kecepatan tanpa kompromi, keamanan tanpa celah SQL injection, kemudahan CMS mandiri, dan konsultasi langsung bersama engineer.
  - **Studio Manifesto & Philosophy**: Cerita di balik standar rekayasa web Kukode.
  - **Founder Spotlight**: Profil Lead Software Engineer (**Ahmad Muzakki**) lengkap dengan badge verifikasi dan link profil sosial.
  - **Milestone Timeline**: Desain garis waktu vertikal modern pencapaian studio (2020 - 2026).
- **Halaman Detail Portofolio & GLightbox Gallery**:
  - Tampilan studi kasus proyek lengkap dengan deskripsi, ringkasan klien, layanan, tahun, live website URL, dan tech stack.
  - **Section Project Gallery & Screenshots**: Galeri foto tangkapan layar responsif yang terletak langsung setelah artikel studi kasus.
  - Setiap foto dapat diklik untuk membuka modal zoom fullscreen GLightbox dengan navigasi sentuh (swipe mobile), loop galeri, dan keterangan caption.
  - Field `gallery` terintegrasi di frontmatter dan Sveltia CMS.
- **Komponen Interaktif Mengambang (Floating Widgets)**:
  - **WhatsApp Widget (`WhatsAppWidget.astro`)**: Tombol mengapung di kanan bawah layar dengan jendela chatbox interaktif dan avatar admin untuk memudahkan calon klien berkonsultasi instan.
  - **Cookie Consent Banner (`CookieConsent.astro`)**: Banner kepatuhan privasi (GDPR/ePrivacy) dengan tombol persetujuan dan persistensi `localStorage`.
- **RankMath / Yoast SEO Style XML Sitemap**:
  - Dilengkapi XSL stylesheet (`public/sitemap.xsl`) sehingga sitemap terlihat berformat tabel interaktif, rapi, dan informatif saat dibuka di browser.
  - Standar XML 100% valid untuk perayapan Google Search Console dan Bing Webmaster Tools.
- **Dark / Light Mode Anti-FOUC**:
  - Toggle tema instan dengan persistensi `localStorage`.
  - Script inline di `<head>` untuk mencegah kedipan layar putih (Flash of Unstyled Content) saat navigasi antar-halaman.
- **SEO & Structured Data Lengkap**:
  - Standarisasi field SEO (`title`, `description`, `image`, `og_image`).
  - Schema JSON-LD otomatis: `Article`, `BreadcrumbList`, `Organization`, dan `FAQPage`.
  - Canonical URL, tag hreflang (`en`, `id`, `x-default`), Open Graph Facebook/LinkedIn, dan Twitter Cards.

---

## 🗂 Skema & Koleksi Konten (Content Collections)

Didefinisikan pada [`src/content.config.ts`](src/content.config.ts) dan dikonfigurasikan di CMS pada [`public/admin/config.yml`](public/admin/config.yml):

### 1. `pages` (Koleksi Halaman Statis & Dinamis)
- **Folder**: `src/content/pages/{locale}/`
- **i18n**: Ya (`en` & `id`)
- **Field Utama**:
  - `custom_slug` (string, opsional): Custom URL slug per bahasa.
  - `translation_key` (string, duplicate): Kunci penyambung versi EN dan ID.
  - `seo` (object): `title`, `description`, `image`.
  - `draft` (boolean): Status publikasi halaman.
  - `page` (object polymorphic): Menentukan template (`default`, `about`, `contact`, `service`) beserta seluruh field dinamis section masing-masing.

### 2. `portfolio` (Karya & Proyek Portofolio)
- **Folder**: `src/content/portfolio/`
- **i18n**: Single locale (EN default)
- **Field**:
  - `title` (string): Nama proyek.
  - `custom_slug` (string): Slug URL halaman detail proyek.
  - `category` (select): Kategori (Company Profile, E-Commerce, Landing Page, Blog, Web App, Custom).
  - `client` (string): Nama klien / brand.
  - `year` (string): Tahun pengerjaan.
  - `description` (text): Ringkasan singkat proyek.
  - `image` (image): Gambar mockup cover utama.
  - `gallery` (list of objects): Koleksi gambar tangkapan layar proyek dengan field `image` dan `caption` (terintegrasi dengan GLightbox Zoom).
  - `live_url` (string): Tautan URL website live.
  - `tools` (list): Daftar teknologi yang digunakan (misal: Astro, Bootstrap 5, TypeScript).
  - `featured` (boolean): Menampilkan proyek di section featured homepage.
  - `draft` (boolean): Status draft/publikasi.
  - `body` (markdown): Uraian lengkap studi kasus (*Overview, The Challenge, The Solution, Results*).

### 3. `posts` (Artikel & Berita Blog)
- **Folder**: `src/content/posts/{locale}/`
- **i18n**: Ya (`en` & `id`)
- **Field**: `title`, `custom_slug`, `translation_key`, `description`, `seo`, `pubDate`, `updatedDate`, `image` (Featured Image), `category` (Relasi), `author` (Relasi), `draft`, `body` (Markdown).

### 4. `authors` (Data Penulis Konten)
- **Folder**: `src/content/authors/{locale}/`
- **i18n**: Ya (`en` & `id`)
- **Field**: `name`, `custom_slug`, `role`, `bio`, `avatar`, `email`, `instagram`, `website`, `seo`.

### 5. `categories` (Kategori Artikel)
- **Folder**: `src/content/categories/{locale}/`
- **i18n**: Ya (`en` & `id`)
- **Field**: `name`, `slug`, `translation_key`, `description`.

### 6. `settings` (Files Collection Pengaturan Situs)
- **File**: `src/content/settings/{locale}/`
  - **`general.json`**: Logo light & dark, menu navigasi header, header CTA button, footer 3-kolom navigasi, deskripsi footer, link media sosial (IG, FB, YT, WA, LinkedIn), dan teks copyright otomatis.
  - **`homepage/index.md`**: Seluruh konten dan saklar visibilitas section beranda (Hero, Trusted, Marquee, Numbers, About, Services, Process, Portfolio, Stack, Testimonials, Why Us, Pricing, FAQ, CTA Band).
  - **`archives.json`**: Pengaturan SEO, judul header, deskripsi, dan CTA untuk halaman arsip (`articles`, `portfolio`, `authors`, `categories`).
  - **`404.json`**: Pengaturan konten dan teks tombol pada halaman error 404.

---

## 🎨 Sistem Page Template

Ketika membuat atau mengedit halaman di menu **Pages** pada CMS, Anda dapat memilih salah satu dari 4 template berikut:

```
src/page-template/
├── Default.astro    # Layout standar untuk artikel teks atau kebijakan privasi
├── About.astro      # Layout Tentang Kami V2 (Audit Terminal, 4 Bento Pillars, Manifesto, Founder, Timeline)
├── Contact.astro    # Layout Kontak (Hero, form kontak interaktif, kartu alamat, info WhatsApp/Email)
└── Service.astro    # Layout Layanan V2 (10 section: Hero, Use Cases, Comparison, Scope, Pricing, Stack Logos, Process, FAQ, CTA)
```

### Panduan Menambahkan Template Baru:
1. Daftarkan opsi tipe template baru di bawah `fields.page.types` pada [`public/admin/config.yml`](public/admin/config.yml).
2. Perbarui enum template pada skema Zod di [`src/content.config.ts`](src/content.config.ts).
3. Buat file layout baru di `src/page-template/NamaTemplate.astro`.
4. Daftarkan import dan mapping template pada [`src/pages/[...slug].astro`](src/pages/[...slug].astro) dan [`src/pages/id/[...slug].astro`](src/pages/id/[...slug].astro).

---

## 📂 Struktur Direktori Proyek

```text
.
├── data/                      # Template CSV & file sumber migrasi spreadsheet
│   ├── README.md              # Dokumentasi spesifikasi kolom spreadsheet
│   ├── sample-pages.csv       # Contoh format CSV halaman statis
│   ├── sample-portfolio.csv   # Contoh format CSV portofolio
│   └── sample-posts.csv       # Contoh format CSV artikel blog
├── dist/                      # Direktori output build produksi (HTML, CSS, JS, Assets)
├── public/                    # Aset statis publik
│   ├── admin/                 # Sveltia CMS UI & config.yml
│   │   ├── config.yml         # Konfigurasi koleksi dan widget Sveltia CMS
│   │   └── index.html         # Entry point Sveltia CMS app
│   ├── css/                   # Stylesheet kustom
│   ├── image/                 # Gambar upload media & logo
│   │   └── stack/             # Logo vektor SVG tech stack resmi (Astro, Sveltia, Cloudflare, GLightbox)
│   ├── js/                    # Script client-side
│   ├── vendor/                # Pustaka third-party (Bootstrap, GLightbox)
│   └── sitemap.xsl            # Stylesheet XSLT untuk preview sitemap di browser
├── scripts/                   # Script otomasi & utilitas migrasi
│   ├── utils/csv-parser.mjs   # Parser CSV RFC 4180 mandiri
│   ├── migrate-pages.mjs      # Script migrasi halaman ke Sveltia CMS
│   ├── migrate-portfolio.mjs  # Script migrasi portofolio ke Sveltia CMS
│   └── migrate-posts.mjs      # Script migrasi artikel ke Sveltia CMS
├── src/
│   ├── components/            # Komponen reusable (Header, Footer, SEOHead, WhatsAppWidget, CookieConsent, dll.)
│   ├── content/               # File konten Markdown & JSON
│   │   ├── authors/           # Data author (en & id)
│   │   ├── categories/        # Data kategori (en & id)
│   │   ├── homepage/          # Data konten homepage (en & id)
│   │   ├── pages/             # Halaman statis (en & id)
│   │   ├── portfolio/         # Data portofolio proyek
│   │   ├── posts/             # Artikel blog (en & id)
│   │   └── settings/          # Pengaturan umum & arsip (en & id)
│   ├── layouts/               # Layout dasar (BaseLayout.astro)
│   ├── page-template/         # Komponen template halaman dinamis
│   ├── pages/                 # Rute halaman Astro (EN & /id/)
│   └── content.config.ts      # Definisi skema Astro Content Collections (Zod)
├── astro.config.mjs           # Konfigurasi Astro (i18n, sitemap, hooks)
├── package.json               # Dependensi & NPM scripts
└── README.md                  # Dokumentasi proyek
```

---

## 💻 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- **Node.js**: Versi `18.20.0` atau `20.x` ke atas disarankan.
- **NPM** atau package manager pilihan (`pnpm`, `yarn`).

### 1. Clone Repository & Install Dependensi
```bash
git clone https://github.com/kukodein/kukode.git
cd sveltia
npm install
```

### 2. Konfigurasi Environment File
Salin file template environment:
```bash
cp .env.example .env
```
Sesuaikan isi `.env`:
```ini
ENV=local
PUBLIC_SITE_URL=http://localhost:4321
GA_ID=
GTM_ID=
```

### 3. Menjalankan Website (Front-End Saja)
```bash
npm run dev
```
Buka browser di: `http://localhost:4321/`

### 4. Menjalankan Website + Local CMS Proxy (Untuk Edit Konten Lokal)
Jika ingin mengedit konten di CMS secara lokal tanpa harus commit ke GitHub:
```bash
npm run dev:cms
```
Perintah ini akan menjalankan Astro dev server sekaligus `@sveltia/cms-proxy`. Buka admin panel di:
`http://localhost:4321/admin/`

---

## 📝 Panduan Manajemen Konten (Sveltia CMS)

### Mengakses CMS
- **Lokal**: Buka `http://localhost:4321/admin/` (jalankan dengan `npm run dev:cms`).
- **Produksi**: Buka `https://kukode.com/admin/` dan login menggunakan akun GitHub yang memiliki hak akses ke repository.

### Mengatur Bahasa di CMS
- Di bagian atas editor konten, gunakan dropdown bahasa untuk beralih antara **English** dan **Bahasa Indonesia**.
- Input kedua bahasa bersifat independen (`i18n: true`), sehingga data bahasa Indonesia tidak akan tertimpa saat mengedit bahasa Inggris.

### Menghubungkan Halaman Multi-Bahasa
- Masukkan nilai yang sama pada field **Translation Key** di kedua bahasa (misalnya `about-us` untuk `/about/` dan `/id/tentang/`).
- Tombol bendera / toggle bahasa di header front-end akan otomatis mengarahkan pengunjung ke halaman padanannya.

---

## 📥 Panduan Migrasi Data (Spreadsheet / CSV ke Sveltia CMS)

Proyek ini dilengkapi dengan script utilitas mandiri berbasis Node.js untuk mengonversi data massal dari **Google Sheets** atau **Microsoft Excel** menjadi file Markdown siap pakai yang 100% kompatibel dengan skema Zod dan konfigurasi Sveltia CMS.

### 🚀 Cara Cepat Migrasi

1. **Siapkan Data**: Buat tabel spreadsheet (di Google Sheets atau Excel) sesuai struktur kolom di bawah.
2. **Ekspor ke CSV**:
   - Di Google Sheets: Pilih menu **File** &rarr; **Download** &rarr; **Comma Separated Values (.csv)**.
3. **Simpan File**: Letakkan file `.csv` di folder `data/`:
   - Artikel: `data/posts.csv`
   - Halaman Statis: `data/pages.csv`
   - Portofolio: `data/portfolio.csv`
4. **Jalankan Perintah Migrasi**:
   ```bash
   # Migrasi artikel blog (EN & ID)
   npm run migrate:posts

   # Migrasi halaman statis (EN & ID dengan pilihan template)
   npm run migrate:pages

   # Migrasi proyek portofolio
   npm run migrate:portfolio
   ```
   *Atau jika file CSV disimpan di direktori lain:*
   ```bash
   node scripts/migrate-posts.mjs path/ke/file-anda.csv
   ```
5. **Cek Hasil**: Jalankan `npm run dev:cms` lalu buka `http://localhost:4321/admin/` untuk melihat dan mengedit konten yang telah diimpor.

---

### 📋 Ringkasan Struktur Kolom Spreadsheet

Contoh file CSV siap pakai tersedia di direktori [`data/`](data/):

#### 1. Posts / Artikel (`data/posts.csv` &rarr; [`data/sample-posts.csv`](data/sample-posts.csv))
| Kolom | Wajib | Keterangan | Contoh |
| :--- | :--- | :--- | :--- |
| `language` | Ya | `en` untuk Inggris, `id` untuk Indonesia | `id` |
| `title` | Ya | Judul artikel | `Pengembangan Web Modern 2026` |
| `custom_slug` | Tidak | Slug URL (otomatis di-slugify jika kosong) | `pengembangan-web-modern-2026` |
| `translation_key` | Ya | Kunci penghubung artikel EN dan ID | `modern-web-2026` |
| `category` | Tidak | Nama kategori (`Information`, `Website`, `Tutorial`) | `Tutorial` |
| `author` | Tidak | Nama author terdaftar (default: `Ahmad Muzakki`) | `Ahmad Muzakki` |
| `pubDate` | Ya | Tanggal terbit format `YYYY-MM-DD` | `2026-09-17` |
| `description` | Tidak | Ringkasan / kutipan artikel | `Ringkasan singkat artikel...` |
| `seo_title` | Tidak | Custom meta title SEO (default: `title`) | `Web Modern 2026 - Kukode` |
| `seo_description` | Tidak | Custom meta description SEO | `Pelajari tren pengembangan web...` |
| `seo_image` | Tidak | Path atau URL gambar OG/Social Share | `/image/default-thumbnail.jpg` |
| `image` | Tidak | Featured image thumbnail artikel | `/image/default-thumbnail.jpg` |
| `draft` | Tidak | Status draf: `true` / `false` | `false` |
| `body` | Tidak | Konten artikel lengkap dalam format Markdown | `## Bab 1\n\nIsi artikel...` |

#### 2. Pages / Halaman Statis (`data/pages.csv` &rarr; [`data/sample-pages.csv`](data/sample-pages.csv))
| Kolom | Wajib | Keterangan | Contoh |
| :--- | :--- | :--- | :--- |
| `language` | Ya | `en` atau `id` | `id` |
| `title` | Ya | Judul halaman | `Tentang Kami` |
| `custom_slug` | Tidak | Slug URL | `tentang` |
| `translation_key` | Ya | Kunci penyambung multi-bahasa | `about` |
| `template` | Ya | Pilihan template: `default`, `about`, atau `contact` | `about` |
| `hero_title` | Tidak | Judul hero section (template `about`/`contact`) | `Tentang Kukode Digital` |
| `hero_description` | Tidak | Deskripsi hero section (template `about`) | `Kami studio pengembangan web...` |
| `hero_image` | Tidak | Gambar banner hero (template `about`) | `/image/en-home-section-hero.png` |
| `form_email_forward`| Tidak | Alamat email penerima kontak (template `contact`) | `hello@kukode.com` |
| `seo_title` | Tidak | Meta title SEO (di root frontmatter) | `Tentang Kami | Kukode` |
| `seo_description` | Tidak | Meta description SEO | `Profil lengkap Kukode...` |
| `seo_image` | Tidak | Gambar preview SEO | `/image/default-thumbnail.jpg` |
| `draft` | Tidak | `false` atau `true` | `false` |
| `content` | Tidak | Isi teks halaman format Markdown | `## Visi Kami\n\nMembantu bisnis...` |

#### 3. Portfolio (`data/portfolio.csv` &rarr; [`data/sample-portfolio.csv`](data/sample-portfolio.csv))
| Kolom | Wajib | Keterangan | Contoh |
| :--- | :--- | :--- | :--- |
| `title` | Ya | Nama proyek | `Fintech Dashboard Platform` |
| `custom_slug` | Tidak | Slug URL portofolio | `fintech-dashboard` |
| `category` | Tidak | Kategori (`Company Profile`, `Web App`, dll.) | `Web App` |
| `client` | Tidak | Nama klien | `Acme Financial` |
| `image` | Tidak | Gambar screenshot / cover proyek | `https://picsum.photos/600/400?1` |
| `summary` | Tidak | Deskripsi singkat proyek | `Platform manajemen keuangan modern.` |
| `cta_heading` | Tidak | Judul box call-to-action | `Siap memulai proyek Anda?` |
| `cta_subheading` | Tidak | Subjudul box call-to-action | `Hubungi kami untuk konsultasi gratis.` |
| `cta_button_text` | Tidak | Label tombol CTA | `Hubungi Kami` |
| `cta_button_link` | Tidak | Link tujuan tombol CTA | `/#contact` |
| `draft` | Tidak | `false` atau `true` | `false` |
| `body` | Tidak | Detail studi kasus / teks Markdown | `## Gambaran Proyek\n\n...` |

> [!TIP]
> Dokumentasi teknis lebih detail mengenai aturan parsing CSV, penanganan baris baru di dalam sel spreadsheet, dan format escaping YAML dapat dilihat langsung di [data/README.md](data/README.md).

---

## 🚀 Panduan Deployment ke Server / Hosting

### 1. Build Static Site
Jalankan perintah build:
```bash
npm run build
```
Seluruh file statis siap saji akan dibuat di dalam folder `dist/`.

---

### 2. Deploy ke Cloudflare Pages / Vercel / Netlify

1. Hubungkan repository GitHub ke platform hosting pilihan Anda.
2. Atur pengaturan build:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Node.js Version**: `>= 18.20.0`
3. Tambahkan Environment Variables di dashboard hosting:
   - `ENV`: `production` (atau `staging`)
   - `PUBLIC_SITE_URL`: `https://kukode.com`

---

### 3. Deploy ke cPanel / Apache / Nginx (Self-Hosted)

1. Jalankan `npm run build` pada environment produksi (`ENV=production`).
2. Upload seluruh isi folder `dist/` ke root web server Anda (misal `public_html/`).
3. File `.htaccess` otomatis disertakan di dalam `dist/` untuk mengatur header keamanan dan robots tag bila berjalan di mode staging/non-production.

---

## ⚙️ Environment Variables

| Variable | Pilihan Nilai | Keterangan |
| :--- | :--- | :--- |
| `ENV` | `local` \| `staging` \| `production` | Menentukan status environment. Pada mode `local` dan `staging`, website secara otomatis menambahkan header `X-Robots-Tag: noindex, nofollow` untuk mencegah indeks search engine. |
| `PUBLIC_SITE_URL` | URL absolut (mis. `https://kukode.com`) | URL dasar situs yang digunakan untuk canonical link, sitemap, dan Open Graph image. |
| `GA_ID` | String (mis. `G-XXXXXXXXXX`) | Google Analytics Measurement ID (opsional). |
| `GTM_ID` | String (mis. `GTM-XXXXXXX`) | Google Tag Manager Container ID (opsional). |

---

## 📄 Lisensi
Hak Cipta &copy; Kukode Digital Technology. Seluruh hak dilindungi undang-undang.

