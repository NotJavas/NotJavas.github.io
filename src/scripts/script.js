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

// GoatCounter Analytics - Custom Events
// GoatCounter no maneja props como Plausible: se codifican en el "path" del evento.
const trackEvent = (eventName, props = {}) => {
  if (window.goatcounter && window.goatcounter.count) {
    const detail = Object.values(props).filter(Boolean).join('/');
    window.goatcounter.count({
      path: detail ? `${eventName}/${detail}` : eventName,
      title: eventName,
      event: true,
    });
  }
};

// ---------- Idioma (ES/EN) ----------
// Cada elemento traducible trae data-en="..."; el texto en el HTML es el
// original en español, que se guarda en data-es la primera vez que corre esto.
const langToggle = document.getElementById('langToggle');

function getLang() {
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'es';
}

function applyMailtoLang(lang) {
  document.querySelectorAll('.mailto').forEach(a => {
    const addr = a.dataset.u + '@' + a.dataset.d;
    let href = 'mailto:' + addr;
    const subject = lang === 'en' && a.dataset.sEn ? a.dataset.sEn : a.dataset.s;
    const body = lang === 'en' && a.dataset.bEn ? a.dataset.bEn : a.dataset.b;
    const params = [];
    if (subject) params.push('subject=' + encodeURIComponent(subject));
    if (body) params.push('body=' + encodeURIComponent(body));
    if (params.length) href += '?' + params.join('&');
    a.href = href;
    if (a.dataset.show) a.textContent = addr;
  });
}

function applyLang(lang) {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    if (!el.dataset.es) el.dataset.es = el.textContent;
    el.textContent = lang === 'en' ? el.dataset.en : el.dataset.es;
  });
  document.querySelectorAll('[data-aria-en]').forEach(el => {
    if (!el.dataset.ariaEs) el.dataset.ariaEs = el.getAttribute('aria-label') || '';
    el.setAttribute('aria-label', lang === 'en' ? el.dataset.ariaEn : el.dataset.ariaEs);
  });
  applyMailtoLang(lang);
  if (langToggle) {
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés');
  }
}

applyLang(getLang());

if (langToggle) {
  langToggle.addEventListener('click', () => {
    const next = getLang() === 'en' ? 'es' : 'en';
    applyLang(next);
    try { localStorage.setItem('lang', next); } catch (e) {}
    trackEvent('lang_toggle', { lang: next });
  });
}

// Correos ensamblados en runtime — la dirección completa nunca aparece en el HTML estático.
// data-u = usuario, data-d = dominio, data-s/-en = subject, data-b/-en = body, data-show = mostrar dirección como texto.
document.querySelectorAll('.mailto').forEach(a => {
  a.addEventListener('click', () => {
    trackEvent('contact_click', { type: 'email', subject: a.dataset.s || 'N/A' });
  });
});

// Centralized tracking for all contact clicks using event delegation
document.body.addEventListener('click', (e) => {
  const contactLink = e.target.closest('a[href^="https://wa.me"], a[href^="tel:"]');
  if (contactLink) {
    const href = contactLink.getAttribute('href');
    const type = href.startsWith('tel:') ? 'call' : 'whatsapp';
    trackEvent('contact_click', { type });
  }
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
