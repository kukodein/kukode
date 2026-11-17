# Tutorial Implementasi Playwright untuk kukode

Paket ini berisi 128 test (TypeScript) yang dipecah per grup, dua varian `playwright.config`, dan dua workflow GitHub Actions.

> **Status verifikasi:** paket ini lolos typecheck (`tsc`) dan semua test terdaftar di kedua config, tetapi **belum pernah dijalankan terhadap situs** (lingkungan tempat paket dibuat tidak bisa mengunduh browser maupun membuka `kukode.my.id`). Run pertama di mesin Anda adalah verifikasi sebenarnya — harap ekspektasi beberapa test gagal di awal (lihat bagian 7).

---

## 1. Isi paket

```
kukode-playwright/
├─ TUTORIAL.md                       ← file ini
├─ package.json                      ← dependency + script per grup
├─ playwright.config.ts              ← CONFIG B: proyek terpisah (use + baseURL)
├─ playwright.config.kukode.ts       ← CONFIG A: ditempel di project kukode (build+preview otomatis)
├─ .gitignore
├─ .github/workflows/
│   ├─ playwright.yml                ← CI untuk Config A (matrix per grup)
│   └─ playwright-remote.yml         ← CI untuk Config B (uji situs live, terjadwal)
└─ tests/
    ├─ tsconfig.json
    ├─ fixtures/base.ts              ← fixture & helper bersama (satu-satunya tempat setup umum)
    ├─ smoke/      routing.spec.ts
    ├─ ui/         navbar · language · theme · cookie-consent · whatsapp-widget · back-to-top · faq
    ├─ forms/      contact-form.spec.ts
    ├─ content/    article-list · article-detail · portfolio
    ├─ seo/        seo · http-headers
    └─ quality/    responsive · accessibility · visual · performance · resilience
```

## 2. Pilih skenario

| | **A. Di dalam project kukode** | **B. Proyek terpisah** |
|---|---|---|
| Cocok untuk | Tes jadi bagian repo, jalan di PR sebelum deploy | Belajar / uji situs live tanpa menyentuh repo kukode |
| Config | `playwright.config.kukode.ts` → rename jadi `playwright.config.ts` | `playwright.config.ts` (apa adanya) |
| Target tes | Build lokal `astro preview` (`http://127.0.0.1:4321`) | `BASE_URL` (default `https://kukode.my.id`) |
| Server | Dijalankan otomatis (`webServer`) | Tidak ada |
| Workflow | `playwright.yml` | `playwright-remote.yml` |

Kedua skenario memakai folder `tests/` yang sama. Tes **tidak** menulis URL di dalam kode; semuanya mengikuti `use.baseURL` dari config.

---

## 3. Skenario A — di dalam project kukode

### 3.1 Salin file

Dari root project kukode:

```bash
# misal paket ini di ../kukode-playwright
cp ../kukode-playwright/playwright.config.kukode.ts ./playwright.config.ts
cp -r ../kukode-playwright/tests ./tests
mkdir -p .github/workflows
cp ../kukode-playwright/.github/workflows/playwright.yml .github/workflows/
```

### 3.2 Install dependency

```bash
npm i -D @playwright/test @axe-core/playwright @types/node
npx playwright install chromium          # tambah firefox webkit bila perlu
```

Versi `@playwright/test` minimal **1.49** (paket ini ter-install dengan 1.63.0 saat diuji typecheck) (dipakai: `page.clock`, `toMatchAriaSnapshot`).

### 3.3 Tambahkan script (opsional tapi disarankan)

