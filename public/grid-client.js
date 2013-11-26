function Grid(gridpattern) {
  this.lines = [];
  for (line in gridpattern) {
    this.lines.push(gridpattern[line]);
  }
}

Grid.prototype.render = function (canvas) {
  var self = this;
  _(this.lines).each(function (line) {
    self.drawLine(line, canvas);
  })
}

Grid.prototype.drawLine = function (line, canvas) {
  canvas.fillStyle   = "111111";
  canvas.fillRect(line.x, line.y, line.width, line.height);
}
