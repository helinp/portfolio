let currentImageIndex = -1; // Index de l'image affichée dans le modal
let imageSources = []; // Tableau contenant les sources des images

function openModal(imageSrc, index, sources) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');

  imageSources = sources;
  currentImageIndex = index;

  modalImage.src = imageSrc;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.remove('hidden');

  document.addEventListener('keydown', handleKeyDown);
  modal.addEventListener('click', handleOutsideClick);
}

function closeModal() {
  const modal = document.getElementById('imageModal');

  modal.setAttribute('aria-hidden', 'true');
  modal.classList.add('hidden');
  document.removeEventListener('keydown', handleKeyDown);
  currentImageIndex = -1;
  imageSources = [];
}

function handleOutsideClick(event) {
  const modalImage = document.getElementById('modalImage');
  if (!modalImage.contains(event.target)) {
    closeModal();
  }
}

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'ArrowRight') {
    showNextImage();
  } else if (event.key === 'ArrowLeft') {
    showPreviousImage();
  }
}

function showNextImage() {
  if (imageSources.length === 0) return;

  currentImageIndex = (currentImageIndex + 1) % imageSources.length;
  const modalImage = document.getElementById('modalImage');
  modalImage.src = imageSources[currentImageIndex];
}

function showPreviousImage() {
  if (imageSources.length === 0) return;

  currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
  const modalImage = document.getElementById('modalImage');
  modalImage.src = imageSources[currentImageIndex];
}

document.addEventListener('DOMContentLoaded', () => {
  const imageGrid = document.getElementById('imageGrid');
  const closeModalButton = document.getElementById('closeModalButton');

  if (imageGrid) {
    const images = Array.from(imageGrid.querySelectorAll('img'));
    const sources = images.map((img) => img.src);

    imageGrid.addEventListener('click', (event) => {
      let target = event.target;
      while (target && target !== imageGrid) {
        if (target.tagName && target.tagName.toUpperCase() === 'IMG') {
          const index = images.indexOf(target);
          openModal(target.src, index, sources);
          break;
        }
        target = target.parentNode;
      }
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }
});

export { openModal, closeModal };
