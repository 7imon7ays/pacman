var _ = require("underscore")
  , http = require("http")
  , io = require("socket.io")
  , fs = require("fs")
  , querystring = require("querystring")
  , PacmanGame = require("./game_logic/game-server");

function Server () {
  this.port = process.env.PORT || 3000;
  this.sessions = {};
}

Server.prototype.run = function () {
  var self = this;
  var boundHandler = this.handler.bind(this);
  this.app = http.createServer(boundHandler);
  this.io = io.listen(this.app);
  this.app.listen(this.port);
  this.io.on("connection", function(socket) {
    self.listenForGameLoad(socket);
  });
}

Server.prototype.listenForGameLoad = function (socket) {
  var self = this;
  socket.on("gameLoaded", function (gameOptions) {
    if (self.game) {
      self.game.addPlayer(socket, gameOptions);
    } else {
      self.game = new PacmanGame();
      self.game.start(socket, gameOptions);
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

Server.prototype.loadGame = function (res, reqBody) {
  var self = this;
  fs.readFile("public/game-room.html", function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading " + filename);
    }

    res.writeHead(200);
    res.write(data);
    self._setColor(res, reqBody)
    res.end();
  });
}

Server.prototype._setColor = function (res, colorSelection) {
  var colorTag = "<script id='color-selection' type='text/json'>"
                  + JSON.stringify(colorSelection)
                  + "</script>"
  var gameStarter = "<script type='text/javascript'>"
                  + "game.start()"
                  + "</script>"
  res.write(colorTag);
  res.write(gameStarter);
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
      var self = this;
      req.on("data", function (chunk) {
        var requestBody = querystring.parse(chunk.toString());
        self.loadGame(res, requestBody);
      });
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