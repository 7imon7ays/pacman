var socket = io.connect("http://localhost");

$(document).on("keydown", function (event) {
  socket.emit("keyPressed", { keyPressed: event.keyCode });
});

socket.on("inputProcessed", function (gameData) {
  var pacman = gameData;
  console.log("Pacman now at " + pacman.x + ":" + pacman.y);
})

socket.emit("gameLoaded");