/* ═══════════════════════════════════════════════════════════════════
   CARROCERÍAS BIYOK — Main JS
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAV: scroll behaviour ─── */
  const navBar = document.getElementById('nav-bar');

  const handleScroll = () => {
    navBar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ─── NAV: active link on scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ─── NAV: mobile menu ─── */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMenu = () => {
    mobileMenu.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    navToggle.setAttribute('aria-label', 'Cerrar menú');
  };

  const closeMenu = () => {
    mobileMenu.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ─── SCROLL REVEAL ─── */
  const revealElements = document.querySelectorAll(
    '.service-card, .process-step, .about-text, .about-values, .contact-item, .ins-icon, .section-header'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ─── STAGGER REVEALS ─── */
  document.querySelectorAll('.services-grid, .process-steps, .ins-icon-grid').forEach((grid) => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  /* ─── FORM VALIDATION ─── */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  const validators = {
    nombre: (value) => value.trim().length >= 2 ? '' : 'Introduce tu nombre.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Introduce un email válido.',
    mensaje: (value) => value.trim().length >= 10 ? '' : 'Cuéntanos un poco más (mín. 10 caracteres).',
    telefono: (value) => {
      if (!value) return '';
      return /^[6-9]\d{8}$/.test(value.replace(/\s/g, '')) ? '' : 'Teléfono no válido (9 dígitos, empieza por 6–9).';
    },
  };

  const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (!field || !error) return;
    if (message) {
      field.classList.add('error');
      error.textContent = message;
    } else {
      field.classList.remove('error');
      error.textContent = '';
    }
  };

  const validateField = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    const validator = validators[fieldId];
    if (!validator) return true;
    const error = validator(field.value);
    showError(fieldId, error);
    return !error;
  };

  // Live validation on blur
  ['nombre', 'email', 'telefono', 'mensaje'].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener('blur', () => validateField(fieldId));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(fieldId);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fieldsToValidate = ['nombre', 'email', 'mensaje'];
    const isValid = fieldsToValidate.every(validateField);

    if (!isValid) return;

    // Simulate async send
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    submitBtn.disabled = true;
    submitText.hidden = true;
    submitLoading.hidden = false;

    await new Promise((resolve) => setTimeout(resolve, 1200));

    form.reset();
    submitBtn.disabled = false;
    submitText.hidden = false;
    submitLoading.hidden = true;
    formSuccess.hidden = false;

    setTimeout(() => { formSuccess.hidden = true; }, 6000);
  });

  /* ─── COOKIE BANNER ─── */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieReject = document.getElementById('cookie-reject');

  const COOKIE_KEY = 'biyok_cookie_consent';

  const hideCookieBanner = () => {
    cookieBanner.classList.remove('visible');
    setTimeout(() => { cookieBanner.classList.add('hidden'); }, 500);
  };

  if (!localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => { cookieBanner.classList.add('visible'); }, 1500);
  } else {
    cookieBanner.classList.add('hidden');
  }

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'all');
    hideCookieBanner();
  });

  cookieReject.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'essential');
    hideCookieBanner();
  });

})();
