import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
},
    bookmark: [],

};

export const loadRecipe = async function (id) {
  try {
    const result = await getJSON(`${API_URL}${id}`);

    const { recipe } = result.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      image: recipe.image_url,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmark.some(bookmark => bookmark.id === id))
    state.recipe.bookmarked = true;
    else 
    state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err} 🔥🔥🔥🔥`);
    throw err;
  }
};

//////////////////////          Search Functionality            ////////////////////////

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const dataResults = await getJSON(`${API_URL}?search=${query}`);
    // console.log(dataResults);

    state.search.results = dataResults.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥🔥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};


export const updateServings = function(newServings) {
state.recipe.ingredients.forEach(ing => {
  ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4;
}); 

state.recipe.servings = newServings;

};

const persistBookmarks = function(){
localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};

export const addBookmark = function(recipe) {
  // Add bookmark
  state.bookmark.push(recipe);

  // Mark current recipe as bookmark
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();

};

export const deleteBookmark = function(id) {

  // Delete bookmark
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);

  // Mark current recipe as NOT bookmark
  if(id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};


const init= function() {
const storage = localStorage.getItem('bookmark');
if (storage) state.bookmark = JSON.parse(storage);
};

init();
console.log(state.bookmark);


const clearBookmarks = function() {
  localStorage.clear('bookmark')
};

// clearBookmarks();

console.log(`Hello world`);