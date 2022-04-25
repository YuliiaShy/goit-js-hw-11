import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import APIService from './js/fetchImages';
import markupHbs from "./templates/markup.hbs"

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const buttonEl = document.querySelector('.load-more');

const apiService = new APIService();
const galleryBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captions: true,
  captionDelay: 250,
});

buttonEl.classList.add('is-hidden');
formEl.addEventListener('submit', onSubmitForm);
buttonEl.addEventListener('click', onLoadMore);



function onSubmitForm(event) {
   event.preventDefault();
 
   apiService.query = event.currentTarget.elements.searchQuery.value.trim();
   if (apiService.query === "") {
   Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
      return
   }
   apiService.resetPage();
   apiService.fetchImages().then(markupGallery);
   galleryEl.innerHTML = "";
   formEl.reset();
}

function onLoadMore() {
   apiService.fetchImages().then(markupGallery);
}

function markupGallery(data) {
   console.log(data.totalHits);

    if(data.totalHits === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;

    } else if(apiService.page === 2) {
        let totalHits = data.totalHits;
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
            buttonEl.classList.remove('is-hidden');
    
    } else if(data.totalHits !== 0 && data.hits.length === 0) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        buttonEl.classList.add('is-hidden');
    }

    galleryEl.insertAdjacentHTML('beforeend', markupHbs(data.hits));
    galleryBox.refresh();
};
  


