function Grid(gridpattern) {
  this.lines = [];
  for (line in gridpattern) {
    this.lines.push(gridpattern[line]);
  }
}

Grid.prototype.render = function (canvasCtx) {
  var self = this;
  _(this.lines).each(function (line) {
    self.drawLine(line, canvasCtx);
  })
}

Grid.prototype.drawLine = function (line, canvasCtx) {
  canvasCtx.fillStyle   = "111111";
  canvasCtx.fillRect(line.x, line.y, line.width, line.height);
}
