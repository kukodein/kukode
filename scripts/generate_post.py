import os
import random
import re
from datetime import datetime
from duckduckgo_search import DDGS
import google.generativeai as genai

# Konfigurasi Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# 1. Kategori & Kata Kunci Riset
# Catatan: Nama kategori harus cocok dengan yang ada di folder src/content/categories/
CATEGORIES = {
    "Teknologi": [
        "Astro JS framework update",
        "Svelte dan Sveltia CMS tutorial",
        "Keunggulan static site generator 2026"
    ],
    "Web Development": [
        "Tren arsitektur web modern",
        "Tips optimasi web vitals dan kecepatan site",
        "Pengembangan web berbasis Jamstack"
    ],
    "Artificial Intelligence": [
        "Pemanfaatan AI untuk otomatisasi web",
        "Model AI Gemini untuk developer",
        "Tren tools AI produktivitas"
    ]
}

# Nama Author default yang ada di src/content/authors
AUTHOR_NAME = "Kukode Team"

def get_random_topic():
    category = random.choice(list(CATEGORIES.keys()))
    keyword = random.choice(CATEGORIES[category])
    return category, keyword

def search_latest_news(query):
    print(f"Mencari berita/artikel terkini untuk query: '{query}'...")
    results_text = ""
    try:
        with DDGS() as ddgs:
            news_results = list(ddgs.news(keywords=query, max_results=5, region="id-id"))
            if not news_results:
                news_results = list(ddgs.news(keywords=query, max_results=5, region="wt-wt"))
            
            for item in news_results:
                results_text += f"- Judul: {item.get('title')}\n  Ringkasan: {item.get('body')}\n  Sumber: {item.get('url')}\n\n"
    except Exception as e:
        print(f"Peringatan riset: {e}")
        results_text = "Gunakan pengetahuan umum mengenai topik ini."
        
    return results_text

def generate_article(category, keyword, research_data):
    model = genai.GenerativeModel('gemini-1.5-flash')
    today_date = datetime.now().strftime('%Y-%m-%d')
    
    prompt = f"""
    Kamu adalah Content Writer profesional untuk Kukode Digital Technology.
    
    Kategori Utama: {category}
    Kata Kunci Utama: {keyword}
    
    Data Riset Terkini:
    {research_data}
    
    Tugasmu:
    Buat 1 artikel blog baru berbahasa Indonesia yang informatif, rapi, dan menarik.
    
    Format output HARUS persis seperti Frontmatter Markdown berikut tanpa kode unik ekstra:

---
title: "Judul Artikel Menarik dan SEO Friendly"
description: "Deskripsi singkat 1-2 kalimat untuk Meta Description."
pubDate: {today_date}
category: "{category}"
author: "{AUTHOR_NAME}"
draft: false
translation_key: "{re.sub(r'[^a-z0-9]', '-', keyword.lower())}"
seo:
  title: "Judul SEO Artikel"
  description: "Deskripsi SEO untuk Google Search."
  image: "/image/default-thumbnail.jpg"
---

## Pendahuluan
[Tulis isi artikel lengkap dalam format Markdown, sertakan pembahasan dari riset di atas jika relevan.]
"""

    response = model.generate_content(prompt)
    return response.text

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    return re.sub(r'[\s-]+', '-', text).strip('-')

def main():
    category, keyword = get_random_topic()
    print(f"Topik Terpilih: [{category}] -> '{keyword}'")
    
    # 1. Riset Berita
    research_data = search_latest_news(keyword)
    
    # 2. Generate Konten
    content = generate_article(category, keyword, research_data)
    
    # 3. Simpan ke Folder i18n ID (src/content/posts/id/)
    today_str = datetime.now().strftime('%Y-%m-%d')
    file_slug = slugify(keyword)
    file_name = f"{today_str}-{file_slug}.md"
    
    # Sesuai dengan config.yml (structure: multiple_folders)
    output_dir = "src/content/posts/id"
    os.makedirs(output_dir, exist_ok=True)
    
    file_path = os.path.join(output_dir, file_name)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Berhasil menyimpan artikel di: {file_path}")

if __name__ == "__main__":
    main()