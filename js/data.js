/* exported data, rotd, ogRecipes */

// local storage - recipe entries
// var ogRecipes = {
//   entries: [],
//   editing: null,
//   nextEntryId: 1
// };

// local storage - favorites
var data = {
  favorites: [],
  favId: 0,
  entries: [],
  nextEntryId: 1
};
var currentData = localStorage.getItem('data');

if (currentData !== null) {
  data = JSON.parse(currentData);
}

window.addEventListener('beforeunload', () => {
  var dataValueJSON = JSON.stringify(data);
  localStorage.setItem('data', dataValueJSON);
});

// local storage - recipe of the day
var rotd = [];
var currentRotd = localStorage.getItem('rotd');

if (currentRotd !== null) {
  rotd = JSON.parse(currentRotd);
}

window.addEventListener('beforeunload', () => {
  var rotdValueJSON = JSON.stringify(rotd);
  localStorage.setItem('rotd', rotdValueJSON);
});

var hours = 24;
var now = new Date().getTime();
var setupTime = localStorage.getItem('setupTime');

if (setupTime === null) {
  localStorage.setItem('setupTime', now);
} else if ((now - setupTime) > hours * 60000 * 60) {
  rotd = [];
  localStorage.removeItem('rotd');
  localStorage.setItem('setupTime', now);
}
