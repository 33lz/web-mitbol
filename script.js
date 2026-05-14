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
  document.querySelectorAll('a[href^="#"]:not(.sector-link)').forEach(anchor => {
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
      title: 'Proyecto Parque Eólico',
      img: 'assets/0.jpg',
      desc: 'No. WL-CI-2023-02 Servicio de Instalacion del sistema de proteccion Atmosferica y pues a tierra y de la red colectora de media tension, fibra optica e interconexiones lectricas de baja tension en aerogeneradores (incluye pruebas)- parque aólico warnes II. .',
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
      img: 'assets/1.jpg',
      desc: 'ELF No. 126-92754/2025 (2da. Convocatoria) Contratación De Desmontaje De Estructuras Y Retiro De Linea, Montaje De Estructuras Y Tendido De Linea Ii Proyecto Repotenciacion Linea 115 Kv Subestación Arocagua - Subestación Central.',
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
      img: 'assets/2.jpg',
      desc: 'Construcción e integración de plantas de generación solar fotovoltaica con conexión a red, incluyendo paneles FV, inversores string/central, transformadores de potencia, subestación de evacuación, sistema SCADA, telemetría y protecciones. MITBOL aporta desde la ingeniería de detalle hasta el comisionamiento y puesta en marchaELF No. 55-78925/2024 (2da.Convocatoria) Se-Contratación De Servicio De Tendido De Cable Subterráneo A.T. Y Tendido De Fibra Óptica Subterránea Para El Proyecto “Construcción Línea Subterránea S/E Rafael Urquidi - S/E Alalay 115kv.”.',
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
      img: 'assets/3.jpg',
      desc: 'Ejecucion De Obras Civiles Y Electromecanicas De La Subestacion Elevadora 60 Mw Uyuni 230 Kv. Construccion De Terraplen Y Losas De Hormigon Armado Para Apoyo De Power Station Planta Solar Fotovoltaica 60 Mw. En Uyuni – Potosi.',
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
      img: 'assets/4.jpg',
      desc: 'Planta De Generacion Electrica / Turbogeneradores Con G.N. Refineria Guillermo Elder Bell. Planta De Generacion Electrica / Turbogeneradores Con G.N. Refineria Gualberto Villarroel.',
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
      img: 'assets/5.jpg',
      desc: 'Contrato Nº 018/2019 Construccion De Obras Civiles Y Montaje Electromecanico Subestacion Yapacani "Proyecto P151 – Subestación 230/115 Kv. Yapacani".',
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
      <a href="#contacto" class="btn-primary" onclick="document.getElementById('modalOverlay').classList.remove('show');document.body.style.overflow=''">Solicitar Propuesta →</a>
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

  /* ---- SECTORES MODAL ---- */
  const sectoresData = {
    'sec-energia-link': {
      cat: 'Energía',
      title: 'Sector Energía',
      img: 'transmission_lines.png',
      desc: 'Generación, transmisión, distribución y renovables. MITBOL ofrece soluciones integrales en infraestructura eléctrica de media y alta tensión, subestaciones GIS/AIS, líneas de transmisión, plantas de generación convencional y renovable, sistemas de protección, control y automatización de redes.',
      specs: [
        { label: 'Tensión', val: '69 kV – 500 kV' },
        { label: 'Subestaciones', val: 'GIS / AIS / Híbridas' },
        { label: 'Generación', val: 'Convencional y Renovable' },
        { label: 'Normas', val: 'IEC · IEEE · NFPA' },
        { label: 'Modalidad', val: 'EPC / EPCM' },
        { label: 'Servicios', val: 'Ing. · Procura · Construcción · Com.' },
      ]
    },
    'sec-oilgas-link': {
      cat: 'Oil & Gas',
      title: 'Sector Oil & Gas',
      img: 'assets/9.jpg',
      desc: 'Infraestructura de superficie, automatización, comunicaciones y obras industriales para el sector hidrocarburos. MITBOL ejecuta proyectos de montaje electromecánico, instrumentación, tuberías, sistemas de control, gasoductos, plantas de procesamiento y refinerías.',
      specs: [
        { label: 'Infraestructura', val: 'Superficie y Procesamiento' },
        { label: 'Automatización', val: 'PLC · DCS · SCADA' },
        { label: 'Comunicaciones', val: 'Fibra óptica · Radio · IoT' },
        { label: 'Normas', val: 'API · ASME · NFPA' },
        { label: 'Modalidad', val: 'EPC / EPCM' },
        { label: 'Países', val: 'Bolivia · Chile · Perú · Paraguay' },
      ]
    },
    'sec-petro-link': {
      cat: 'Petroquímica',
      title: 'Sector Petroquímico',
      img: 'assets/8.jpg',
      desc: 'Montaje, instrumentación, control y sistemas eléctricos para la industria petroquímica. MITBOL integra plantas de proceso con estándares internacionales de calidad, seguridad y eficiencia operativa.',
      specs: [
        { label: 'Montaje', val: 'Electromecánico y Estructural' },
        { label: 'Instrumentación', val: 'Analítica · Control · Válvulas' },
        { label: 'Sistemas Eléctricos', val: 'MT/BT · Tableros · CCM' },
        { label: 'Normas', val: 'ASME · API · IEC' },
        { label: 'Modalidad', val: 'EPC / Llave en Mano' },
        { label: 'Gestión', val: 'HSE · QA/QC · BIM' },
      ]
    },
    'sec-mineria-link': {
      cat: 'Minería',
      title: 'Sector Minería',
      img: 'hero_energy.png',
      desc: 'Energía para minería, plantas industriales, automatización y telecomunicaciones. MITBOL proporciona soluciones eléctricas y de control para operaciones mineras, desde plantas concentradoras hasta sistemas de transporte y bombeo.',
      specs: [
        { label: 'Energía', val: 'Suministro y Distribución MT/BT' },
        { label: 'Plantas', val: 'Concentradoras · Refinación' },
        { label: 'Automatización', val: 'SCADA · PLC · Control de Procesos' },
        { label: 'Telecomunicaciones', val: 'Redes Industriales · Fibra' },
        { label: 'Modalidad', val: 'EPC / EPCM' },
        { label: 'Países', val: 'Bolivia · Chile · Perú' },
      ]
    },
    'sec-cemento-link': {
      cat: 'Cemento',
      title: 'Sector Cemento',
      img: 'assets/6.jpg',
      desc: 'Sistemas eléctricos, control, modernización y mantenimiento para la industria cementera. MITBOL ofrece ingeniería de detalle, montaje de equipos, sistemas de automatización y mejoras de eficiencia energética en plantas de cemento.',
      specs: [
        { label: 'Sistemas Eléctricos', val: 'MT/BT · Subestaciones' },
        { label: 'Control', val: 'DCS · PLC · SCADA' },
        { label: 'Modernización', val: 'Retrofit · Eficiencia Energética' },
        { label: 'Mantenimiento', val: 'Predictivo y Correctivo' },
        { label: 'Modalidad', val: 'EPC / Ingeniería' },
        { label: 'Normas', val: 'IEC · ISO · NFPA' },
      ]
    },
    'sec-infra-link': {
      cat: 'Infraestructura Tecnológica',
      title: 'Infraestructura Tecnológica',
      img: 'solar_plant.png',
      desc: 'Centros de control, fibra óptica, redes industriales, telemetría y centros de datos. MITBOL integra infraestructura OT/TIC crítica para la operación remota, monitoreo en tiempo real y gestión inteligente de activos industriales.',
      specs: [
        { label: 'Centros de Control', val: 'SCADA · Salas de Operación' },
        { label: 'Redes', val: 'Industrial Ethernet · Fibra Óptica' },
        { label: 'Telemetría', val: 'RTU · IoT · Comunicaciones' },
        { label: 'Ciberseguridad', val: 'OT Security – IEC 62443' },
        { label: 'Modalidad', val: 'Integración Llave en Mano' },
        { label: 'Países', val: 'Bolivia · Chile · Perú · Paraguay' },
      ]
    },
  };

  Object.keys(sectoresData).forEach(linkId => {
    const link = document.getElementById(linkId);
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const data = sectoresData[linkId];
        modalContent.innerHTML = buildModalHTML(data);
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    }
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

        const data = new URLSearchParams(new FormData(contactForm));

        fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data })
          .then(() => {
            contactForm.reset();
            contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            contactForm.querySelectorAll('.form-error').forEach(el => el.textContent = '');
            btn.disabled = false;
            btn.querySelector('.btn-label').textContent = 'Enviar Consulta';
            formSuccess.classList.add('show');
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
          })
          .catch(() => {
            btn.disabled = false;
            btn.querySelector('.btn-label').textContent = 'Enviar Consulta';
            alert('Error al enviar. Intente nuevamente.');
          });
      }
    });
  }

  /* ---- PAIS CARDS – MODAL CON INFO Y WHATSAPP ---- */
  const paisesData = {
    'pais-bolivia': {
      flag: 'assets/Bolivia.png',
      flagAlt: 'Bolivia',
      name: 'Bolivia',
      sede: 'Sede Principal',
      ciudad: 'Cochabamba, Bolivia',
      email: 'administracion@mitbol.com',
      telefono: '+591 74360919',
      whatsapp: '59174360919',
      sectores: ['Renovables y transmisión', 'Energía eléctrica', 'Minería', 'Oil & Gas'],
    },
    'pais-chile': {
      flag: 'assets/chile.png',
      flagAlt: 'Chile',
      name: 'Chile',
      sede: 'Oficina Regional',
      ciudad: 'Santiago, Chile',
      email: 'administracion@mitbol.com',
      telefono: '+591 74360919',
      whatsapp: '59174360919',
      sectores: ['Integración tecnológica', 'Obras industriales'],
    },
    'pais-peru': {
      flag: 'assets/peru.png',
      flagAlt: 'Perú',
      name: 'Perú',
      sede: 'Oficina Regional',
      ciudad: 'Lima, Perú',
      email: 'administracion@mitbol.com',
      telefono: '+591 74360919',
      whatsapp: '59174360919',
      sectores: ['Ingeniería y automatización', 'Construcción industrial'],
    },
    'pais-paraguay': {
      flag: 'assets/paraguay.png',
      flagAlt: 'Paraguay',
      name: 'Paraguay',
      sede: 'Oficina Regional',
      ciudad: 'Asunción, Paraguay',
      email: 'administracion@mitbol.com',
      telefono: '+591 74360919',
      whatsapp: '59174360919',
      sectores: ['Plantas industriales', 'Infraestructura energética'],
    },
  };

  function buildPaisModalHTML(data) {
    const sectoresList = data.sectores.map(s => `<li>${s}</li>`).join('');
    const teleHTML = data.telefono
      ? `<div class="modal-pais-item"><span class="modal-pais-label">Teléfono</span><a href="tel:${data.telefono.replace(/\s/g, '')}" class="modal-pais-link">${data.telefono}</a></div>`
      : '';
    const waHTML = data.whatsapp
      ? `<div class="modal-pais-item"><span class="modal-pais-label">WhatsApp</span><a href="https://wa.me/${data.whatsapp}" target="_blank" rel="noopener noreferrer" class="modal-pais-link wa-link">💬 Enviar WhatsApp</a></div>`
      : '';
    return `
      <div class="modal-pais-header">
        <img src="${data.flag}" alt="${data.flagAlt}" class="modal-pais-flag" />
        <div>
          <div class="modal-cat" style="margin-bottom:0">${data.sede}</div>
          <h2 class="modal-title" style="margin-bottom:4px">${data.name}</h2>
        </div>
      </div>
      <p class="modal-desc" style="margin-top:16px"><strong>${data.ciudad}</strong></p>
      <div class="modal-pais-grid">
        <div class="modal-pais-item"><span class="modal-pais-label">Email</span><a href="mailto:${data.email}" class="modal-pais-link">${data.email}</a></div>
        ${teleHTML}
        ${waHTML}
      </div>
      <div style="margin-top:20px">
        <span class="modal-pais-label">Sectores</span>
        <ul class="modal-pais-sectores">${sectoresList}</ul>
      </div>
      <a href="#contacto" class="btn-primary" style="margin-top:24px" onclick="document.getElementById('modalOverlay').classList.remove('show');document.body.style.overflow=''">Solicitar Propuesta →</a>
    `;
  }

  const paisCards = document.querySelectorAll('.pais-card');
  paisCards.forEach(card => {
    card.addEventListener('click', () => {
      const data = paisesData[card.id];
      if (!data) return;
      modalContent.innerHTML = buildPaisModalHTML(data);
      modalOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
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
