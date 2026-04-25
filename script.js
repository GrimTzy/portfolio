/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ===== REVEAL CARDS ON SCROLL ===== */
const cards = document.querySelectorAll('.card');
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      cardObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });

cards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(12px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObs.observe(card);
});