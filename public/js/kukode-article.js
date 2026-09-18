// Article-detail-page-only script — hanya di-load di halaman detail artikel
function initArticlePage() {
  var article = document.querySelector('.article-body');
  var tocNav = document.getElementById('kk-toc-nav');
  var progressBar = document.getElementById('readingProgressBar');

  // 1. Reading Progress Bar Logic
  if (progressBar) {
    var updateProgress = function () {
      var container = document.querySelector('article') || article;
      if (!container) return;
      var rect = container.getBoundingClientRect();
      var containerHeight = container.offsetHeight;
      var windowHeight = window.innerHeight;
      var scrollable = containerHeight - windowHeight;

      var progress = 0;
      if (scrollable > 0) {
        var currentScroll = -rect.top;
        progress = Math.min(100, Math.max(0, (currentScroll / scrollable) * 100));
      } else if (rect.top <= 0) {
        progress = 100;
      }
      progressBar.style.width = progress + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  if (!article) return;

  // 2. Code Block Copy Button Logic
  var codeBlocks = article.querySelectorAll('pre');
  codeBlocks.forEach(function (pre) {
    if (pre.querySelector('.kk-code-copy-btn')) return;

    var copyBtn = document.createElement('button');
    copyBtn.className = 'kk-code-copy-btn';
    copyBtn.type = 'button';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    copyBtn.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Copy</span>';

    copyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var codeEl = pre.querySelector('code') || pre;
      var textToCopy = codeEl.innerText.replace(/^\s+|\s+$/g, '');

      var showSuccess = function () {
        copyBtn.classList.add('copied');
        var span = copyBtn.querySelector('span');
        if (span) span.textContent = 'Copied!';
        setTimeout(function () {
          copyBtn.classList.remove('copied');
          if (span) span.textContent = 'Copy';
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(showSuccess).catch(function () {
          fallbackCopy(textToCopy, showSuccess);
        });
      } else {
        fallbackCopy(textToCopy, showSuccess);
      }
    });

    pre.appendChild(copyBtn);
  });

  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      cb();
    } catch (err) {
      console.warn('Fallback copy failed:', err);
    }
    document.body.removeChild(ta);
  }

  // 3. Auto-enable GLightbox for all markdown images
  var articleImages = article.querySelectorAll('img');
  articleImages.forEach(function (img) {
    if (!img.closest('a')) {
      var wrapper = document.createElement('a');
      wrapper.href = img.src;
      wrapper.className = 'glightbox';
      wrapper.setAttribute('data-gallery', 'article-gallery');
      if (img.alt) {
        wrapper.setAttribute('data-title', img.alt);
      }
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    } else {
      var parentA = img.closest('a');
      if (parentA && parentA.href && /\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(parentA.href)) {
        parentA.classList.add('glightbox');
        parentA.setAttribute('data-gallery', 'article-gallery');
      }
    }
  });

  if (typeof GLightbox === 'function') {
    try {
      GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        zoomable: true,
      });
    } catch (e) {
      console.warn('GLightbox init error:', e);
    }
  }

  // 4. Table of Contents & ScrollSpy Logic
  if (tocNav) {
    tocNav.innerHTML = '';
    var tocSidebarCol = tocNav.closest('.col-lg-4');
    var headings = article.querySelectorAll('h2, h3');
    if (!headings.length) {
      if (tocSidebarCol) tocSidebarCol.style.display = 'none';
      return;
    }
    if (tocSidebarCol) tocSidebarCol.style.display = '';

    var usedIds = {};
    function slugify(text) {
      var base = text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') || 'section';
      var slug = base;
      var i = 1;
      while (usedIds[slug]) {
        i += 1;
        slug = base + '-' + i;
      }
      usedIds[slug] = true;
      return slug;
    }

    headings.forEach(function (heading) {
      if (heading.id) {
        usedIds[heading.id] = true;
      } else {
        heading.id = slugify(heading.textContent);
      }
      var link = document.createElement('a');
      link.className = 'nav-link' + (heading.tagName === 'H3' ? ' kk-toc-sub' : '');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      tocNav.appendChild(link);
    });

    if (window.bootstrap && bootstrap.ScrollSpy) {
      try {
        var oldSpy = bootstrap.ScrollSpy.getInstance(document.body);
        if (oldSpy) oldSpy.dispose();
        new bootstrap.ScrollSpy(document.body, {
          target: '#kk-toc-nav',
          rootMargin: '-100px 0px -70%',
        });
      } catch (e) {
        console.warn('ScrollSpy init error:', e);
      }
    }
  }
}

// Run immediately if DOM is ready, or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticlePage);
} else {
  initArticlePage();
}

// Support Astro ClientRouter page transitions
document.addEventListener('astro:page-load', initArticlePage);