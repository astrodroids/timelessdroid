// main.js

// Fade in hero tagline
document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.querySelector('.tagline');
  if (tagline) tagline.classList.add('visible');

  const viewerImg  = document.getElementById('viewer-image');
  const viewerPrev = document.getElementById('viewer-prev');
  const viewerNext = document.getElementById('viewer-next');

  let activeRow   = [];
  let activeIndex = 0;

  function showImage(img) {
    if (!img) return;
    if (viewerImg) viewerImg.src = img.dataset.full || img.src;
    const rowImgs = Array.from(img.closest('.scroll-container').querySelectorAll('.scroll-row img'));
    activeRow   = rowImgs;
    activeIndex = rowImgs.indexOf(img);
  }

  function changeImage(step) {
    if (!activeRow.length) return;
    activeIndex = (activeIndex + step + activeRow.length) % activeRow.length;
    const img = activeRow[activeIndex];
    if (img) {
      viewerImg.src = img.dataset.full || img.src;
      img.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    }
  }

  document.querySelectorAll('.scroll-row img').forEach(img => {
    const handler = () => showImage(img);
    img.addEventListener('mouseenter', handler);
    img.addEventListener('touchstart', handler);
    img.addEventListener('click', handler);
  });

  if (viewerPrev) viewerPrev.addEventListener('click', () => changeImage(-1));
  if (viewerNext) viewerNext.addEventListener('click', () => changeImage(1));

  document.querySelectorAll('.scroll-container').forEach(container => {
    const row   = container.querySelector('.scroll-row');
    const left  = container.querySelector('.scroll-left');
    const right = container.querySelector('.scroll-right');
    const play  = container.querySelector('.scroll-play');
    let auto    = null;

    if (left)  left.addEventListener('click',  () => row.scrollBy({left:-row.clientWidth, behavior:'smooth'}));
    if (right) right.addEventListener('click', () => row.scrollBy({left: row.clientWidth, behavior:'smooth'}));

    function autoNext() {
      if (!activeRow.length) {
        activeRow = Array.from(row.querySelectorAll('img'));
        activeIndex = 0;
      }
      changeImage(1);
    }

    if (play) {
      play.addEventListener('click', () => {
        if (auto) {
          clearInterval(auto);
          auto = null;
          play.textContent = 'Play';
        } else {
          auto = setInterval(autoNext, 2000);
          play.textContent = 'Pause';
        }
      });
    }
  });
});
