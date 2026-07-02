// Theme toggle (dark = default "Noche", light = "Día")
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  if (next === 'light') {
    document.documentElement.dataset.theme = 'light';
  } else {
    delete document.documentElement.dataset.theme;
  }
  localStorage.setItem('theme', next);
});

// Plausible Analytics - Custom Events
const trackEvent = (eventName, props = {}) => {
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
};

// Contact obfuscation handler + Analytics
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-email], [data-phone], [data-email-subject]');
  if (!el) return;

  e.preventDefault();
  
  if (el.hasAttribute('data-email')) {
    const email = el.getAttribute('data-email');
    const subject = el.getAttribute('data-email-subject') || '';
    const body = el.getAttribute('data-email-body') || '';
    
    trackEvent('contact_click', { type: 'email', subject: subject || 'N/A' });
    
    const mailto = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
    window.location.href = mailto;
  } else if (el.hasAttribute('data-phone')) {
    const phone = el.getAttribute('data-phone');
    
    trackEvent('contact_click', { type: 'whatsapp' });
    
    window.location.href = `https://wa.me/${phone}`;
  }
}, true);

// Track CTA clicks
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const text = btn.textContent.trim();
    const href = btn.getAttribute('href') || '';
    
    if (!btn.hasAttribute('data-email') && !btn.hasAttribute('data-phone') && href.startsWith('#')) {
      trackEvent('cta_click', { label: text, section: href });
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
