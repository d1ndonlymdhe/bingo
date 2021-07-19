const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const classes = require("./class.js");
const room = classes.room;
const player = classes.player;
const events = require("events");
const em = new events.EventEmitter();
app.use("/public", express.static(path.join(__dirname, "client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "bingo.html"));
});
app.get("/arc-sw.js", (req, res) => {
  res.type(".js");
  res.send(
    `!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=95)}({3:function(t,e,r){"use strict";r.d(e,"a",(function(){return n})),r.d(e,"f",(function(){return c})),r.d(e,"j",(function(){return i})),r.d(e,"i",(function(){return a})),r.d(e,"b",(function(){return d})),r.d(e,"k",(function(){return f})),r.d(e,"c",(function(){return u})),r.d(e,"d",(function(){return s})),r.d(e,"e",(function(){return l})),r.d(e,"h",(function(){return m})),r.d(e,"g",(function(){return v}));var n={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg","avif","jxl"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv","av1"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],interchange:["json","yaml","xml","csv","toml","ini","bson","asn1","ubj"],archives:["jar","iso","tar","tgz","tbz2","tlz","gz","bz2","xz","lz","z","7z","apk","dmg","rar","lzma","txz","zip","zipx"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["srt","swf"]},o="arc:",c={COMLINK_INIT:"".concat(o,"comlink:init"),NODE_ID:"".concat(o,":nodeId"),CLIENT_TEARDOWN:"".concat(o,"client:teardown"),CDN_CONFIG:"".concat(o,"cdn:config"),P2P_CLIENT_READY:"".concat(o,"cdn:ready"),STORED_FIDS:"".concat(o,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(o,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(o,"widget:config"),WIDGET_INIT:"".concat(o,"widget:init"),WIDGET_UI_LOAD:"".concat(o,"widget:load"),BROKER_LOAD:"".concat(o,"broker:load"),RENDER_FILE:"".concat(o,"inlay:renderFile"),FILE_RENDERED:"".concat(o,"inlay:fileRendered")},i="serviceWorker",a="/".concat("shared-worker",".js"),d="/".concat("dedicated-worker",".js"),f="/".concat("arc-sw-core",".js"),p="".concat("arc-sw",".js"),u=("/".concat(p),"/".concat("arc-sw"),"arc-db"),s="key-val-store",l=2**17,m="".concat("https://overmind.arc.io","/api/propertySession"),v="".concat("https://warden.arc.io","/mailbox/propertySession");"".concat("https://warden.arc.io","/mailbox/transfers")},95:function(t,e,r){"use strict";r.r(e);var n=r(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+n.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+n.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+n.b;importScripts(i)}}});`
  );
});
var players = [];
var rooms = [];

em.on("disconnected", (room) => {
  console.log();
});

// em.on("disconnected",id=>{
//     console.log(id)
//     let arr = []
//     let roomIndex;
//     console.log(rooms)
//     arr = rooms.forEach((room,index)=>{
//         players = room.players;
//         let arr2 = players.map(p=>{
//             return p.socket.id;
//         })
//         arr.concat(arr2)
//     })
//     if(belongsTo(id))
// })

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("disconnect", () => {
    console.log("disconnected");
    let roomFound = false;
    let index;
    let selectedRoom;
    for (let i = 0; i < players.length; i++) {
      if (players[i].socket.id == socket.id) {
        selectedRoom = findRoom(players[i].code);
        selectedRoom.players = removeFromArr(players[i], selectedRoom.players);
        index = i;
        if (selectedRoom.players.length == 0) {
          rooms = removeFromArr(selectedRoom, rooms);
        }
        roomFound = true;
        break;
      } else {
      }
    }
    if (roomFound) {
      let allPlayers = [];
      selectedRoom.players.forEach((p) => {
        allPlayers.push([p.name, p.status]);
      });
      if (index + 1 == selectedRoom.players.length) {
        selectedRoom.turn == 1;
      } else {
        selectedRoom.turn == index + 2;
      }

      selectedRoom.emitAll("disconnectUpdate", [allPlayers, selectedRoom.turn]);
      if (selectedRoom.gameStarted) {
        selectedRoom.emitAll("turnUpdate", selectedRoom.turn);
      }
      console.log(selectedRoom.turn, selectedRoom.players);
    }
  });

  socket.on("log", (message) => {
    console.log(message);
  });

  socket.on("done", (input, code, uid, status) => {
    let selectedRoom = findRoom(code);
    selectedRoom.updatePlayerStatus(uid, status, input);
    let allPlayers = [];
    selectedRoom.players.forEach((p) => {
      allPlayers.push([p.name, p.status]);
    });
    selectedRoom.emitAll("updatePlayers", allPlayers);
  });

  socket.on("create", (playerName) => {
    // let currentPlayer = new player(playerName, socket);
    let rand = 0;
    uid = Math.floor(Math.random() * 1000000);
    uid = uid.toString();
    while (uid.length < 4) {
      uid += "0";
    }
    // currentPlayer.uid = rand;
    //rand = 0;
    let code = Math.floor(Math.random() * 10000);
    code = code.toString();
    while (code.length < 4) {
      code += "0";
    }
    let currentPlayer = new player(playerName, socket, uid, code);
    tempRoom = new room(code);
    tempRoom.players.push(currentPlayer);
    players.push(currentPlayer);
    rooms.push(tempRoom);
    socket.emit("roomCode", code, currentPlayer.uid);
    tempRoom.players.forEach((p) => {});
  });

  socket.on("join", (playerName, code) => {
    let arr = rooms.map((e) => {
      return e.code;
    });
    if (belongsTo(code, arr)) {
      let selectedRoom = findRoom(code);
      //console.log(selectedRoom,rooms)
      if (!selectedRoom.gameStarted) {
        //let currentPlayer = new player(playerName, socket);
        let uid = 0;
        uid = Math.floor(Math.random() * 1000000);
        uid = uid.toString();
        while (uid.length < 6) {
          uid += "0";
        }
        let currentPlayer = new player(playerName, socket, uid, code);
        players.push(currentPlayer);
        selectedRoom.players.push(currentPlayer);
        socket.emit(
          "joined",
          selectedRoom.code,
          currentPlayer.uid,
          selectedRoom.players.length
        );
        let allPlayers = [];
        selectedRoom.players.forEach((p) => {
          allPlayers.push([p.name, p.status]);
        });
        console.log(selectedRoom.turn, allPlayers);
        selectedRoom.emitAll("updatePlayers", allPlayers);
      }
    }
  });

  socket.on("start", (code) => {
    let selectedRoom = findRoom(code);
    selectedRoom.gameStarted = true;
    selectedRoom.emitAll("started", true);
  });

  socket.on("checkTurn", (turn, code, val) => {
    let selectedRoom = findRoom(code);
    console.log(selectedRoom.turn);
    if (selectedRoom.turn == turn && !belongsTo(val, selectedRoom.occupied)) {
      selectedRoom.occupied.push(val);
      selectedRoom.emitAll("checked", [val, true]);
      selectedRoom.emitAll("checkBack", [val]);
      if (selectedRoom.turn != selectedRoom.players.length) {
        selectedRoom.turn += 1;
        console.log(selectedRoom.turn);
      } else {
        selectedRoom.turn = 1;
      }
      selectedRoom.emitAll("turnUpdate", selectedRoom.turn);
    } else {
      socket.emit("checked", false, selectedRoom.turn);
    }
  });

  socket.on("bingo", (turn, code) => {
    let selectedRoom = findRoom(code);
    if (!selectedRoom.finished) {
      selectedRoom.emitAll("over", selectedRoom.players[turn - 1].name);
      selectedRoom.finished = true;
    }
  });
});

function findRoom(code) {
  let temp;
  for (let i = 0; i < rooms.length; i++) {
    temp = rooms[i];
    if (temp.code == code) {
      return rooms[i];
    }
  }
  return false;
}

function belongsTo(e, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == e) {
      return true;
    }
  }
  return false;
}

function removeFromArr(e, arr) {
  let index = arr.indexOf(e);
  for (let i = index; i < arr.length; i++) {
    arr[i] = arr[i + 1];
  }
  arrr = arr.pop();
  return arr;
}

server.listen(process.env.PORT || 3000, console.log("listening"));
