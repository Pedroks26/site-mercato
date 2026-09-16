// Mercato Jardim — Interactions & Scripts

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.nav-link') : [];

  // Navbar glass effect on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      mobileToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // Custom smooth scroll with custom easing (garante rolagem fluida em todos os navegadores e SOs)
  function smoothScrollToElement(targetEl, duration = 800) {
    if (!targetEl) return;
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (navbarHeight + 10);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    
    // Se a distância for insignificante, não precisa animar
    if (Math.abs(distance) < 5) return;

    let startTime = null;

    // Função de atenuação suave (easeInOutCubic)
    function easeInOutCubic(t) {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animationStep(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animationStep);
      } else {
        // Garantir que pare exatamente na posição de destino
        window.scrollTo(0, targetPosition);
      }
    }

    requestAnimationFrame(animationStep);
  }

  // Smooth scroll for all internal links (#)
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      smoothScrollToElement(targetEl, 750);

      // Atualiza active class no menu
      document.querySelectorAll('.nav-links .nav-link').forEach(link => link.classList.remove('active'));
      if (anchor.classList.contains('nav-link')) {
        anchor.classList.add('active');
      }
    }
  });

  // Tab switching logic for Sectors (Açougue, Padaria, Mercado, Restaurante)
  const sectorTabBtns = document.querySelectorAll('.sector-tab-btn');
  const sectorTabPanels = document.querySelectorAll('.sector-tab-panel');

  function switchSectorTab(sectorKey) {
    sectorTabBtns.forEach(btn => {
      if (btn.getAttribute('data-sector') === sectorKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    sectorTabPanels.forEach(panel => {
      if (panel.id === `panel-${sectorKey}`) {
        panel.classList.remove('active');
        // Trigger reflow to restart CSS keyframe animations
        void panel.offsetWidth;
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  sectorTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectorKey = btn.getAttribute('data-sector');
      if (sectorKey) {
        switchSectorTab(sectorKey);
      }
    });
  });

  // Hover interativo nos quadros dos setores (troca de imagem e badge em tempo real)
  const interactiveBoxes = document.querySelectorAll('.interactive-box');
  interactiveBoxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
      const parentPanel = box.closest('.sector-tab-panel');
      if (!parentPanel) return;

      // Remove classe active dos irmãos
      parentPanel.querySelectorAll('.interactive-box').forEach(b => b.classList.remove('active'));
      box.classList.add('active');

      const newImgSrc = box.getAttribute('data-img-src');
      const newBadgeText = box.getAttribute('data-badge');
      const mainImg = parentPanel.querySelector('.sector-detail-media img');
      const mainBadge = parentPanel.querySelector('.sector-detail-badge');

      if (mainImg && newImgSrc && mainImg.getAttribute('src') !== newImgSrc) {
        mainImg.style.opacity = '0.3';
        mainImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          mainImg.src = newImgSrc;
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1)';
        }, 150);
      }

      if (mainBadge && newBadgeText) {
        mainBadge.innerHTML = newBadgeText;
      }
    });
  });

  // Sector links from navbar dropdown or footer
  document.querySelectorAll('[data-sector-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectorKey = link.getAttribute('data-sector-target');
      if (sectorKey) {
        switchSectorTab(sectorKey);
        const setoresSection = document.getElementById('setores');
        if (setoresSection) {
          smoothScrollToElement(setoresSection);
        }
      }
    });
  });

  // ScrollSpy: marca apenas o link ativo correspondente na navbar conforme a página é rolada
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-link');

  const updateActiveNavLink = () => {
    // Usamos um ponto de referência próximo do topo da viewport (offset de ~120px para compensar a navbar)
    const scrollPos = window.scrollY + 120;
    let currentSectionId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      // Atualiza nav desktop
      desktopNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Se for o botão dropdown de setores
        if (link.classList.contains('nav-dropdown-toggle')) {
          if (currentSectionId === 'setores') {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        } else {
          if (href === `#${currentSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });

      // Atualiza nav mobile
      mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedCards = document.querySelectorAll('.promo-card, .unit-card, .about-pillars .pillar-item, .mini-sector-card');
  animatedCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(card);
  });
});