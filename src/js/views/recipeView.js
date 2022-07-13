import icons from '../../img/icons.svg';

import fracty from "fracty";

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #data;
  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this.#data = data;
    const newMarkup = this.#generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll('*');
    const curElements = this.#parentElement.querySelectorAll('*');

    newElements.forEach((newElement, index) => {
      const curElement = curElements[index];

      if (!newElement.isEqualNode(curElement) && newElement.firstChild?.nodeValue.trim() !== '') {
        curElement.textContent = newElement.textContent;
      }
      
      if (!newElement.isEqualNode(curElement)) {
        Array.from(newElement.attributes).forEach(attr => {
          curElement.setAttribute(attr.name, attr.value)
        })
      }
    });
  }

  renderError(error) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${error}</p>
    </div> `;

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerUpdateServings(handler) {
    this.#parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--tiny');

      if (!btn) return;
      const serv = +btn.dataset.serv;
      handler(serv);
    });
  }
  
  addHandlerBookmark(handler) {
    this.#parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--bookmark');
      if (!btn) return;
      handler()
    })
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  #generateMarkupIngredients(data) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          data.quantity ? fracty(data.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${data.unit || ''}</span>
          ${data.description}
        </div>
      </li>`;
  }

  #generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this.#data.image}" alt="${
      this.#data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this.#data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this.#data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this.#data.servings
        }</span>
        <span class="recipe__info-text">servings</span>
  
        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings" data-serv=${
            this.#data.servings - 1
          }>
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings" data-serv=${
            this.#data.servings + 1
          }>
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
  
      <div class="recipe__user-generated ${this.#data.key? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${this.#data.bookmarked ? '-fill' : ''}"></use>
        </svg>
      </button>
    </div>
      
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this.#data.ingredients
          .map(data => this.#generateMarkupIngredients(data))
          .join('')}
      </ul>
    </div>
    
    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This this.#data was carefully designed and tested by
        <span class="recipe__publisher">${
          this.#data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this.#data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    `;
  }
}

export default new RecipeView();
