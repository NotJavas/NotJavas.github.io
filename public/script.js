// Theme toggle (la comprobación inicial vive en el <head> del Layout para evitar FOUC)
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

// Plausible Analytics - Custom Events
const trackEvent = (eventName, props = {}) => {
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
};

// Correos ensamblados en runtime — la dirección completa nunca aparece en el HTML estático.
// data-u = usuario, data-d = dominio, data-s = subject, data-b = body, data-show = mostrar dirección como texto.
document.querySelectorAll('.mailto').forEach(a => {
  const addr = a.dataset.u + '@' + a.dataset.d;
  let href = 'mailto:' + addr;
  const params = [];
  if (a.dataset.s) params.push('subject=' + encodeURIComponent(a.dataset.s));
  if (a.dataset.b) params.push('body=' + encodeURIComponent(a.dataset.b));
  if (params.length) href += '?' + params.join('&');
  a.href = href;
  if (a.dataset.show) a.textContent = addr;
  a.addEventListener('click', () => {
    trackEvent('contact_click', { type: 'email', subject: a.dataset.s || 'N/A' });
  });
});

// Tracking de contacto por WhatsApp y teléfono
document.querySelectorAll('a[href^="https://wa.me"]').forEach(a => {
  a.addEventListener('click', () => trackEvent('contact_click', { type: 'whatsapp' }));
});
document.querySelectorAll('a[href^="tel:"]').forEach(a => {
  a.addEventListener('click', () => trackEvent('contact_click', { type: 'call' }));
});

// Track CTA clicks (navegación interna)
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('click', () => {
    const href = btn.getAttribute('href') || '';
    if (!btn.classList.contains('mailto') && href.startsWith('#')) {
      trackEvent('cta_click', { label: btn.textContent.trim(), section: href });
    }
  });
});

// Track scroll depth to key sections
const sectionsToTrack = ['about', 'projects', 'capturas', 'pricing', 'contact'];
const trackedSections = new Set();

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !trackedSections.has(entry.target.id)) {
      trackedSections.add(entry.target.id);
      trackEvent('section_viewed', { section: entry.target.id });
    }
  });
}, { threshold: 0.25 });

sectionsToTrack.forEach(id => {
  const el = document.getElementById(id);
  if (el) scrollObserver.observe(el);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  trackEvent('menu_toggle', { state: isOpen ? 'open' : 'closed' });
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
