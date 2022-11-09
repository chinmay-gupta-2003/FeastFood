import icons from 'url:../../img/icons.svg';
import View from './view';
import PreviewView from './previewView.js';

class BookmarksView extends PreviewView {
  _parentCont = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks found. Try a new recipe and bookmark it :)';
  _message = `Start by searching for a recipe or an ingredient. Have fun!`;

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
