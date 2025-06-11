// main.js

// Fade in hero tagline on page load
document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.querySelector('.tagline');
  if (tagline) tagline.classList.add('visible');
});
