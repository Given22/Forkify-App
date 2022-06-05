// import { async } from 'regenerator-runtime/runtime';
import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    recipes: [],
    resultsPerPage: RESULTS_PER_PAGE,
    query: '',
    page: 1
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (e) {
    throw e;
  }
};

export const searchRecipe = async function (search) {
  try {
    if (!search) throw new Error();

    
    const response = await getJSON(`${API_URL}?search=${search}`);
    const { recipes } = await response.data;
    
    if ((await recipes.length) === 0) throw new Error();
    
    state.search.recipes = await recipes;
    state.search.query = search;
    state.search.page = 1;
    
  } catch (e) {
    recipeView.renderError(
      'We could not find any recipes for you. Please try again.'
    );
  }
};

export const getSearchResultsPage = function (page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.recipes.slice(start, end);
};

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
  ing.quantity = (ing.quantity * newServings) / state.recipe.servings ;
})
state.recipe.servings = newServings;
}