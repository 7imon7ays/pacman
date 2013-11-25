function Pacman (id) {
  this.id = id;
  this.size = 10;
}

Pacman.prototype.render = function (canvas) {
  canvas.fillStyle   = "FF0000";
  canvas.strokeStyle = "FF0000";

  canvas.beginPath();
  canvas.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
  canvas.closePath();
  canvas.fill();
  canvas.stroke();
}
