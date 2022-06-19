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
// var $favorites = document.getElementById('favorites');
// var $yourRecipes = document.getElementById('your-recipes');
// var $writeRecipe = document.getElementById('write-recipe');
// var $homeHeartBtn = document.querySelector('.home-heart-btn');
// var $heart = document.querySelectorAll('.fa-heart');

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

  $recipeTitle.textContent = rotd[0].recipe.label;

  $recipeLink.textContent = rotd[0].recipe.url;
  $recipeLink.setAttribute('href', rotd[0].recipe.url);

  $recipeImg.src = rotd[0].recipe.image;
}

// navbar mobile/desktop view-switch
// window.addEventListener('resize', () => {
//   if (window.innerWidth < 768) {
//     $favorites.style.display = 'none';
//     $yourRecipes.style.display = 'none';
//     $writeRecipe.style.display = 'none';
//   } else {
//     $favorites.style.display = 'inline';
//     $yourRecipes.style.display = 'inline';
//     $writeRecipe.style.display = 'inline';
//   }
// });

// heart btn
// $homeHeartBtn.addEventListener('click', () => {
//   if ($heart.contains('far')) {
//     $heart.classList.remove('far');
//     $heart.classList.add('fas');
//   } else {
//     $heart.classList.remove('fas');
//     $heart.classList.add('far');
//   }
// });

// if ($heart[i].classList.contains('far')) {
//   $heart[i].classList.remove('far');
//   $heart[i].classList.add('fas');
// } else {
//   $heart[i].classList.remove('fas');
//   $heart[i].classList.add('far');
// }
