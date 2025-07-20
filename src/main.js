import {
  renderGallery,
  clearGallery,
  refreshLightbox,
} from './js/renderGallery.js';
import { showLoader, hideLoader } from './js/loader.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages } from './js/api.js';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loadMoreBtn = document.querySelector('#load-more-btn');

let currentPage = 1;
let currentQuery = '';
let totalPages = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();
  currentQuery = e.target.elements.searchQuery.value.trim();

  // Eğer sorgu boşsa galeri temizle, butonu gizle, loader kapat
  if (!currentQuery) {
    clearGallery();
    hideLoadMore();
    hideLoader();
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMore();
  showLoader();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    const images = data.hits;

    if (images.length === 0) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoader();
      hideLoadMore();
      return;
    }

    renderGallery(images);
    refreshLightbox();

    totalPages = Math.ceil(data.totalHits / 40);

    if (currentPage < totalPages) {
      showLoadMore();
    } else {
      hideLoadMore();
    }
  } catch (err) {
    iziToast.error({
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMore();
  showLoader();

  try {
    const data = await fetchImages(currentQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMore();
      return;
    }

    renderGallery(data.hits);
    refreshLightbox();
    scrollByCardHeight();

    if (currentPage >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMore();
    } else {
      showLoadMore();
    }
  } catch (err) {
    iziToast.error({
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function showLoadMore() {
  loadMoreBtn.classList.remove('hidden');
}

function hideLoadMore() {
  loadMoreBtn.classList.add('hidden');
}

function scrollByCardHeight() {
  const card = document.querySelector('.gallery li');
  if (card) {
    const cardHeight = card.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
