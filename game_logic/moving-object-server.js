var _ = require("underscore");

function MovingObject () {
  this.x = 50;
  this.y = 50;
  this.xDelta = 0;
  this.yDelta = 0;
}

MovingObject.prototype.step = function () {
  this.x += this.xDelta;
  this.y += this.yDelta;
  var blockedDirection = this.checkForBlocks();
  this.stopIfBlocked(blockedDirection); 
  this.wrapAround();
};

MovingObject.prototype.checkForBlocks = function () {
  var blockedDirection;
  var self = this;
  _(this.grid).each(function (line) {
    if (self.isRightBlocked(line)) blockedDirection = "right";
    if (self.isLeftBlocked(line)) blockedDirection = "left";
    if (self.isTopBlocked(line)) blockedDirection = "top";
    if (self.isBottomBlocked(line)) blockedDirection = "bottom";
  });
  return blockedDirection;
};

MovingObject.prototype.stopIfBlocked = function (blockedDirection) {
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
};

MovingObject.prototype.isRightBlocked = function (line) {
  return this._isLeftOf(line)
    && this._verticallyCollides(line);
};

MovingObject.prototype.isLeftBlocked = function (line) {
  return this._isRightOf(line)
    && this._verticallyCollides(line);
};

MovingObject.prototype._isRightOf = function (line) {
  return this.x > line.x;
};

MovingObject.prototype._isLeftOf = function (line) {
  return this.x < line.x;
};

MovingObject.prototype._verticallyCollides = function (line) {
  return this.y >= line.y
    && this.y <= (line.y + line.height)
    && Math.abs(line.x - this.x) < this.buffer;
};

MovingObject.prototype.isTopBlocked = function (line) {
  return this._isBelow(line)
    && this._horizontallyCollides(line);
};

MovingObject.prototype.isBottomBlocked = function (line) {
  return this._isAbove(line)
    && this._horizontallyCollides(line);
};

MovingObject.prototype._isAbove = function (line) {
  return this.y < line.y;
};

MovingObject.prototype._isBelow = function (line) {
  return this.y > line.y;
};

MovingObject.prototype._horizontallyCollides = function (line) {
  return this.x >= line.x
    && this.x <= (line.x + line.width)
    && Math.abs(line.y - this.y) < this.buffer;
};

MovingObject.prototype.wrapAround = function () {
  if (this.x > this.plane.width) this.x = 0;
  if (this.x < 0) this.x = this.plane.width;
  if (this.y > this.plane.height) this.y = 0;
  if (this.y < 0) this.y = this.plane.height;
};

MovingObject.bequeath = function (ChildClass) {
  function Surrogate () {}
  Surrogate.prototype = this.prototype;
  ChildClass.prototype = new Surrogate();
};

module.exports = MovingObject;
