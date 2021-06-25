const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {
    Server
} = require("socket.io");
const io = new Server(server);
const path = require("path");
const classes = require("./class.js");
const room = classes.room;
const player = classes.player;
const events = require("events")
const em = new events.EventEmitter()
app.use("/public", express.static(path.join(__dirname, "client")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "bingo.html"));
});

var players = [];
var rooms = [];

em.on("disconnected",(room)=>{
    console.log()
})

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
    
    socket.on("disconnect",()=> {
        console.log("disconnected");
        let roomFound = false;
        let selectedRoom
        for(let i=0;i<players.length;i++){
            if(players[i].socket.id==socket.id){
               selectedRoom=findRoom(players[i].code);
               selectedRoom.players = removeFromArr(players[i],selectedRoom.players)
               if(selectedRoom.players.length == 0){
                   rooms = removeFromArr(selectedRoom,rooms);
               }
               roomFound = true;
               break; 
            }else{
                
            }
        }
        if(roomFound){
            let allPlayers = [];
            selectedRoom.players.forEach((p) => {
                allPlayers.push([p.name, p.status]);
            });
            //console.log(selectedRoom.turn,allPlayers)
            selectedRoom.emitAll("updatePlayers", allPlayers);   
        }
    })



    socket.on("done", (input, code, uid , status) => {
        let selectedRoom = findRoom(code);
        selectedRoom.updatePlayerStatus(uid, status, input)
        let allPlayers = [];
        selectedRoom.players.forEach((p) => {
            allPlayers.push([p.name, p.status]);
        });
        selectedRoom.emitAll("updatePlayers", allPlayers)
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
        let currentPlayer = new player(playerName,socket,uid,code)
        tempRoom = new room(code);
        tempRoom.players.push(currentPlayer)
        players.push(currentPlayer)
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
            if(!selectedRoom.gameStarted){
            //let currentPlayer = new player(playerName, socket);
            let uid = 0;
            uid = Math.floor(Math.random() * 1000000);
            uid = uid.toString();
            while (uid.length < 6) {
                uid += "0";
            }
            let currentPlayer = new player(playerName,socket,uid,code)
            players.push(currentPlayer);
            selectedRoom.players.push(currentPlayer);
            socket.emit("joined", selectedRoom.code, currentPlayer.uid, (selectedRoom.players.length));
            let allPlayers = [];
            selectedRoom.players.forEach((p) => {
                allPlayers.push([p.name, p.status]);
            });
            console.log(selectedRoom.turn,allPlayers)
            selectedRoom.emitAll("updatePlayers", allPlayers);

        }
    }
    });

    socket.on("start", code => {
        let selectedRoom = findRoom(code);
        selectedRoom.gameStarted = true;
        selectedRoom.emitAll("started", true)
    })

    socket.on("checkTurn", (turn, code, val) => {
        let selectedRoom = findRoom(code);
        console.log(selectedRoom.turn)
        if (selectedRoom.turn == turn && !belongsTo(val,selectedRoom.occupied)) {
            selectedRoom.occupied.push(val)
            selectedRoom.emitAll("checked", [val, true])
            selectedRoom.emitAll("checkBack", [val])
            if (selectedRoom.turn != (selectedRoom.players.length)) {
                selectedRoom.turn += 1;
                console.log(selectedRoom.turn)
            } else {
                selectedRoom.turn = 1;
            }
            selectedRoom.emitAll("turnUpdate",selectedRoom.turn)
        } else {
            socket.emit("checked", false, selectedRoom.turn)
        }
    })

    socket.on("bingo", (turn, code) => {
        let selectedRoom = findRoom(code);
        if(!selectedRoom.finished){
        selectedRoom.emitAll("over", selectedRoom.players[turn - 1].name)
        selectedRoom.finished = true;
        }
    })

});



function findRoom(code) {
    let temp;
    for (let i = 0; i < rooms.length; i++) {
        temp = rooms[i];
        if (temp.code == code) {
            return rooms[i]
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

function removeFromArr(e,arr){
    let index = arr.indexOf(e);
    for(let i = index;i<arr.length;i++){
        arr[i]=arr[i+1]
    }
    arrr = arr.pop()
    return arr;
}


server.listen(process.env.PORT || 3000, console.log("listening"));