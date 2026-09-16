// Article-detail-page-only script — hanya di-load di halaman detail artikel
function initArticlePage() {
  var article = document.querySelector('.article-body');
  var tocNav = document.getElementById('kk-toc-nav');
  if (!article || !tocNav) return;

  // Init GLightbox if available
  if (typeof GLightbox === 'function') {
    try {
      GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: false,
      });
    } catch (e) {
      console.warn('GLightbox init error:', e);
    }
  }

  // Clear existing TOC links if re-running
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

  // Re-enable Bootstrap ScrollSpy if available
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

// Run immediately if DOM is ready, or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticlePage);
} else {
  initArticlePage();
}

// Support Astro ClientRouter page transitions
document.addEventListener('astro:page-load', initArticlePage);