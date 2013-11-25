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

function Game (canvas, socket) {
  this.canvas = canvas;
  this.socket = socket;
  this.pacmen = {};
  this.sessionid = null;
  this.grid = null;
}

Game.prototype.listenForGameParams = function () {
  var self = this;
  this.socket.on("setParams", function (gameParams) {
    self.applyGameParams(gameParams);
  });
}

Game.prototype.applyGameParams = function (gameParams) {
  var self = this;
  this.setSessionId(this.socket.socket.sessionid);
  this.setCanvasDimensions(gameParams.canvasSize);
  this.grid = new Grid(gameParams.grid);
  _(gameParams.pacmenIDs).each(function (id) {
    self.addPlayer(id);
  });
}

Game.prototype.setSessionId = function (sessionid) {
  this.sessionid || (this.sessionid = sessionid);
}

Game.prototype.setCanvasDimensions = function (canvasSize) {
  $canvas = $("#canvas");
  $canvas.height(canvasSize.height);
  $canvas.width(canvasSize.width);
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
  this.listenForUpdate();
  this.listenForExit();
}

Game.prototype.listenForUpdate = function () {
  var self = this;
  this.socket.on("update", function (pacmenStates) {
    self.updateAndRender(pacmenStates);
  });
}

Game.prototype.listenForExit = function () {
  var self = this;
  this.socket.on("playerDisconnected", function (playerId) {
    delete self.pacmen[playerId];
  })
}

Game.prototype.updateAndRender = function (pacmenStates) {
  this.canvas.clearRect(0, 0, 500, 500);
  this.grid.render(this.canvas);
  this.renderPacmen(pacmenStates);
}

Game.prototype.renderPacmen = function (pacmenStates) {
  var self = this;
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