Gabungkan bagian `scripts` dari `package.json` paket ini ke `package.json` kukode, misalnya:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test tests/ui",
"test:e2e:seo": "playwright test tests/seo",
"report": "playwright show-report"
```

### 3.4 Rapikan `.gitignore` dan tsconfig

Tambahkan ke `.gitignore` kukode:

```
test-results/
playwright-report/
blob-report/
```

Folder `tests/` punya `tsconfig.json` sendiri. Bila Anda menjalankan `astro check`, tambahkan `"exclude": ["tests"]` pada `tsconfig.json` kukode agar tidak ikut diperiksa dengan setelan Astro.

### 3.5 Jalankan

```bash
npx playwright test
```

Config otomatis menjalankan `npm run build && npm run preview` dengan `ENV=production` dan `PUBLIC_SITE_URL=http://127.0.0.1:4321`. Alasannya (dari `astro.config.mjs`): bila `ENV` bukan `production`, situs menambahkan `X-Robots-Tag: noindex`, `robots.txt` berisi `Disallow: /`, dan canonical memakai domain fallback `https://kukode.com`. Dengan dua variabel tadi, perilaku preview setara produksi dan tes SEO bermakna.

Cek cepat bahwa preview benar-benar "mode produksi":

```bash
npm run build && npm run preview -- --port 4321 &
curl -s http://127.0.0.1:4321/robots.txt     # tidak boleh berisi "Disallow: /" polos
```

Trik mempercepat saat iterasi:

```bash
npm run build                                # sekali
PW_SKIP_BUILD=1 npx playwright test tests/ui # tanpa build ulang
npm run preview &                            # server sudah jalan → reuseExistingServer
```

Mengarahkan Config A ke situs live (webServer otomatis mati):

```bash
BASE_URL=https://kukode.my.id npx playwright test tests/smoke tests/seo
```

### 3.6 GitHub Actions

`playwright.yml` menjalankan **satu job per grup** (`smoke, ui, forms, content, seo, quality`), jadi di tab *Actions* langsung tampak grup mana yang merah. Tiap job mengunggah `playwright-report` (HTML) dan, bila gagal, `test-results/` (trace, screenshot, video).

Hal yang perlu diperhatikan di repo kukode:

- Repo Anda sudah punya workflow `auto-post.yml` yang meng-commit artikel harian. `playwright.yml` memakai `paths-ignore: src/content/**` pada `push` agar commit otomatis itu tidak memicu 6 job tiap hari. Hapus baris itu bila memang ingin tes tiap artikel baru.
- Tes visual **dikecualikan** di CI (`--grep-invert @visual`) sampai baseline snapshot Linux ter-commit (lihat bagian 6).
- Build Astro dijalankan di dalam tiap job (matrix) — boros menit CI tetapi sederhana. Alternatif hemat: satu job `build` yang meng-upload `dist/`, lalu job tes memakai artifact itu; saya tidak membuatnya agar workflow tetap mudah dibaca.

---

## 4. Skenario B — proyek terpisah

```bash
cd kukode-playwright
npm install
npx playwright install chromium firefox webkit
npx playwright test                               # → https://kukode.my.id
BASE_URL=https://deploy-preview-12--kukode.netlify.app npx playwright test
```

`playwright-remote.yml` menjalankan smoke + SEO + UI (aman untuk produksi) tiap hari pukul 08:00 WIB dan bisa dipicu manual dengan URL sendiri.

**Etika menguji situs live:** `workers` dibatasi 2 di CI, analytics diblokir oleh fixture agar statistik GA tidak tercemar, dan `wa.me` selalu di-mock sehingga tidak ada WhatsApp sungguhan yang terbuka. Form kontak tidak mengirim ke server, jadi tidak ada data yang tertulis. Jangan mengotomasi login `/admin/` (Sveltia CMS) di produksi.

---

## 5. Menelusuri error dengan struktur grup

Urutan menelusuri saat sebuah test merah:

1. **Folder = lapisan masalah.**
   - `smoke/` merah → situs/route rusak (build, deploy, redirect).
   - `ui/` → komponen interaktif (navbar, tema, cookie, WA, FAQ).
   - `forms/` → form kontak.
   - `content/` → artikel/portfolio (data konten, template).
   - `seo/` → meta, sitemap, robots, header (sering akibat env/deploy, bukan kode UI).
   - `quality/` → responsive, a11y, visual, performa.
