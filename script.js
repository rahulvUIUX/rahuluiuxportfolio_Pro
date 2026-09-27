  // TYPEWRITER EFFECT
  const roles = ['Sole UI/UX Designer', 'Product Designer'];
  const el = document.getElementById('typewriter');
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  let animationDone = false;

  // THEME TOGGLE
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }
    localStorage.setItem('rv-theme', theme);
  }

  function type() {
    if (!el || animationDone) return; // Exit if element doesn't exist or animation is done
    
    const current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex--);
    } else {
      el.textContent = current.slice(0, charIndex++);
    }

    let speed = isDeleting ? 55 : 100;

    if (!isDeleting && charIndex > current.length) {
      // Last role — stop permanently
      if (roleIndex === roles.length - 1) {
        animationDone = true;
        return;
      }
      // Pause before deleting
      isDeleting = true;
      speed = 1600;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex++;
      charIndex = 0;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  // Restore saved preference, else honour OS preference
  const saved = localStorage.getItem('rv-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  if (btn) {
    btn.addEventListener('click', () => {
      applyTheme(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  const workGrid = document.getElementById('workGrid');
  const workCards = workGrid ? Array.from(workGrid.querySelectorAll('.work-card')) : [];
  const workFilters = Array.from(document.querySelectorAll('.work-filter'));
  const selectedWorkFilters = new Set(workFilters.filter(filter => filter.getAttribute('aria-pressed') === 'true').map(filter => filter.dataset.filter));
  const workEmptyMessage = document.getElementById('workEmpty');
  const loadMoreButton = document.getElementById('loadMoreWork');
  let workCardsExpanded = false;

  function updateWorkCards() {
    let matchingCardCount = 0;
    let matchingExtraCardCount = 0;

    workCards.forEach(card => {
      const categories = (card.dataset.categories || '').split(/\s+/);
      const matchesFilter = selectedWorkFilters.size === 0 || categories.some(category => selectedWorkFilters.has(category));
      const isExtraCard = card.hasAttribute('data-extra-card');
      card.hidden = !matchesFilter || (isExtraCard && !workCardsExpanded);

      if (matchesFilter) {
        matchingCardCount++;
        if (isExtraCard) matchingExtraCardCount++;
      }
    });

    if (workEmptyMessage) workEmptyMessage.hidden = matchingCardCount > 0;
    if (loadMoreButton) {
      loadMoreButton.hidden = matchingExtraCardCount === 0;
      loadMoreButton.setAttribute('aria-expanded', String(workCardsExpanded));
      loadMoreButton.querySelector('.load-more-label').textContent = workCardsExpanded ? 'Show less' : 'Load more';
      loadMoreButton.querySelector('.load-more-arrow').textContent = workCardsExpanded ? '↑' : '↓';
    }
  }

  workFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;
      const isSelected = selectedWorkFilters.has(category);
      if (isSelected) selectedWorkFilters.delete(category);
      else selectedWorkFilters.add(category);
      filter.setAttribute('aria-pressed', String(!isSelected));
      workCardsExpanded = false;
      updateWorkCards();
    });
  });

  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      workCardsExpanded = !workCardsExpanded;
      updateWorkCards();
    });
  }

  updateWorkCards();

  // Start typewriter animation
  type();

  // ACTIVE NAV LINK
  const sections = document.querySelectorAll('section, .cta-section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    scrollProgress.style.setProperty('--scroll-progress', progress);
    scrollProgress.style.setProperty('--scroll-marker-y', `${progress * scrollProgress.clientHeight}px`);
    scrollProgress.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
  }

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
    updateScrollProgress();
  });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();

  // BACK TO TOP
  const backTop = document.querySelector('.back-top');
  window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 300 ? '1' : '0';
    backTop.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
  });
  backTop.style.opacity = '0';

  // PAGE REVEALS
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    function animateMetric(element) {
      const originalValue = element.textContent.trim();
      const match = originalValue.match(/^([+\-−]?)(\d+)(.*)$/);
      if (!match) return;

      const [, prefix, numberText, suffix] = match;
      const targetValue = Number(numberText);
      const startTime = performance.now();
      const duration = 900;

      function updateMetric(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${prefix}${Math.round(targetValue * easedProgress)}${suffix}`;
        if (progress < 1) requestAnimationFrame(updateMetric);
        else element.textContent = originalValue;
      }

      requestAnimationFrame(updateMetric);
    }

    const revealTargets = document.querySelectorAll([
      '#hero .hero-eyebrow', '#hero .hero-h1', '#hero .hero-desc', '#hero .hero-actions a', '#hero .hero-image img',
      '.trust-intro', '.trust-stat',
      '#services .section-row', '#services .service-card',
      '#work .section-row', '#work > .case-desc', '#work .work-card',
      '.impact-heading', '.impact-card', '.impact-process-label', '.impact-steps li',
      '.about-photo', '.about-text', '.about-panel',
      '#skills .skills-group-title', '#skills .skill-category', '#skills .tool-row',
      '#experience > .section-eyebrow', '#experience .exp-card',
      '.cta-copy', '.cta-btns', 'footer .footer-brand', 'footer .footer-col', 'footer .footer-bottom'
    ].join(', '));

    revealTargets.forEach((element, index) => {
      element.setAttribute('data-reveal', '');
      const heroButtonIndex = element.matches('#hero .hero-actions a')
        ? Array.from(element.parentElement.children).indexOf(element)
        : -1;
      const revealDelay = heroButtonIndex >= 0 ? 300 + heroButtonIndex * 100 : (index % 4) * 70;
      element.style.setProperty('--reveal-delay', `${revealDelay}ms`);
    });

    if (revealTargets.length) {
      document.documentElement.classList.add('motion-ready');
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.matches('.trust-stat, .impact-card')) {
              entry.target.querySelectorAll('.n, .impact-metric:not(.impact-metric-text)').forEach(animateMetric);
            }
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

      revealTargets.forEach(element => revealObserver.observe(element));
    }
  }
