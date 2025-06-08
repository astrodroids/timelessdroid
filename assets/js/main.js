// main.js

// Fade in hero tagline and handle gallery image selection

document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.querySelector('.tagline');
  if (tagline) tagline.classList.add('visible');

  const viewerImg = document.getElementById('viewer-image');

  document.querySelectorAll('.gallery-thumbs img').forEach(img => {
    const show = () => {
      if (viewerImg) viewerImg.src = img.dataset.full || img.src;
    };
    img.addEventListener('click', show);
    img.addEventListener('touchstart', show);
  });
});
