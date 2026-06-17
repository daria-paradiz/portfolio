document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Mobile nav burger
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', true);
      });
    });
  }

  // Nav scroll-spy
  const navLinks = document.querySelectorAll('.nav-links a[href*="#"]');
  const spySections = ['work', 'about', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  // Set active link by section id, or pass null to clear all
  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', id !== null && link.getAttribute('href').includes('#' + id));
    });
  };

  // Track which sections are currently inside the spy window
  const intersecting = new Set();

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        intersecting.add(entry.target.id);
      } else {
        intersecting.delete(entry.target.id);
      }
    });
    // Highlight the topmost visible section, or clear if none (hero in view)
    const activeId = spySections.find(s => intersecting.has(s.id))?.id ?? null;
    setActiveLink(activeId);
  }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

  spySections.forEach(s => navObserver.observe(s));

  // Fallback: when scrolled to bottom of page, force the last section active
  const lastSection = spySections[spySections.length - 1];
  if (lastSection) {
    window.addEventListener('scroll', () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (nearBottom) setActiveLink(lastSection.id);
    }, { passive: true });
  }

  // Back to top — show once hero leaves viewport
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      new IntersectionObserver(
        ([entry]) => backToTop.classList.toggle('visible', !entry.isIntersecting),
        { threshold: 0 }
      ).observe(heroSection);
    }
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const isMouse = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMouse && !prefersReducedMotion) {
    // Cursor glow on full-width hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const glow = document.createElement('div');
      glow.className = 'cursor-glow';
      heroSection.appendChild(glow);

      let raf;
      heroSection.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          glow.style.left = (e.clientX - rect.left) + 'px';
          glow.style.top  = (e.clientY - rect.top)  + 'px';
          glow.style.opacity = '1';
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
      });
    }

    // 3D tilt on hero-card
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
      heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        heroCard.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        heroCard.style.transform  =
          `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.01)`;
        heroCard.style.boxShadow  =
          `${-x * 20}px ${-y * 20}px 40px rgba(26,24,20,0.1)`;
      });

      heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        heroCard.style.transform  = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
        heroCard.style.boxShadow  = '';
      });
    }
  }
});
