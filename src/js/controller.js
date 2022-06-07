import * as model from './model';
import recipeView from './views/recipeView';
import recipesListView from './views/recipesListView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

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
    // recipesListView.renderError(
    //   'We could not find any recipes for you. Please try again.'
    // );
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

    bookmarksView.render(model.state.bookmarks);

    // Getting the recipe from the API.
    await model.loadRecipe(id);

    // render the recipe
    recipeView.render(model.state.recipe);
    // recipeView.update(model.getSearchResultsPage());
  } catch (e) {
    console.log(e);
    recipeView.renderError(
      'We could not find that recipe for you. Please try again.'
    );
  }
};

const controlBookmark = function () {
  // add / remove bookmark
  if (model.state.recipe.bookmarked)
    model.removeBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // update the recipe view
  recipeView.update(model.state.recipe);

  // update the bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlServings = function (servings) {
  if (servings < 1) return;
  model.updateServings(servings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    console.log('test 1')
    await model.uploadRecipe(newRecipe);
    
    
    console.log('test 2')
    console.log(model.state.recipe)
    await recipeView.render(model.state.recipe);
    
    console.log(model.state.recipe.id)
    
    await bookmarksView.render(model.state.bookmarks);
    await history.pushState({}, '', `#${model.state.recipe.id}`);

    await addRecipeView.toggleWindow();
  } catch (e) {
    console.error(e.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchBtn.addEventListener('click', controlSearch);
  paginationView.addHandlerClick(controlPages);
  model.getLocalBookmarks();
  bookmarksView.render(model.state.bookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe)
};

init();
