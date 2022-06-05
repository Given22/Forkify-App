import * as model from './model';
import recipeView from './views/recipeView';
import recipesListView from './views/recipesListView';
import paginationView from './views/paginationView';

const searchBtn = document.querySelector('.search__btn');
const searchField = document.querySelector('.search__field');

const controlSearch = async function (e) {
  try {
    e.preventDefault();

    const search = searchField.value;
    searchField.value = '';

    //search the recipes in API
    await model.searchRecipe(search);

    //render the results
    recipesListView.render(model.getSearchResultsPage(model.state.search.page));

    //render initial pagination view
    paginationView.render(model.state.search);
  } catch (e) {
    console.log(e);
    recipesListView.renderError(
      'We could not find any recipes for you. Please try again.'
    );
  }
};

const controlPages = function (page) {
  model.state.search.page = page;
  recipesListView.render(model.getSearchResultsPage(model.state.search.page));
  paginationView.render(model.state.search);
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Getting the recipe from the API.
    await model.loadRecipe(id);

    // render the recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    recipeView.renderError(
      'We could not find that recipe for you. Please try again.'
    );
  }
};

const controlServings = function (servings) {
  if (servings < 1) return;
  model.updateServings(servings);
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchBtn.addEventListener('click', controlSearch);
  paginationView.addHandlerClick(controlPages);
};

init();
