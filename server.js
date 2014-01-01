var _ = require("underscore")
  , http = require("http")
  , io = require("socket.io")
  , fs = require("fs")
  , Game = require("./game_logic/game-server");

function Server () {
  this.port = process.env.PORT || 3000;
}

Server.prototype.run = function () {
  var self = this;
  this.app = http.createServer(this.handler.bind(this));
  this.io = io.listen(this.app);
  this.app.listen(this.port);
  this.io.on("connection", function(socket) {
    self.listenForGameLoad(socket);
  });
}

Server.prototype.listenForGameLoad = function (socket) {
  var self = this;
  socket.on("gameLoaded", function () {
    if (self.game) {
      self.game.addPlayer(socket);
    } else {
      var canvasDimensions = { height: 300, width: 500 };
      var pacmanSpeed = 2;
      self.game = new Game(pacmanSpeed, canvasDimensions);
      self.game.start(socket);
    }
  });
}

Server.prototype.render = function (filename, res) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading " + filename);
    }

    res.writeHead(200);
    res.end(data);
  });
}

Server.prototype.declarePort = function (res) {
  res.writeHead(200);
  res.end(this.port.toString());
}

Server.prototype.handler = function (req, res) {
  switch (req.url) {
    case "/":
      this.render("public/chat-room.html", res);
      break;
    case "/game-client.js":
      this.render("public/game-client.js", res);
      break;
    case "/game-port":
      this.declarePort(res);
      break;
    case "/game-room.html":
      console.log("\n\n\n\n\n\n")
      console.log(req)
      console.log("\n\n\n\n\n\n")
      this.render("public/game-room.html", res);
      break;
    case "/grid-client.js":
      this.render("public/grid-client.js", res);
      break;
    case "/pacman-client.js":
      this.render("public/pacman-client.js", res);
      break;
    case "/pacman-style.css":
        this.render("public/pacman-style.css", res);
      break;
    default:
      res.writeHead(404);
      res.end("Not found");
      break;
  }
}

new Server().run();