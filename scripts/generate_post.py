import os
import random
import re
from datetime import datetime
from ddgs import DDGS
from google import genai

# Konfigurasi Client Gemini SDK Terbaru
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# 1. Kategori & Kata Kunci Riset
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
                results_text += f"- Title: {item.get('title')}\n  Summary: {item.get('body')}\n  Source: {item.get('url')}\n\n"
    except Exception as e:
        print(f"Peringatan riset: {e}")
        results_text = "Gunakan pengetahuan umum mengenai topik ini."
        
    return results_text

def generate_article(category, keyword, research_data, lang="id", translation_key=""):
    today_date = datetime.now().strftime('%Y-%m-%d')
    
    if lang == "id":
        prompt = f"""
        Kamu adalah Content Writer profesional untuk Kukode Digital Technology.
        
        Kategori Utama: {category}
        Kata Kunci Utama: {keyword}
        
        Data Riset Terkini:
        {research_data}
        
        Tugasmu:
        Buat 1 artikel blog baru berbahasa Indonesia yang informatif, rapi, dan menarik.
        
        Format output HARUS persis seperti Frontmatter Markdown berikut tanpa pemformatan markdown tambahan (seperti ```markdown):

---
title: "Judul Artikel Menarik dan SEO Friendly"
description: "Deskripsi singkat 1-2 kalimat untuk Meta Description."
pubDate: {today_date} 00:00:00
image: "/image/default-thumbnail.jpg"
category: "{category}"
author: "{AUTHOR_NAME}"
draft: false
translation_key: "{translation_key}"
seo:
  title: "Judul SEO Artikel"
  description: "Deskripsi SEO untuk Google Search."
  image: "/image/default-thumbnail.jpg"
---

## Pendahuluan
[Tulis isi artikel lengkap dalam format Markdown, sertakan pembahasan dari riset di atas jika relevan.]
"""
    else: # Language: EN
        prompt = f"""
        You are a professional Content Writer for Kukode Digital Technology.
        
        Main Category: {category}
        Main Keyword: {keyword}
        
        Latest Research Data:
        {research_data}
        
        Task:
        Write 1 new blog article in English that is informative, well-structured, and engaging.
        
        The output format MUST match the Frontmatter Markdown below exactly without additional markdown code fences:

---
title: "Catchy and SEO Friendly Article Title"
description: "Short 1-2 sentence description for Meta Description."
pubDate: {today_date} 00:00:00
image: "/image/default-thumbnail.jpg"
category: "{category}"
author: "{AUTHOR_NAME}"
draft: false
translation_key: "{translation_key}"
seo:
  title: "SEO Title of Article"
  description: "SEO Description for Google Search."
  image: "/image/default-thumbnail.jpg"
---

## Introduction
[Write full article in Markdown format based on the research above.]
"""

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )
    return response.text

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    return re.sub(r'[\s-]+', '-', text).strip('-')

def main():
    category, keyword = get_random_topic()
    print(f"Topik Terpilih: [{category}] -> '{keyword}'")
    
    # Kunci relasi i18n untuk menghubungkan versi ID dan EN
    translation_key = f"post-{slugify(keyword)}"
    today_str = datetime.now().strftime('%Y-%m-%d')
    file_slug = slugify(keyword)
    file_name = f"{today_str}-{file_slug}.md"

    # 1. Riset Berita
    research_data = search_latest_news(keyword)
    
    # 2. Generate Konten Bahasa Indonesia (ID)
    print("Generating postingan Bahasa Indonesia (ID)...")
    content_id = generate_article(category, keyword, research_data, lang="id", translation_key=translation_key)
    output_dir_id = "src/content/posts/id"
    os.makedirs(output_dir_id, exist_ok=True)
    with open(os.path.join(output_dir_id, file_name), "w", encoding="utf-8") as f:
        f.write(content_id)
    print(f"Berhasil menyimpan artikel ID: {output_dir_id}/{file_name}")

    # 3. Generate Konten Bahasa Inggris (EN)
    print("Generating postingan Bahasa Inggris (EN)...")
    content_en = generate_article(category, keyword, research_data, lang="en", translation_key=translation_key)
    output_dir_en = "src/content/posts/en"
    os.makedirs(output_dir_en, exist_ok=True)
    with open(os.path.join(output_dir_en, file_name), "w", encoding="utf-8") as f:
        f.write(content_en)
    print(f"Berhasil menyimpan artikel EN: {output_dir_en}/{file_name}")

if __name__ == "__main__":
    main()