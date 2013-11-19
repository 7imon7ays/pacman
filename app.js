var app = require("http").createServer(handler);
var io = require("socket.io").listen(app);
var fs = require("fs");
var Game = require("./pacman/game");

app.listen(3000);

function handler (req, res) {
  switch (req.url) {
    case "/pacman":
      render("public/pacman.html", res);
      break;
    case "/":
      render("public/chat.html", res);
      break;
    default:
      res.writeHead(404);
      res.end("Not found");
      break;
  }
}

function render(filename, res) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }

    res.writeHead(200);
    res.end(data);
  });
}


io.sockets.on("connection", function(socket) {
  Game.start(socket);
});
