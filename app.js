var _ = require("underscore");
var app = require("http").createServer(handler);
var io = require("socket.io").listen(app);
var fs = require("fs");
var Game = require("./pacman/pacman-server");
var game;
var playerCount = 0;

app.listen(3000);
io.sockets.on("connection", function(socket) {
  listenForGameLoad(socket);
});

function handler (req, res) {
  switch (req.url) {
    case "/":
      render("public/chat-room.html", res);
      break;
    case "/game-room.html":
      render("public/game-room.html", res);
      break;
    case "/pacman-client.js":
      render("public/pacman-client.js", res);
      break;
    case "/player-client.js":
      render("public/player-client.js", res);
      break;
    default:
      res.writeHead(404);
      res.end("Not found");
      break;
  }
}

function listenForGameLoad(socket) {
  socket.on("gameLoaded", function () {
    if (game) {
      game.addPlayer(socket);
    } else {
      var canvasDimensions = { height: 300, width: 500 };
      var pacmanSpeed = 2;
      game = new Game(pacmanSpeed, canvasDimensions);
      game.start(socket);
    }
  });
}

function render(filename, res) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading " + filename);
    }

    res.writeHead(200);
    res.end(data);
  });
}
