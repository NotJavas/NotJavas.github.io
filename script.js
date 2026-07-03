// Theme toggle (la comprobación inicial vive en el <head> para evitar FOUC)
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  if (next === 'light') {
    document.documentElement.dataset.theme = 'light';
  } else {
    delete document.documentElement.dataset.theme;
  }
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Correos ensamblados en runtime — el HTML no contiene la dirección completa
document.querySelectorAll('.mailto').forEach(a => {
  const addr = a.dataset.u + '@' + a.dataset.d;
  let href = 'mailto:' + addr;
  const params = [];
  if (a.dataset.s) params.push('subject=' + encodeURIComponent(a.dataset.s));
  params.push('body=' + encodeURIComponent('Hola Javier, cuéntame un poco de tu negocio y lo que necesitas...'));
  href += '?' + params.join('&');
  a.href = href;
  if (a.dataset.show) a.textContent = addr;
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// Contador animado en las estadísticas del hero
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      statObserver.unobserve(entry.target);
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = p * (2 - p); // ease-out
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-num[data-count]').forEach(el => statObserver.observe(el));
}