2. **Buka file spec-nya.** Komentar di bagian atas tiap file memuat *"Kode kukode terkait"*, mis. `ui/cookie-consent.spec.ts` → `src/components/CookieConsent.astro`.
3. **Buka trace**, bukan hanya log: `npx playwright show-report`, klik test gagal → Trace. Di sana ada snapshot DOM per langkah, network, dan console.
4. **Jalankan hanya yang gagal:**

```bash
npx playwright test tests/ui/cookie-consent.spec.ts          # satu file
npx playwright test -g "Accept menyimpan"                    # berdasarkan judul
npx playwright test tests/ui --debug                         # Inspector, langkah demi langkah
npx playwright test --last-failed                            # ulangi yang gagal terakhir
npx playwright show-trace test-results/<folder>/trace.zip    # buka trace langsung
```

5. **Tag lintas folder:** `@smoke`, `@seo`, `@a11y`, `@visual`, `@perf`, `@headers`.

```bash
npx playwright test --grep @smoke
npx playwright test --grep-invert "@visual|@perf"
```

Pola kegagalan umum:

| Gejala | Kemungkinan penyebab |
|---|---|
| Banyak test `ui/` gagal sekaligus | Cookie banner / bubble WA menutupi elemen → pastikan test memakai `consentedPage` |
| Semua test `seo/` soal canonical/robots gagal | `ENV`/`PUBLIC_SITE_URL` tidak diset pada build yang diuji |
| `quality/visual` gagal di CI tapi lolos lokal | Baseline dibuat di OS lain (font beda) → buat baseline di Linux/Docker |
| Test gagal hanya di Firefox/WebKit | Izin clipboard (`clipboard-read`) hanya ada di Chromium; test sudah di-skip, cek apakah ada yang terlewat |
| Timeout `webServer` | Build lebih dari 5 menit → naikkan `webServer.timeout`, atau jalankan build terpisah dan pakai `PW_SKIP_BUILD=1` |

## 6. Tes visual (baseline snapshot)

Tes `quality/visual.spec.ts` membandingkan screenshot dengan baseline. Run pertama selalu "gagal" karena baseline belum ada — itu normal.

Agar konsisten antara lokal dan CI, buat baseline di Linux memakai image resmi Playwright (ganti `<VERSI>` dengan hasil `npx playwright --version`, mis. `1.63.0`; versi image harus sama persis dengan `@playwright/test` yang ter-install, dan tag yang tersedia bisa dicek di halaman image Playwright di Microsoft Container Registry):

```bash
docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v<VERSI>-noble \
  sh -c "npm ci && npx playwright test tests/quality/visual.spec.ts --update-snapshots"
```

Lalu commit folder `tests/quality/visual.spec.ts-snapshots/`. Setelah itu jalankan workflow secara manual (`Run workflow` → centang `visual`) untuk mengikutsertakan tes visual. Setelah desain sengaja berubah, perbarui baseline dengan perintah yang sama dan periksa diff gambarnya di laporan HTML sebelum commit.

## 7. Tes yang sengaja berpotensi gagal (`[HIPOTESIS]`)

Beberapa test berjudul `[HIPOTESIS]` memeriksa dugaan bug dari pembacaan kode, bukan fakta yang sudah terbukti:

| Test | Dugaan |
|---|---|
| `ui/cookie-consent` — link privasi tidak 404 | Halaman EN `/privacy-policy/` ditandai `draft: true` |
| `forms/contact-form` — email tidak valid ditolak | Form `novalidate`, hanya cek "tidak kosong". Memakai `test.fail()`: bila ternyata lolos, Playwright melapor *unexpected pass* |
| `ui/navbar` — Portfolio di versi ID memakai prefix `/id` | URL hardcode `/portfolio/` |
| `ui/faq` — tombol punya `aria-expanded` | Atribut tidak ditemukan di markup |
| `quality/accessibility` — ada `<main>` | `#main-content` hanya `<div>` |
| `seo/seo` — canonical & og:url satu origin | Fallback `site` = `kukode.com` bila `PUBLIC_SITE_URL` kosong (di Config A sudah di-set, jadi test ini baru "berbicara" saat menguji situs live) |

