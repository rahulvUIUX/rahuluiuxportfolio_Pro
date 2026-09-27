  // TYPEWRITER EFFECT
  const roles = ['Sole UI/UX Designer', 'Product Designer'];
  const el = document.getElementById('typewriter');
  let roleIndex = 0, charIndex = 0, isDeleting = false;

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
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // BACK TO TOP
  const backTop = document.querySelector('.back-top');
  window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 300 ? '1' : '0';
    backTop.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
  });
  backTop.style.opacity = '0';

  // SCROLL ANIMATIONS
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.work-card, .highlight-card, .exp-card, .testi-card').forEach(el => {
    el.style.transform = 'translateY(20px)';
    el.style.opacity = '0';
    el.style.transition = 'transform 0.5s ease, opacity 0.5s ease, background-color 0.35s ease, border-color 0.35s ease';
    observer.observe(el);
  });
