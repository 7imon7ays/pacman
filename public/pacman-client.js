function Pacman (id) {
  this.id = id;
}

Pacman.prototype.render = function (canvas) {
  canvas.fillStyle = "FF0000";
  canvas.strokeStyle = "FF0000";
  canvas.beginPath();
  canvas.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
  canvas.closePath();
  canvas.fill();
  canvas.stroke();

  canvas.fillStyle = "fff";
  canvas.strokeStyle = "fff";
  canvas.beginPath();
  canvas.moveTo(this.x, this.y);

  canvas.lineTo(this.x + 6 * this.xDelta, this.y - this.size - 2);
  canvas.lineTo(this.x + 6 * this.xDelta, this.y + this.size - 2);

  canvas.lineTo(this.x, this.y);
  canvas.closePath();
  canvas.fill();
}
