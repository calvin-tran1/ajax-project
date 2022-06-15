/* exported data, rotd */

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
