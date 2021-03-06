import icons from '../../img/icons.svg';

export default new class RecipesListView {
  #parentElement = document.querySelector('.results');
  #data;

  render(data) {
    this.#data = data;
    this.#clear();
    
    console.log(data)

    data
      .forEach(recipe =>
        this.#parentElement.insertAdjacentHTML(
          'afterbegin',
          this.#generateMarkup(recipe)
        )
      );
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

      if (!newElement.isEqualNode(curElement) && newElement?.firstChild.nodeValue.trim() !== '') {
        curElement.textContent = newElement.textContent;
      }
      
      if (!newElement.isEqualNode(curElement)) {
        Array.from(newElement.attributes).forEach(attr => {
          curElement.setAttribute(attr.name, attr.value)
        })
      }
    });
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  #generateMarkup(recipe) {
    return `
    <li class="preview">
      <a class="preview__link" href="#${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.image}" alt="${recipe.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          <div class="preview__user-generated ${recipe.key? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>`;
  }
}
