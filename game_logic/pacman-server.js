var _ = require("underscore");

function Pacman (id, speed, plane, grid) {
  this.size = 10;
  this.buffer = 10 + 7;
  this.id = id;
  this.speed = speed;
  this.plane = plane;
  this.grid = grid;
  this.x = 20;
  this.y = 20;
  this.xDelta = this.speed;
  this.yDelta = 0;
};


Pacman.prototype.step = function () {
  var self = this;
  this.x += this.xDelta;
  this.y += this.yDelta;
  var blockedDirection = this.checkForBlocks();
  this.stopIfBlocked(blockedDirection); 
  this.wrapAround();
};

Pacman.prototype.checkForBlocks = function () {
  var blockedDirection;
  var self = this;
  _(this.grid).each(function (line) {
    if (self.isRightBlocked(line)) blockedDirection = "right";
    if (self.isLeftBlocked(line)) blockedDirection = "left";
    if (self.isTopBlocked(line)) blockedDirection = "top";
    if (self.isBottomBlocked(line)) blockedDirection = "bottom";
  });
  return blockedDirection;
}

Pacman.prototype.stopIfBlocked = function (blockedDirection) {
  switch (blockedDirection) {
  case "right":
    this.xDelta = 0;
    break;
  case "left":
    this.xDelta = 0;
    break;
  case "top":
    this.yDelta = 0;
    break;
  case "bottom":
    this.yDelta = 0;
    break;
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
    && Math.abs(line.x - this.x) < this.buffer;
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
    && Math.abs(line.y - this.y) < this.buffer;
}

Pacman.prototype.wrapAround = function () {
  var buffer = 0;
  if (this.x + buffer > this.plane.width) this.x = 0;
  if (this.x - buffer < 0) this.x = this.plane.width;
  if (this.y + buffer > this.plane.height) this.y = 0;
  if (this.y - buffer < 0) this.y = this.plane.height;
}

Pacman.prototype.turn = function (keyCode) {
  if (this._blockedInThatDirection(keyCode)) return;
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

Pacman.prototype._blockedInThatDirection = function (keyCode) {
  switch (keyCode) {
  case 38:
    if (this.checkForBlocks() === "top") return true;
    break;
  case 40:
    if (this.checkForBlocks() === "bottom") return true;
    break;
  case 37:
    if (this.checkForBlocks() === "left") return true;
    break;
  case 39:
    if (this.checkForBlocks() === "right") return true;
    break;
  }
}

module.exports = Pacman;
