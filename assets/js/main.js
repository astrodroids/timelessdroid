// main.js
document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.querySelector('.tagline');
  tagline.classList.add('visible');  // CSS will transition the opacity

  const viewer = document.getElementById('image-viewer');
  const viewerImg = document.getElementById('viewer-img');
  const closeBtn = document.getElementById('viewer-close');
  document.querySelectorAll('.gallery-thumbs img').forEach(img => {
    img.addEventListener('click', () => {
      viewerImg.src = img.dataset.full || img.src;
      viewer.classList.add('active');
    });
  });
  if (viewer && closeBtn) {
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer || e.target === closeBtn) {
        viewer.classList.remove('active');
      }
    });
  }
});
