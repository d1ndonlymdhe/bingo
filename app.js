const express = require("express");
const app = express();
const http = require("http");
//const { connect } = require('http2');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const classes = require("./class.js");
const room = classes.room;
const player = classes.player;

app.use("/public", express.static(path.join(__dirname, "client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "bingo.html"));
});

var players = [];
var rooms = [];
io.on("connection", (socket) => {
  console.log("connected");
  
  
  socket.on("done", (input,code,uid) => {
    let selectedRoom = findRoom(code);
    selectedRoom.updatePlayerStatus(uid,"ready",input)
    //emitPlayerStatus(selectedRoom)
    let allPlayers = [];
  selectedRoom.players.forEach((p) => {
    allPlayers.push([p.name, p.status]);
  });
    emitAll(selectedRoom,"updatePlayers",allPlayers)
  });




  socket.on("create", (playerName) => {
    let currentPlayer = new player(playerName, socket);
    // players.push(currentPlayer);

    let rand = 0;
    rand = Math.floor(Math.random() * 1000000);
    rand = rand.toString();
    while (rand.length < 4) {
      rand += "0";
    }
    currentPlayer.uid = rand;
    rand = 0;
    rand = Math.floor(Math.random() * 10000);
    rand = rand.toString();
    while (rand.length < 4) {
      rand += "0";
    }
    tempRoom = new room(rand);
    tempRoom.players.push(currentPlayer)
    //tempRoom.addPlayers(currentPlayer);
    rooms.push(tempRoom);
    socket.emit("roomCode", rand, currentPlayer.uid);
    tempRoom.players.forEach((p) => {});
  });


  socket.on("join", (playerName, code) => {
    let arr = rooms.map((e) => {
      return e.code;
    });
    if (belongsTo(code, arr)) {
      let currentPlayer = new player(playerName, socket);
      let rand = 0;
      rand = Math.floor(Math.random() * 1000000);
      rand = rand.toString();
      while (rand.length < 4) {
        rand += "0";
      }
      currentPlayer.uid = rand;
      players.push(currentPlayer);
      let selectedRoom = findRoom(code);
      selectedRoom.players.push(currentPlayer);
      socket.emit("joined", selectedRoom.code ,currentPlayer.uid);
      let allPlayers = [];
  selectedRoom.players.forEach((p) => {
    allPlayers.push([p.name, p.status]);
  });
      emitAll(selectedRoom,"updatePlayers",allPlayers);
    
    }
  });

  socket.on("start",code=>{
    let selectedRoom = findRoom(code);
    emitAll(selectedRoom,"started",true)
  })

});



function findRoom(code) {
  let temp;
  for (let i = 0; i < rooms.length; i++) {
    temp = rooms[i];
    if (temp.code == code) {
      temp = i;
      break;
    }
  }
  return rooms[temp];
}

function belongsTo(e, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == e) {
      return true;
    }
  }
  return false;
}

function emitAll(selectedRoom,objective,message) {
  
  selectedRoom.players.forEach((p) => {
    p.socket.emit(objective, message);
  });
}


server.listen(3000, console.log("listening"));
