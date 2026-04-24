/* ============================================================
   MITBOL – JavaScript
   Interactions, animations, filtering, scroll effects
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVBAR SCROLL BEHAVIOR ---- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (y > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- SCROLL TO TOP ---- */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const y = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  /* ---- INTERSECTION OBSERVER – REVEAL ANIMATIONS ---- */
  const revealEls = document.querySelectorAll(
    '.linea-card, .sector-card, .cap-step, .proyecto-card, .pais-card, .mini-stat-card, .corp-inner, .contacto-layout, .destacado-content, .valor-item'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    function update() {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start);
      if (start < target) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        if (!isNaN(target)) {
          // small delay so user sees the hero first
          setTimeout(() => animateCounter(el, target), 700);
        }
      });
    }
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  /* ---- PROJECT FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const proyCards = document.querySelectorAll('.proyecto-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      proyCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.style.animation = 'scaleIn 0.35s ease both';
          card.addEventListener('animationend', () => { card.style.animation = ''; }, { once: true });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ---- MODAL – FICHA TÉCNICA ---- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  const fichasData = {
    'btn-ficha-1': {
      cat: 'Transmisión Eléctrica',
      title: 'Subestaciones de Alta Tensión',
      img: 'transmission_lines.png',
      desc: 'MITBOL ha diseñado y construido múltiples subestaciones de potencia en el rango de 69 kV a 500 kV, implementando equipos GIS (Gas Insulated Switchgear) y AIS (Air Insulated Switchgear) bajo normativa IEC 62271 e IEEE C57. Los proyectos incluyen ingeniería de detalle, suministro de equipos, obra civil, montaje eléctrico, sistemas de control y protección, comunicaciones y puesta en marcha.',
      specs: [
        { label: 'Tensión', val: '69 kV – 500 kV' },
        { label: 'Tecnología', val: 'GIS / AIS' },
        { label: 'Norma', val: 'IEC 62271 · IEEE C57' },
        { label: 'Modalidad', val: 'EPC / EPCM' },
        { label: 'País', val: 'Bolivia · Chile · Perú' },
        { label: 'Servicios', val: 'Ing. · Procura · Construcción · Com.' },
      ]
    },
    'btn-ficha-2': {
      cat: 'Transmisión Eléctrica',
      title: 'Líneas de Transmisión',
      img: 'transmission_lines.png',
      desc: 'Tendido, montaje y puesta en marcha de líneas aéreas de transmisión de media y alta tensión en terrenos con alta complejidad topográfica. Incluye diseño de trazado, cimentaciones, erección de torres, tendido de conductor, obra civil y pruebas de energización, con personal certificado y gestión HSE de primer nivel.',
      specs: [
        { label: 'Tensión', val: 'Media y Alta Tensión' },
        { label: 'Tipo', val: 'Aérea – Tower Line' },
        { label: 'Norma', val: 'IEC · IEEE · NFPA' },
        { label: 'Modalidad', val: 'EPC' },
        { label: 'País', val: 'Bolivia' },
        { label: 'Gestión', val: 'HSE · QA/QC · BIM' },
      ]
    },
    'btn-ficha-3': {
      cat: 'Energías Renovables',
      title: 'Plantas Solares Fotovoltaicas',
      img: 'solar_plant.png',
      desc: 'Construcción e integración de plantas de generación solar fotovoltaica con conexión a red, incluyendo paneles FV, inversores string/central, transformadores de potencia, subestación de evacuación, sistema SCADA, telemetría y protecciones. MITBOL aporta desde la ingeniería de detalle hasta el comisionamiento y puesta en marcha.',
      specs: [
        { label: 'Tecnología', val: 'Solar FV – Grid-tie' },
        { label: 'Componentes', val: 'Paneles · Inversores · Trafo' },
        { label: 'Control', val: 'SCADA · Telemetría' },
        { label: 'Modalidad', val: 'EPC' },
        { label: 'País', val: 'Bolivia' },
        { label: 'Norma', val: 'IEC 62446 · IEEE 1547' },
      ]
    },
    'btn-ficha-4': {
      cat: 'Energías Renovables',
      title: 'Parques Eólicos',
      img: 'wind_farm.png',
      desc: 'Participación en la construcción e integración de parques eólicos en Bolivia, incluyendo obras civiles, montaje de aerogeneradores, cableado de media tensión, subestaciones, sistemas de control integrado y gestión de la red de comunicaciones. Contribución directa a la diversificación de la matriz eléctrica nacional.',
      specs: [
        { label: 'Tecnología', val: 'Eólico – Aerogeneradores' },
        { label: 'Obras', val: 'Civil · Montaje · Cableado MT' },
        { label: 'Control', val: 'SCADA · PLC · Comunicaciones' },
        { label: 'Modalidad', val: 'EPCM' },
        { label: 'País', val: 'Bolivia' },
        { label: 'Norma', val: 'IEC 61400' },
      ]
    },
    'btn-ficha-5': {
      cat: 'Infraestructura Industrial',
      title: 'Plantas Industriales',
      img: 'industrial_plant.png',
      desc: 'Ingeniería, construcción y montaje de plantas de proceso para los sectores petroquímico, minero y cementero. MITBOL gestiona proyectos EPC/EPCM de alta complejidad, integrando diseño multidisciplinario, procura internacional, obras civiles industriales, montaje electromecánico, instrumentación, control y puesta en marcha.',
      specs: [
        { label: 'Sectores', val: 'Oil&Gas · Minería · Cemento' },
        { label: 'Servicios', val: 'Ing. · Civil · Montaje · Inst.' },
        { label: 'Modalidad', val: 'EPC / EPCM' },
        { label: 'Estándar', val: 'NFPA · ASME · API' },
        { label: 'Países', val: 'Bolivia · Chile · Perú · Paraguay' },
        { label: 'Gestión', val: 'BIM · HSE · QA/QC' },
      ]
    },
    'btn-ficha-6': {
      cat: 'Integración Tecnológica',
      title: 'Integración SCADA y Comunicaciones',
      img: 'hero_energy.png',
      desc: 'Diseño e implementación de sistemas de supervisión, control y adquisición de datos (SCADA) para plantas industriales y redes eléctricas. Incluye integración de PLC, DCS, RTUs, redes industriales Ethernet/fibra óptica, sistemas de comunicación IEC 61850, ciberseguridad OT y automatización de procesos bajo estándares internacionales.',
      specs: [
        { label: 'Sistemas', val: 'SCADA · PLC · DCS · RTU' },
        { label: 'Protocolo', val: 'IEC 61850 · DNP3 · Modbus' },
        { label: 'Redes', val: 'Industrial Ethernet · Fibra Óptica' },
        { label: 'Ciberseg.', val: 'OT Security – IEC 62443' },
        { label: 'Países', val: 'Bolivia · Chile · Perú' },
        { label: 'Modalidad', val: 'Integración Llave en Mano' },
      ]
    },
  };

  function buildModalHTML(data) {
    const specsHTML = data.specs.map(s =>
      `<div class="modal-spec-item">
        <div class="modal-spec-label">${s.label}</div>
        <div class="modal-spec-val">${s.val}</div>
      </div>`
    ).join('');
    return `
      <img src="${data.img}" alt="${data.title}" class="modal-header-img" />
      <div class="modal-cat">${data.cat}</div>
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-desc">${data.desc}</p>
      <div class="modal-specs-grid">${specsHTML}</div>
      <a href="#contacto" class="btn-primary" onclick="document.getElementById('modalOverlay').classList.remove('show')">Solicitar Propuesta →</a>
    `;
  }

  function openModal(btnId) {
    const data = fichasData[btnId];
    if (!data) return;
    modalContent.innerHTML = buildModalHTML(data);
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Attach ficha buttons
  Object.keys(fichasData).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) btn.addEventListener('click', () => openModal(btnId));
  });

  /* ---- CONTACT FORM VALIDATION & SUBMISSION ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(id, errorId, check) {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    const valid = check(el.value.trim());
    el.classList.toggle('error', !valid);
    err.textContent = valid ? '' : getErrorMsg(id);
    return valid;
  }

  function getErrorMsg(id) {
    const msgs = {
      nombre: 'Por favor ingrese su nombre completo.',
      email: 'Ingrese un correo electrónico válido.',
      mensaje: 'Por favor describa su proyecto o consulta.',
    };
    return msgs[id] || 'Campo requerido.';
  }

  if (contactForm) {
    // Real-time validation
    ['nombre', 'email', 'mensaje'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur', () => {
          if (id === 'email') {
            validateField(id, 'err-' + id, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
          } else {
            validateField(id, 'err-' + id, v => v.length >= 2);
          }
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = validateField('nombre', 'err-nombre', v => v.length >= 2);
      const em = validateField('email', 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      const ms = validateField('mensaje', 'err-mensaje', v => v.length >= 10);

      if (n && em && ms) {
        const btn = document.getElementById('btn-submit-contact');
        btn.disabled = true;
        btn.querySelector('.btn-label').textContent = 'Enviando...';
        // Simulate async send
        setTimeout(() => {
          contactForm.reset();
          contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
          contactForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
          btn.disabled = false;
          btn.querySelector('.btn-label').textContent = 'Enviar Consulta';
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }, 1200);
      }
    });
  }

  /* ---- PAIS CARDS HOVER ---- */
  const paisCards = document.querySelectorAll('.pais-card');
  paisCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      paisCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    card.addEventListener('mouseleave', () => {
      paisCards.forEach(c => c.classList.remove('active'));
      document.getElementById('pais-bolivia').classList.add('active');
    });
  });

  /* ---- PARALLAX: HERO BG ---- */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = `scale(1.04) translateY(${y * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ---- ANIMATE ON LOAD ---- */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

})();