Bila sebuah dugaan terbukti salah, ubah test-nya menjadi asersi biasa (hapus tanda `[HIPOTESIS]` / `test.fail`). Bila terbukti benar, perbaiki situs atau tandai dengan `test.fixme()` sampai diperbaiki — jangan menghapus tesnya.

Perbedaan lokal vs live yang sudah ditangani di kode tes:

- Test **redirect pagination** (`/article/1` → `/article/`) di-skip di lokal, karena `astro preview` membuat halaman meta-refresh (status 200); status 301 baru dibuat Netlify.
- Test **header keamanan/cache** (`seo/http-headers`) di-skip di lokal karena `_headers` hanya berlaku di Netlify.
- Test **kukode.netlify.app → kukode.my.id** hanya jalan bila `baseURL` bukan lokal dan host-nya `kukode.my.id`.

## 8. Menambah test baru

1. Letakkan di grup yang tepat (UI → `ui/`, dst.). Satu fitur = satu file.
2. Impor dari fixture bersama, **bukan** dari `@playwright/test`:

```ts
import { test, expect } from '../fixtures/base';

test.describe('Fitur baru @smoke', () => {
  test('melakukan sesuatu', async ({ consentedPage: page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Blog', exact: true })).toBeVisible();
  });
});
```

3. Gunakan `consentedPage` untuk test fungsional; pakai `page` biasa hanya bila memang menguji cookie banner atau bubble WA.
4. Test yang mengharapkan error console (mis. aset sengaja diblokir) menambahkan `test.use({ failOnConsoleError: false })` di dalam `describe`-nya.
5. Prioritaskan locator berbasis peran (`getByRole`, `getByLabel`) dibanding CSS. Selector `#id` dipakai di paket ini karena komponen kukode memang memberi id yang stabil.
6. Tambahkan komentar "Kode kukode terkait" di header file bila membuat file baru, agar penelusuran tetap mudah.

## 9. Fixture bersama (`tests/fixtures/base.ts`)

| Fixture | Jenis | Fungsi |
|---|---|---|
| `isolateThirdParty` | otomatis | Memblokir GA/GTM, meng-mock `wa.me` dan `api.whatsapp.com` |
| `consoleErrors` | otomatis | Mengumpulkan `pageerror` dan `console.error`; test gagal bila ada, kecuali `failOnConsoleError: false` |
| `consentedPage` | opsional | `page` dengan `kk-cookie-consent=accepted` dan `kk-wa-dismissed=1` sudah terpasang |

Helper yang diekspor: `ROUTES`, `SEO_ROUTES`, `VIEWPORTS`, `scrollThrough`, `firstArticleHref`, `metaContent`, `collectSitemapUrls`, `getLocal`, `getSession`, `isLocal`.

## 10. Asumsi yang perlu Anda verifikasi di run pertama

- Teks menu (`Services`, `Pricing`, `Layanan`, `Harga`, …) dan nama aksesibel tombol (`Chat on WhatsApp`, `Back to top`) diambil dari kode sumber dan pengaturan CMS default; bila `header_nav` di CMS Anda diubah, sesuaikan di `ui/navbar.spec.ts`.
- Nama environment variable (`ENV`, `PUBLIC_SITE_URL`) berasal dari `astro.config.mjs` versi di zip yang Anda unggah. Cek kembali bila file itu berubah.
- Pesan `alert()` form kontak ("Please enter your name.", "Mohon masukkan nama Anda.") diambil dari kode; ubah di `forms/contact-form.spec.ts` bila teksnya direvisi.
- Test `quality/performance` memakai ambang longgar (LCP < 4 dtk) karena hasil sangat bergantung jaringan. Ini bukan audit Lighthouse.
