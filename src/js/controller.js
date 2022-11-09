import { async } from 'regenerator-runtime';
import 'core-js/stable'; // Polyfilling others
import 'regenerator-runtime/runtime'; // Polyfilling async/await
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { TIMEOUT_MODAL_SEC } from './config.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.getSpinner();

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
    resultsView.update(model.getSearchResultsPage());
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.getSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.getSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView._toggleClassHidden();
    }, TIMEOUT_MODAL_SEC * 1000);

    console.log(model.state.recipe);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError();
  }
};

(function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();
