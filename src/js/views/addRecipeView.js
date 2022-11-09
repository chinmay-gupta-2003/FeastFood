import icons from 'url:../../img/icons.svg';
import View from './view';

class AddRecipeView extends View {
  _parentCont = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpenModal = document.querySelector('.nav__btn--add-recipe');
  _btnCloseModal = document.querySelector('.btn--close-modal');
  _errorMessage =
    'Wrong ingredient format! Please try with the correct format :)';
  _message = 'Recipe was successfully uploaded :)';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  _addHandlerShowWindow() {
    this._btnOpenModal.addEventListener(
      'click',
      this._toggleClassHidden.bind(this)
    );
  }

  _addHandlerCloseWindow() {
    [this._btnCloseModal, this._overlay].forEach(element =>
      element.addEventListener('click', this._toggleClassHidden.bind(this))
    );
  }

  _toggleClassHidden() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerUpload(handler) {
    this._parentCont.addEventListener('submit', function (e) {
      e.preventDefault();

      const inputs = Object.fromEntries([...new FormData(this)]);

      handler(inputs);
    });
  }
}

export default new AddRecipeView();
