function Ghost (id) {
  this.id = id;
}

Ghost.prototype.render = function (context) {
  context.fillStyle = this.color;
  context.strokeStyle = this.color;
  context.beginPath();
  context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
  context.stroke();
}
