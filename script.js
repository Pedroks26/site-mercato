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

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
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

  // Sector links from navbar dropdown or footer
  document.querySelectorAll('[data-sector-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      const sectorKey = link.getAttribute('data-sector-target');
      if (sectorKey) {
        switchSectorTab(sectorKey);
        const setoresSection = document.getElementById('setores');
        if (setoresSection) {
          const headerOffset = 80;
          const elementPosition = setoresSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

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