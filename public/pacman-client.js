function Pacman (id) {
  this.id = id;
}

Pacman.prototype.render = function (context) {
  context.fillStyle = this.color;
  context.strokeStyle = this.color;
  context.beginPath();
  context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
  context.stroke();

  context.moveTo(this.x, this.y);
  context.fillStyle = "fff";
  context.strokeStyle = "fff";
  context.beginPath();

  if (this.xDelta) {
    var upperLipX = this.x + 6 * this.xDelta;
    var upperLipY = this.y - this.x % 8;
    var lowerLipX = this.x + 6 * this.xDelta;
    var lowerLipY = this.y + this.x % 8;

    context.lineTo(upperLipX, upperLipY);
    context.lineTo(lowerLipX, lowerLipY);
  } else {
    var leftLipX = this.x + this.y % 8;
    var leftLipY = this.y + 6 * this.yDelta;
    var rightLipX = this.x - this.y % 8;
    var rightLipY = this.y + 6 * this.yDelta;

    context.lineTo(leftLipX, leftLipY);
    context.lineTo(rightLipX, rightLipY);
  }


  context.lineTo(this.x, this.y);
  context.closePath();
  context.fill();
};

