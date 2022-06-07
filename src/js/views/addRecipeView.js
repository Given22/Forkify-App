import icons from '../../img/icons.svg';

export default new (class RecipesListView {
  #parentElement = document.querySelector('.upload');
  #window = document.querySelector('.add-recipe-window');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.nav__btn--add-recipe');
  #btnClose = document.querySelector('.btn--close-modal');

  constructor(){
    this.#addHandlerShow()
    this.#addHandlerHide()
  }
  
  toggleWindow(){
      this.#overlay.classList.toggle('hidden')
      this.#window.classList.toggle('hidden')
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
  
  #clear() {
    this.#parentElement.innerHTML = '';
  }

  #addHandlerShow(){
    this.#btnOpen.addEventListener('click', this.toggleWindow.bind(this))
  }
  
  #addHandlerHide(){
    this.#btnClose.addEventListener('click', this.toggleWindow.bind(this))
    this.#overlay.addEventListener('click', this.toggleWindow.bind(this))
  }
  
  addHandlerUpload(handler){
    this.#parentElement.addEventListener('click', function (event) {
      event.preventDefault()
      const btn = event.target.closest('.upload__btn');
      if(!btn) return
      
      
      const dataArr = [...new FormData(this)];
      console.log(dataArr)
      const data = Object.fromEntries(dataArr);
      console.log(data)
      // debugger
      handler(data);
    })
  }

})();
