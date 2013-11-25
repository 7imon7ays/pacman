var _ = require("underscore");

Pacman = function (id, speed, plane, grid) {
  this.size = 10;
  this.id = id;
  this.speed = speed;
  this.plane = plane;
  this.grid = grid;
  // this.x = Math.floor(Math.random() * plane.width);
  // this.y = Math.floor(Math.random() * plane.height);
  this.x = 120;
  this.y = 80;
  this.xDelta = this.speed;
  this.yDelta = 0;
};


Pacman.prototype.step = function () {
  var self = this;
  this.x += this.xDelta;
  this.y += this.yDelta;
  _(this.grid).each(function (line) {
    self.stopIfBlocked(line); 
  });
  this.wrapAround();
};

Pacman.prototype.stopIfBlocked = function (line) {
  if (this.isRightBlocked(line)) {
    this.xDelta = 0;
  } 
}

Pacman.prototype.isRightBlocked = function (line) {
  return this._lineIsToRight(line) && !this._lineIsToLeft(line);
}

Pacman.prototype._lineIsToRight = function (line) {
  return line.x - this.size - 2 < this.x
    && this.y >= line.y
    && this.y <= line.y + line.height;
}

Pacman.prototype._lineIsToLeft = function (line) {
  return line.x < this.x
    && this.y >= line.y
    && this.y <= line.y + line.height;
}

Pacman.prototype.wrapAround = function () {
  if (this.x > this.plane.width) this.x = 0;
  if (this.x < 0) this.x = this.plane.width;
  if (this.y > this.plane.height) this.y = 0;
  if (this.y < 0) this.y = this.plane.height;
}

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