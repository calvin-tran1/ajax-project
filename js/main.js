/* global rotd */

var $ingredientsList = document.querySelector('.ingredients-list');
var $rotdTitle = document.querySelector('.rotd-title');
var $rotdLink = document.querySelector('#rotd-link');
var $rotdImg = document.querySelector('#rotd-img');
var $cal = document.querySelector('.cal');
var $fat = document.querySelector('.fat');
var $carbs = document.querySelector('.carbs');
var $protein = document.querySelector('.protein');
var $chol = document.querySelector('.chol');
var $favorites = document.getElementById('favorites');
var $yourRecipes = document.getElementById('your-recipes');
var $writeRecipe = document.getElementById('write-recipe');
var $heartBtn = document.querySelector('.heart-btn');
var $heart = document.getElementById('heart');

var xhrAll = [];
var xhrPasta = new XMLHttpRequest();
var xhrChicken = new XMLHttpRequest();

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
});
xhrChicken.send();

function renderRotd() {
  $ingredientsList.innerHTML = '';
  for (var i = 0; i < rotd[0].recipe.ingredientLines.length; i++) {
    var $li = document.createElement('li');
    $li.textContent = rotd[0].recipe.ingredientLines[i];
    $ingredientsList.appendChild($li);
  }

  $cal.textContent = 'Calories: ' + rotd[0].recipe.calories;
  $fat.textContent = 'Fat: ' + rotd[0].recipe.digest[0].total + 'g';
  $carbs.textContent = 'Carbs: ' + rotd[0].recipe.digest[1].total + 'g';
  $protein.textContent = 'Protein: ' + rotd[0].recipe.digest[2].total + 'g';
  $chol.textContent = 'Cholesterol: ' + rotd[0].recipe.digest[3].total + 'g';

  $rotdTitle.textContent = rotd[0].recipe.label;

  $rotdLink.textContent = rotd[0].recipe.url;
  $rotdLink.setAttribute('href', rotd[0].recipe.url);

  $rotdImg.src = rotd[0].recipe.image;
}

// navbar mobile/desktop view-switch
window.addEventListener('resize', () => {
  if (window.innerWidth < 768) {
    $favorites.style.display = 'none';
    $yourRecipes.style.display = 'none';
    $writeRecipe.style.display = 'none';
  } else {
    $favorites.style.display = 'inline';
    $yourRecipes.style.display = 'inline';
    $writeRecipe.style.display = 'inline';
  }
});

// heart btn
$heartBtn.addEventListener('click', () => {
  if ($heart.classList.contains('far')) {
    $heart.classList.remove('far');
    $heart.classList.add('fas');
  } else {
    $heart.classList.remove('fas');
    $heart.classList.add('far');
  }

});
