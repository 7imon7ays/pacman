function Game (canvasCtx, socket) {
  this.canvasCtx = canvasCtx;
  this.socket = socket;
  this.pacmen = {};
  this.ghosts = {};
  this.sessionid = null;
  this.grid = null;
}

Game.prototype.start = function () {
  this.listenForGameParams();
  this.listenForServer();
  this.listenForPlayer();
  var colorJSON = $("#color-selection").html();
  var colorSelection = JSON.parse(colorJSON);
  this.socket.emit("gameLoaded", colorSelection);
  return this;
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
    self.addGhost(id);
  });
}

Game.prototype.setSessionId = function (sessionid) {
  this.sessionid || (this.sessionid = sessionid);
}

Game.prototype.setCanvasDimensions = function (canvasSize) {
  this.canvasCtx.canvas.height = canvasSize.height;
  this.canvasCtx.canvas.width = canvasSize.width;
  this.canvasHeight = canvasSize.height;
  this.canvasWidth = canvasSize.width;
}

Game.prototype.addPlayer = function (id) {
  this.pacmen[id] = new Pacman(id);
}

Game.prototype.addGhost = function (id) {
  this.ghosts[id] = new Ghost(id);
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
  this.socket.on("update", function (gameState) {
    self.updateAndRender(gameState);
  });
}

Game.prototype.listenForExit = function () {
  var self = this;
  this.socket.on("playerDisconnected", function (playerId) {
    delete self.pacmen[playerId];
    delete self.ghosts[playerId];
  })
}

Game.prototype.updateAndRender = function (gameState) {
  this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.grid.render(this.canvasCtx);
  this.renderGame(gameState);
}

Game.prototype.renderGame = function (gameState) {
  this._renderPacmen(gameState.pacmen);
  this._renderGhosts(gameState.ghosts);
}

Game.prototype._renderPacmen = function (pacmenStates) {
  var self = this;
  _(pacmenStates).each(function (state) {
    self.pacmen[state.id] = _.defaults(state, self.pacmen[state.id]);
    self.pacmen[state.id].render(self.canvasCtx);
  });
}

Game.prototype._renderGhosts = function (ghostStates) {
  var self = this;
  _(ghostStates).each(function (state) {
    self.ghosts[state.id] = _.defaults(state, self.ghosts[state.id]);
    self.ghosts[state.id].render(self.canvasCtx);
  });
}

var canvasCtx = document.getElementById("canvas").getContext("2d");
var port;
$.get("game-port", function (data) {
  port = data;
});

var socket = io.connect(port);
var game = new Game(canvasCtx, socket);
