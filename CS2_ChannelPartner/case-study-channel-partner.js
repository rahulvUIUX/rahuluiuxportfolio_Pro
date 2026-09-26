// Build table of contents from sections with data-toc.
const tocSections = Array.from(document.querySelectorAll('section[data-toc]'));
const fixedPanel = document.getElementById('tocFixedPanel');
const dropdownPanel = document.querySelector('#tocDropdown .toc-panel');
tocSections.forEach((sec, i) => {
  const num = String(i + 1).padStart(2, '0');
  const label = sec.getAttribute('data-toc');
  const href = '#' + sec.id;
  [fixedPanel, dropdownPanel].forEach(panel => {
    const a = document.createElement('a');
    a.href = href;
    a.dataset.target = sec.id;
    a.innerHTML = '<span class="n">' + num + '</span>' + label;
    panel.appendChild(a);
  });
});

// Mobile / tablet contents dropdown toggle.
const tocToggle = document.getElementById('tocToggle');
const tocDropdown = document.getElementById('tocDropdown');
const tocChevron = document.getElementById('tocChevron');
tocToggle.addEventListener('click', () => {
  const open = tocDropdown.classList.toggle('open');
  tocToggle.setAttribute('aria-expanded', open);
  tocChevron.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
});
dropdownPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  tocDropdown.classList.remove('open');
  tocToggle.setAttribute('aria-expanded', 'false');
  tocChevron.style.transform = 'rotate(0deg)';
}));

// Scrollspy: highlight current section in both TOC panels.
const allTocLinks = document.querySelectorAll('.toc-panel a');
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allTocLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
  tocSections.forEach(sec => spy.observe(sec));
}

// Back to top.
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 900);
}, { passive: true });

// Reading progress bar.
const bar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const height = h.scrollHeight - h.clientHeight;
  bar.style.width = (height > 0 ? (scrolled/height)*100 : 0) + '%';
}
document.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// Reveal sections as they enter the viewport.
const els = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:0.08});
  els.forEach(el=>io.observe(el));
} else {
  els.forEach(el=>el.classList.add('in'));
}
