import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, KEY } from './config';
import { getJSON, sendJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULT_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    console.log(state.recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.currentPage = 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;

  const start = (page - 1) * 10;
  const end = page * 10;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings = 4) {
  state.recipe.ingredients.forEach(
    ingredient => (ingredient.quantity *= newServings / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
  saveBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;
  saveBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArray = ingredient[1]
          .split(',')
          .map(ingredient => ingredient.trim());
        if (ingredientArray.length !== 3)
          throw new Error('Wrong ingridient format :(');

        const [quantity, unit, description] = ingredientArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

(function () {
  const getlocalStorage = localStorage.getItem('bookmarks');
  if (getlocalStorage) state.bookmarks = JSON.parse(getlocalStorage);
})();
