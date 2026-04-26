(function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();

(function initScrollReveal() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  cards.forEach(card => observer.observe(card));
})();