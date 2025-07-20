import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const gallery = document.querySelector('#gallery');
let lightbox;
export function renderGallery(images) {
  const markup = images
    .map(
      img => `<li class="photo-card">
        <a href="${img.largeImageURL}">
        <img src="${img.webformatURL}"alt="${img.tags}" loading="lazy"/></a>
        <div class="info">
        <p><b>Likes:</b>${img.likes}</p>
        <p><b>Views:</b>${img.views}</p>
        <p><b>Comments:</b>${img.comments}</p>
        <p><b>Downloads:</b>${img.downloads}</p>
        </div>
        </li>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
export function clearGallery() {
  gallery.innerHTML = '';
}
export function refreshLightbox() {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a');
  }
}
