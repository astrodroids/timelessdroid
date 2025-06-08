// main.js

// Fade in hero tagline
document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.querySelector('.tagline');
  if (tagline) tagline.classList.add('visible');

  const viewerImg = document.getElementById('viewer-image');

  function showImage(img) {
    if (viewerImg) viewerImg.src = img.dataset.full || img.src;
  }

  document.querySelectorAll('.scroll-row img').forEach(img => {
    img.addEventListener('mouseenter', () => showImage(img));
    img.addEventListener('touchstart', () => showImage(img));
  });

  document.querySelectorAll('.scroll-container').forEach(container => {
    const row   = container.querySelector('.scroll-row');
    const left  = container.querySelector('.scroll-left');
    const right = container.querySelector('.scroll-right');
    const play  = container.querySelector('.scroll-play');
    let auto    = null;

    if (left)  left.addEventListener('click',  () => row.scrollBy({left:-row.clientWidth, behavior:'smooth'}));
    if (right) right.addEventListener('click', () => row.scrollBy({left: row.clientWidth, behavior:'smooth'}));

    if (play) {
      play.addEventListener('click', () => {
        if (auto) {
          clearInterval(auto);
          auto = null;
          play.textContent = 'Play';
        } else {
          auto = setInterval(() => {
            row.scrollBy({left:1});
            if (row.scrollLeft + row.clientWidth >= row.scrollWidth) {
              row.scrollLeft = 0;
            }
          }, 30);
          play.textContent = 'Pause';
        }
      });
    }
  });
});
