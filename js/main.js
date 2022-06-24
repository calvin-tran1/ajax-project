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
var $heartBtn = document.querySelector('.heart-btn');
var $favoritesTemplate = document.querySelector('[data-favorites-template]');
var $dataViewFavorites = document.querySelector('[data-view-favorites]');
var $favorites = document.querySelector('#favorites');
var $heart = document.querySelector('.fa-heart');

var xhrPasta = new XMLHttpRequest();
var xhrChicken = new XMLHttpRequest();
var xhrAll = [];
var categories = [];
var recipes = [];
var search = [];
var recipeId = 0;

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
    var heart = searchResults.querySelector('.fa-heart');
    var id = recipeId;

    recipeId++;
    heart.setAttribute('data-search-id', id);
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

    if (data.favorites !== null) {
      for (var j = 0; j < data.favorites.length; j++) {
        if (data.favorites[j].label === recipes.label) {
          heart.className = 'fas fa-heart';
        }
      }
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
  $dataViewFavorites.classList.add('hidden');

  $heart.className = 'far fa-heart';

  for (var i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].label === rotd[0].recipe.label) {
      $heart.className = 'fas fa-heart';
    }
  }
});

function searchView() {
  $dataViewSearchResults.classList.remove('hidden');
  $dataViewRotd.classList.add('hidden');
  $dataViewFavorites.classList.add('hidden');
}

$favorites.addEventListener('click', () => {
  $dataViewFavorites.classList.remove('hidden');
  $dataViewRotd.classList.add('hidden');
  $dataViewSearchResults.classList.add('hidden');

  while ($dataViewFavorites.firstChild) {
    $dataViewFavorites.removeChild($dataViewFavorites.firstChild);
  }
  data.favId = 0;
  renderFavorites();

  if (data.favorites.length === 0) {
    var $p = document.createElement('p');
    $p.className = 'no-fav-text';
    $p.textContent = 'Search for a Favorite Recipe!';
    $dataViewFavorites.appendChild($p);
  }
});

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

// favorites
$heartBtn.addEventListener('click', () => {
  if ($heart.classList.contains('far')) {
    $heart.classList.remove('far');
    $heart.classList.add('fas');
  } else {
    $heart.classList.remove('fas');
    $heart.classList.add('far');
  }

  for (var i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].label === rotd[0].recipe.label) {
      return data.favorites.splice(i, 1);
    }
  }

  data.favorites.unshift(rotd[0].recipe);
});

function renderFavorites() {
  data.favorites.forEach(recipes => {
    var favorites = $favoritesTemplate.content.cloneNode(true);
    var dataRecipeTitle = favorites.querySelector('[data-recipe-title]');
    var dataCal = favorites.querySelector('[data-cal]');
    var dataFat = favorites.querySelector('[data-fat]');
    var dataCarbs = favorites.querySelector('[data-carbs]');
    var dataProtein = favorites.querySelector('[data-protein]');
    var dataChol = favorites.querySelector('[data-chol]');
    var dataRecipeLink = favorites.querySelector('[data-recipe-link]');
    var dataRecipeImg = favorites.querySelector('[data-recipe-img]');
    var favDiv = favorites.querySelector('.favorite');
    var heart = favorites.querySelector('.fa-heart');

    favDiv.setAttribute('data-favorite-id', data.favId);
    heart.setAttribute('data-heart-id', data.favId);
    data.favId++;
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
      var dataIngredientsList = favorites.querySelector('[data-ingredients-list]');
      var $li = document.createElement('li');
      $li.textContent = recipes.ingredientLines[i];
      dataIngredientsList.appendChild($li);
    }

    $dataViewFavorites.append(favorites);
  });
}

$dataViewSearchResults.addEventListener('click', e => {
  if (e.target.matches('[data-search-id]')) {
    var getRecipeId = e.target.getAttribute('data-search-id');

    for (var i = 0; i < data.favorites.length; i++) {
      for (var j = 0; j < recipes.length; j++) {
        if (data.favorites[i].label === recipes[getRecipeId].label) {
          e.target.className = 'far fa-heart';
          return data.favorites.splice(i, 1);
        }
      }
    }

    e.target.className = 'fas fa-heart';
    data.favorites.unshift(recipes[getRecipeId]);

    while ($dataViewFavorites.firstChild) {
      $dataViewFavorites.removeChild($dataViewFavorites.firstChild);
    }

    data.favId = 0;
    renderFavorites();
  }
});

$dataViewFavorites.addEventListener('click', e => {
  if (e.target.matches('.fa-heart')) {
    var heartId = e.target.getAttribute('data-heart-id');
    data.favorites.splice(heartId, 1);
  }

  while ($dataViewFavorites.firstChild) {
    $dataViewFavorites.removeChild($dataViewFavorites.firstChild);
  }
  data.favId = 0;
  renderFavorites();

  if (data.favorites.length === 0) {
    var $p = document.createElement('p');
    $p.className = 'no-fav-text';
    $p.textContent = 'Search for a Favorite Recipe!';
    $dataViewFavorites.appendChild($p);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  for (var i = 0; i < data.favorites.length; i++) {
    if (data.favorites[i].label === rotd[0].recipe.label) {
      $heart.className = 'fas fa-heart';
    } else {
      $heart.className = 'far fa-heart';
    }
  }
});

// write original recipe
var $addIngredient = document.querySelector('.add-ingredient');
var $ingredientEntries = document.querySelector('.ingredient-entries');
var $form = document.querySelector('#og-recipe-form');
var $placeholderImg = document.querySelector('.placeholder-img');
var $ogRecipePhoto = document.querySelector('#og-recipe-photo');

$addIngredient.addEventListener('click', () => {
  var $li = document.createElement('li');
  var $input = document.createElement('input');
  var $button = document.createElement('button');

  $input.setAttribute('required', '');
  $input.setAttribute('name', 'og-ingredient');
  $input.setAttribute('placeholder', 'Ingredient');
  $input.className = 'og-ingredient';

  $button.setAttribute('type', 'button');
  $button.className = 'delete-ingredient';
  $button.textContent = '-';

  $li.appendChild($input);
  $li.appendChild($button);
  $ingredientEntries.appendChild($li);
});

$ingredientEntries.addEventListener('click', e => {
  if (e.target.matches('.delete-ingredient')) {
    e.target.parentElement.remove();
  }
});

$ogRecipePhoto.addEventListener('input', () => {
  $placeholderImg.setAttribute('src', $ogRecipePhoto.value);
});

$form.addEventListener('submit', e => {
  e.preventDefault();

  var recipeNameValue = $form.elements.ogRecipeName.value;
  var photoValue = $form.elements.ogRecipePhoto.value;
  var ingredientsValue = [];
  var ingredients = document.querySelectorAll('.og-ingredient');
  var directionsValue = $form.elements.directions.value;
  var entryId = data.nextEntryId;
  var newEntry = { recipeNameValue, photoValue, ingredientsValue, directionsValue, entryId };

  for (var i = 0; i < ingredients.length; i++) {
    ingredientsValue.push(ingredients[i].value);
  }

  data.entries.unshift(newEntry);
  data.nextEntryId++;

  $form.reset();
  $placeholderImg.setAttribute('src', 'images/img-placeholder.png');
});
