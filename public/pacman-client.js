function Pacman (id) {
  this.id = id;
}

Pacman.prototype.render = function (context) {
  context.fillStyle = "FF0000";
  context.strokeStyle = "FF0000";
  context.beginPath();
  context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
  context.stroke();

  context.moveTo(this.x, this.y);
  context.fillStyle = "fff";
  context.strokeStyle = "fff";
  context.beginPath();

  var upperLipX = this.x + 6 * this.xDelta;
  var upperLipY = this.y - this.x % 8;
  var lowerLipX = this.x + 6 * this.xDelta;
  var lowerLipY = this.y + this.x % 8;

  context.lineTo(upperLipX, upperLipY);
  context.lineTo(lowerLipX, lowerLipY);

  context.lineTo(this.x, this.y);
  context.closePath();
  context.fill();
}
