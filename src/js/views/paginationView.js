import icons from '../../img/icons.svg';

export default new (class RecipesListView {
  #parentElement = document.querySelector('.pagination');
  #data;

  render(data) {
    this.#data = data;
    this.#parentElement.innerHTML = this.#generateMarkup();
  }

  addHandlerClick(handler) {
    this.#parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if(!btn) return
      handler(+(btn.dataset.page));
    });
  }

  #generateMarkup() {
    const numPages = Math.ceil(
      this.#data.recipes.length / this.#data.resultsPerPage
    );
    // page 1, and there are other pages
    if (this.#data.page === 1 && numPages > 1) {
      return ` ${this.#generateNextMarkup(this.#data.page)}`;
    }

    // Last page
    if (this.#data.page === numPages) {
      return `${this.#generatePrevMarkup(this.#data.page)}`;
    }

    // Other page

    if (this.#data.page > 1 && this.#data.page < numPages) {
      return `${this.#generateNextMarkup(
        this.#data.page
      )} ${this.#generatePrevMarkup(this.#data.page)} `;
    }

    // page 1, and there are no other pages
    return '';
  }

  #generateNextMarkup(page) {
    return `
    <button class="btn--inline pagination__btn--next" data-page=${page + 1}>
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
  }

  #generatePrevMarkup(page) {
    return `
    <button class="btn--inline pagination__btn--prev" data-page=${page - 1}>
      <span>Page ${page - 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
    </button>`;
  }
})();
