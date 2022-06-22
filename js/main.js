/* global rotd */

var $ingredientsList = document.querySelector('.ingredients-list');
var $recipeTitle = document.querySelector('.recipe-title');
var $recipeLink = document.querySelector('.recipe-link');
var $recipeImg = document.querySelector('.recipe-img');
var $cal = document.querySelector('.cal');
var $fat = document.querySelector('.fat');
var $carbs = document.querySelector('.carbs');
var $protein = document.querySelector('.protein');
var $chol = document.querySelector('.chol');
var $dataViewSearchResults = document.querySelector('[data-view-search-results]');
var $searchResultsTemplate = document.querySelector('[data-search-results-template]');
var $searchForm = document.querySelector('.search-form');
var $dataViewRotd = document.querySelector('[data-view-rotd]');
var $home = document.querySelector('#home');

var xhrPasta = new XMLHttpRequest();
var xhrChicken = new XMLHttpRequest();
var xhrAll = [];
var categories = [];
var recipes = [];
var search = [];

xhrPasta.open('GET', 'https://api.edamam.com/api/recipes/v2?type=public&q=pasta&app_id=d9d7c90f&app_key=0f9cf819b103aee9ff35391f403b7886');
xhrPasta.responseType = 'json';
xhrPasta.addEventListener('load', () => {
  xhrAll.push(xhrPasta);
});
xhrPasta.send();

xhrChicken.open('GET', 'https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=d9d7c90f&app_key=0f9cf819b103aee9ff35391f403b7886');
xhrChicken.responseType = 'json';
xhrChicken.addEventListener('load', () => {
  xhrAll.push(xhrChicken);

  var randomCategory;

  function getRandomCategory() {
    randomCategory = xhrAll[Math.floor(Math.random() * xhrAll.length)];

    return randomCategory;
  }
  getRandomCategory();

  function getRandomRecipe(category) {
    var randomIndex = Math.floor(Math.random() * category.response.hits.length);
    var randomRecipe = category.response.hits[randomIndex];
    return randomRecipe;
  }

  rotd.push(getRandomRecipe(randomCategory));

  renderRotd();
  getCategories();
  getRecipes();
  renderAllRecipes();
});
xhrChicken.send();

function renderRotd() {
  $ingredientsList.innerHTML = '';
  for (var i = 0; i < rotd[0].recipe.ingredientLines.length; i++) {
    var $li = document.createElement('li');
    $li.textContent = rotd[0].recipe.ingredientLines[i];
    $ingredientsList.appendChild($li);
  }

  $cal.textContent += Math.round(rotd[0].recipe.calories);
  $fat.textContent += Math.round(rotd[0].recipe.digest[0].total) + 'g';
  $carbs.textContent += Math.round(rotd[0].recipe.digest[1].total) + 'g';
  $protein.textContent += Math.round(rotd[0].recipe.digest[2].total) + 'g';
  $chol.textContent += Math.round(rotd[0].recipe.digest[3].total) + 'g';

  $recipeTitle.textContent = rotd[0].recipe.label;

  $recipeLink.textContent = rotd[0].recipe.url;
  $recipeLink.setAttribute('href', rotd[0].recipe.url);

  $recipeImg.src = rotd[0].recipe.image;
}

// search feature
function getCategories() {
  for (var i = 0; i < xhrAll.length; i++) {
    categories.push(xhrAll[i].response.hits);
  }
}

function getRecipes() {
  for (var i = 0; i < categories.length; i++) {
    for (var j = 0; j < categories[i].length; j++) {
      recipes.push(categories[i][j].recipe);
    }
  }
}

function renderAllRecipes() {
  search = recipes.map(recipes => {
    var searchResults = $searchResultsTemplate.content.cloneNode(true).children[0];
    var dataRecipeTitle = searchResults.querySelector('[data-recipe-title]');
    var dataCal = searchResults.querySelector('[data-cal]');
    var dataFat = searchResults.querySelector('[data-fat]');
    var dataCarbs = searchResults.querySelector('[data-carbs]');
    var dataProtein = searchResults.querySelector('[data-protein]');
    var dataChol = searchResults.querySelector('[data-chol]');
    var dataRecipeLink = searchResults.querySelector('[data-recipe-link]');
    var dataRecipeImg = searchResults.querySelector('[data-recipe-img]');

    dataRecipeTitle.textContent = recipes.label;
    dataCal.textContent += Math.round(recipes.calories);
    dataFat.textContent += Math.round(recipes.digest[0].total) + 'g';
    dataCarbs.textContent += Math.round(recipes.digest[1].total) + 'g';
    dataProtein.textContent += Math.round(recipes.digest[2].total) + 'g';
    dataChol.textContent += Math.round(recipes.digest[3].total) + 'g';
    dataRecipeLink.textContent = recipes.url;
    dataRecipeLink.setAttribute('href', recipes.url);
    dataRecipeImg.src = recipes.image;

    for (var i = 0; i < recipes.ingredientLines.length; i++) {
      var dataIngredientsList = searchResults.querySelector('[data-ingredients-list]');
      var $li = document.createElement('li');
      $li.textContent = recipes.ingredientLines[i];
      dataIngredientsList.appendChild($li);
    }

    $dataViewSearchResults.append(searchResults);
    return { recipeTitle: recipes.label, cuisine: recipes.cuisineType, element: searchResults };
  });
}

$searchForm.addEventListener('submit', e => {
  e.preventDefault();

  var inputValue = $searchForm.querySelector('input').value;

  for (var i = 0; i < search.length; i++) {
    var isVisible = search[i].recipeTitle.toLowerCase().includes(inputValue) || search[i].cuisine.toString().toLowerCase().includes(inputValue);
    search[i].element.classList.toggle('hidden', !isVisible);
  }

  searchView();
});

// view switches
$home.addEventListener('click', () => {
  $dataViewRotd.classList.remove('hidden');
  $dataViewSearchResults.classList.add('hidden');
});

function searchView() {
  $dataViewRotd.classList.add('hidden');
  $dataViewSearchResults.classList.remove('hidden');
}

// mobile nav menu button
var $navigationMenu = document.querySelector('.navigation-menu');
var $navToggle = document.querySelector('.mobile-nav-toggle');

$navToggle.addEventListener('click', () => {
  var visibility = $navigationMenu.getAttribute('data-visible');

  if (visibility === 'false') {
    $navigationMenu.setAttribute('data-visible', true);
    $navToggle.setAttribute('aria-expanded', true);
  } else if (visibility === 'true') {
    $navigationMenu.setAttribute('data-visible', false);
    $navToggle.setAttribute('aria-expanded', false);
  }
});
