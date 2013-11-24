function Pacman (id) {
  this.id = id;
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
  this.pacmen = {};
}

Game.prototype.listenForGameParams = function () {
  var self = this;
  this.socket.on("setParams", function (gameParams) {
    self.sessionid = this.socket["sessionid"];
    $canvas = $("#canvas");
    $canvas.height(gameParams.canvasSize.height);
    $canvas.width(gameParams.canvasSize.width);
    _(gameParams.pacmenIDs).each(function (id) {
      self.addPlayer(id);
    })
  });
}

Game.prototype.addPlayer = function (id) {
  this.pacmen[id] = new Pacman(id);
}

Game.prototype.listenForPlayer = function () {
  var self = this;
  $(document).on("keydown", function (event) {
    self.socket.emit("keyPressed", { keyPressed: event.keyCode, socketid: self.sessionid });
  });  
}

Game.prototype.listenForServer = function () {
  var self = this;
  socket.on("update", function (pacmenStates) {
    self.updateAndRender(pacmenStates);
  });
}

Game.prototype.updateAndRender = function (pacmenStates) {
  var self = this;
  this.canvas.clearRect(0, 0, 500, 500);
  _(pacmenStates).each(function (player) {
    self.pacmen[player.id] = _.defaults(player, self.pacmen[player.id]);
    self.pacmen[player.id].render(self.canvas);
  });  
}

Game.prototype.start = function () {
  this.listenForGameParams();
  this.listenForServer();
  this.listenForPlayer();
  this.socket.emit("gameLoaded");
  return this;
}

var canvas = document.getElementById("canvas").getContext("2d");
var socket = io.connect("http://localhost");
var game = new Game(canvas, socket).start();