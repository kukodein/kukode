// Global script — runs on every page (navbar + theme toggle live in the shared header/footer).

function initGlobalNavbar() {
  const kkNavWrap = document.querySelector('.kk-navbar-wrap');
  const mainNav = document.getElementById('mainNav');
  if (!kkNavWrap) return;

  let lastScrollY = window.scrollY;
  let menuTransitioning = false;

  if (mainNav) {
    mainNav.addEventListener('show.bs.collapse', () => { menuTransitioning = true; });
    mainNav.addEventListener('hide.bs.collapse', () => { menuTransitioning = true; });
    mainNav.addEventListener('shown.bs.collapse', () => {
      menuTransitioning = false;
      lastScrollY = window.scrollY;
    });
    mainNav.addEventListener('hidden.bs.collapse', () => {
      menuTransitioning = false;
      lastScrollY = window.scrollY;
    });
  }

  window.addEventListener('scroll', () => {
    if (menuTransitioning) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 0) {
      kkNavWrap.classList.remove('kk-scrolled');
    } else if (currentScrollY > lastScrollY) {
      kkNavWrap.classList.add('kk-scrolled');
    } else if (currentScrollY < lastScrollY) {
      kkNavWrap.classList.remove('kk-scrolled');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
}

// Run on initial load and client router navigation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalNavbar);
} else {
  initGlobalNavbar();
}
document.addEventListener('astro:page-load', initGlobalNavbar);
