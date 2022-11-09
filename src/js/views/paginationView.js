import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginationView extends View {
  _parentCont = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentCont.addEventListener('click', function (e) {
      const btnClicked = e.target.closest('.btn--inline');
      if (!btnClicked) return;

      const goToPage = +btnClicked.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.currentPage;

    //Only 1 page
    if (currentPage === 1 && totalPages === 1) return '';

    //On 1st page, other pages
    if (currentPage === 1 && totalPages > 1)
      return this._generateNextBtnMarkup(currentPage);

    //Other pages
    if (currentPage < totalPages)
      return (
        this._generatePreviousBtnMarkup(currentPage) +
        this._generateNextBtnMarkup(currentPage)
      );

    //Last page
    if (currentPage === totalPages)
      return this._generatePreviousBtnMarkup(currentPage);
  }

  _generatePreviousBtnMarkup(currentPage) {
    return `
      <button 
       data-goto=${currentPage - 1} 
       class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
          `;
  }

  _generateNextBtnMarkup(currentPage) {
    return `
       <button 
        data-goto=${currentPage + 1}
        class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
       </button>
    `;
  }
}

export default new PaginationView();
