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
  if (this.isLeftBlocked(line)) {
    this.xDelta = 0;
  }
  if (this.isTopBlocked(line)) {
    this.yDelta = 0;
  }
  if (this.isBottomBlocked(line)) {
    this.yDelta = 0;
  }
}

Pacman.prototype.isRightBlocked = function (line) {
  return this._isLeftOf(line)
    && this._verticallyCollides(line);
}

Pacman.prototype.isLeftBlocked = function (line) {
  return this._isRightOf(line)
    && this._verticallyCollides(line);
}

Pacman.prototype._isRightOf = function (line) {
  return this.x > line.x;
}

Pacman.prototype._isLeftOf = function (line) {
  return this.x < line.x;
}

Pacman.prototype._verticallyCollides = function (line) {
  return this.y >= line.y
    && this.y <= (line.y + line.height)
    && Math.abs(line.x - this.x) < this.size;
}

Pacman.prototype.isTopBlocked = function (line) {
  return this._isBelow(line)
    && this._horizontallyCollides(line);
}

Pacman.prototype.isBottomBlocked = function (line) {
  return this._isAbove(line)
    && this._horizontallyCollides(line);
}

Pacman.prototype._isAbove = function (line) {
  return this.y < line.y;
}

Pacman.prototype._isBelow = function (line) {
  return this.y > line.y;
}

Pacman.prototype._horizontallyCollides = function (line) {
  return this.x >= line.x
    && this.x <= (line.x + line.width)
    && Math.abs(line.y - this.y) < this.size;
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