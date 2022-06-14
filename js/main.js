var $ingredientsList = document.querySelector('.ingredients-list');
var $rotdTitle = document.querySelector('.rotd-title');
var $rotdLink = document.querySelector('#rotd-link');
var $rotdImg = document.querySelector('#rotd-img');
var $cal = document.querySelector('.cal');
var $fat = document.querySelector('.fat');
var $carbs = document.querySelector('.carbs');
var $protein = document.querySelector('.protein');
var $chol = document.querySelector('.chol');

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
  var rotd = getRandomRecipe(randomCategory);

  for (var i = 0; i < rotd.recipe.ingredientLines.length; i++) {
    var $li = document.createElement('li');
    $li.textContent = rotd.recipe.ingredientLines[i];
    $ingredientsList.appendChild($li);
  }

  var cal = document.createTextNode(rotd.recipe.calories);
  var fat = document.createTextNode(rotd.recipe.digest[0].total + 'g');
  var carbs = document.createTextNode(rotd.recipe.digest[1].total + 'g');
  var protein = document.createTextNode(rotd.recipe.digest[2].total + 'g');
  var chol = document.createTextNode(rotd.recipe.digest[3].total + 'g');

  $cal.appendChild(cal);
  $fat.appendChild(fat);
  $carbs.appendChild(carbs);
  $protein.appendChild(protein);
  $chol.appendChild(chol);

  $rotdTitle.textContent = rotd.recipe.label;

  $rotdLink.textContent = rotd.recipe.url;

  $rotdImg.src = rotd.recipe.image;
});
xhrChicken.send();

// function rotd() {
//   function getRandomCategory(category) {
//     return category[Math.floor(Math.random() * category.length)];
//   }
//   getRandomCategory(xhrAll);
//   console.log(randomCategory);
//   var rotd = getRandomRecipe(xhrPasta.response.hits);

//   for (var i = 0; i < rotd.recipe.ingredientLines.length; i++) {
//     var $li = document.createElement('li');
//     $li.textContent = rotd.recipe.ingredientLines[i];
//     $ingredientsList.appendChild($li);
//   }

//   var cal = document.createTextNode(rotd.recipe.calories);
//   var fat = document.createTextNode(rotd.recipe.digest[0].total + 'g');
//   var carbs = document.createTextNode(rotd.recipe.digest[1].total + 'g');
//   var protein = document.createTextNode(rotd.recipe.digest[2].total + 'g');
//   var chol = document.createTextNode(rotd.recipe.digest[3].total + 'g');

//   $cal.appendChild(cal);
//   $fat.appendChild(fat);
//   $carbs.appendChild(carbs);
//   $protein.appendChild(protein);
//   $chol.appendChild(chol);

//   $rotdTitle.textContent = rotd.recipe.label;

//   $rotdLink.textContent = rotd.recipe.url;

//   $rotdImg.src = rotd.recipe.image;
// }

// rotd();
