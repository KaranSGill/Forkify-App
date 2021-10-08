import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import 'regenerator-runtime/runtime';
import 'core-js/stable';

// if(module.hot) {
//   module.hot.accept()
// };

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    // Loading spinner
    recipeView.renderSpinner();

    // Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmark);

    // 1:  Loading a recipe from forkify api
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2: Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    recipeView.renderSpinner();
    //1: Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2:Load search results
    await model.loadSearchResults(query);

    // 3: Render Results
    resultsView.render(model.getSearchResultsPage(1));

    // 4: Render intial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3: Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4: Render intial pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Updating the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or Remove the bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.bookmark);

  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmark);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmark)
}

// Publisher Subscriber Pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();

