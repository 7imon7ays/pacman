var canvas = document.getElementById("canvas").getContext("2d");

function Pacman (x, y) {
  this.x = x;
  this.y = y;
};

var count = 0;

requestID = window.requestAnimationFrame(function () {
  if (count > 10) {
    window.cancelAnimationFrame(requestID);
  } else {
    console.log(count);
  }
});
