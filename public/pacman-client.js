function Pacman () {
  this.size = 10;
}

Pacman.prototype.render = function (canvas) {
  var self = this;
  
  canvas.fillStyle   = "FF0000";
  canvas.strokeStyle = "FF0000";

  canvas.beginPath();
  canvas.arc(self.x, self.y, self.size, 0, Math.PI*2, true);
  canvas.closePath();
  canvas.fill();
  canvas.stroke();
}

function Game (canvas, socket) {
  this.canvas = canvas;
  this.socket = socket;
}

Game.prototype.listenForCanvasDimensions = function () {
  this.socket.on("setCanvasDimensions", function (canvasDimensions) {
    $canvas = $("#canvas");
    $canvas.height(canvasDimensions.height);
    $canvas.width(canvasDimensions.width);
  });
}

Game.prototype.listenForInput = function () {
  var self = this;
  $(document).on("keydown", function (event) {
    self.socket.emit("keyPressed", { keyPressed: event.keyCode });
  });  
}

Game.prototype.listenForUpdate = function () {
  var self = this;
  socket.on("update", function (pacmanState) {
    self.canvas.clearRect(0, 0, 500, 500);
    self.pacman = _.defaults(pacmanState, self.pacman);
    self.pacman.render(self.canvas);
  })
}

Game.prototype.start = function () {
  this.pacman = new Pacman();
  this.listenForCanvasDimensions();
  this.listenForInput();
  this.listenForUpdate();
  this.socket.emit("gameLoaded");
}

var canvas = document.getElementById("canvas").getContext("2d");
var socket = io.connect("http://localhost");
var game = new Game(canvas, socket).start();