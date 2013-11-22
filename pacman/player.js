Pacman = function (speed, x, y) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.xDelta = 0;
  this.yDelta = -(this.speed);
};


Pacman.prototype.step = function () {
  this.x += this.xDelta;
  this.y += this.yDelta;
};

Pacman.prototype.turn = function (keyCode) {
  switch (keyCode) {  
  case 38:
    this.yDelta = -(this.speed);
    this.xDelta = 0;
    break;
  case 40:
    this.yDelta = this.speed;
    this.xDelta = 0;
    break;
  case 37:
    this.yDelta = 0;
    this.xDelta = -(this.speed);
    break;
  case 39:
    this.yDelta = 0;
    this.xDelta = this.speed;
    break;
  }
}

module.exports = Pacman;