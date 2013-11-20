Pacman = function (x, y) {
  this.x = x;
  this.y = y;
  this.xDelta = 5;
  this.yDelta = 0;
};


Pacman.prototype.step = function () {
  this.x += this.xDelta;
  this.y += this.yDelta;
};

Pacman.prototype.turn = function (keyCode, successCallBack) {
  switch (keyCode) {  
  case 38:
    this.yDelta = 5;
    this.xDelta = 0;
    break;
  case 40:
    this.yDelta = -5;
    this.xDelta = 0;
    break;
  case 37:
    this.yDelta = 0;
    this.xDelta = -5;
    break;
  case 39:
    this.yDelta = 0;
    this.xDelta = 5;
    break;
  }
  successCallBack();
}

module.exports = Pacman;