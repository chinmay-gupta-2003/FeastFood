class SearchView {
  #parentCont = document.querySelector('.search');
  #searchInputCont = document.querySelector('.search__field');

  getQuery() {
    const query = this.#parentCont.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this.#parentCont.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  #clearInput() {
    this.#searchInputCont.value = '';
    this.#searchInputCont.blur();
  }
}

export default new SearchView();
