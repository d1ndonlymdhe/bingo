//const e = require("express");

//const { room } = require("../class");
const socket = io();
var roomCode;
var allPlayers = [];
var uid = 0;
var isHost = false;
var gameStarted = false;
var isDone = false;
var turn = 0;
document.getElementById("create").addEventListener("click", () => {
    let playerName = document.querySelectorAll("input")[0];
    isHost = true;
    playerName = playerName.value;
    if (playerName != "" && playerName != undefined) {
        socket.emit("create", playerName);
        turn = 1;
    }
});

socket.on("roomCode", (code, id) => {
    uid = id;
    //console.log(code,typeof code)
    document.getElementById("first").classList.add("hidden");
    document.getElementById("second").classList.remove("hidden");
    let container = document.getElementById("codeContainer");
    //console.log(container)
    roomCode = code;
    container.innerHTML = `<p>${code}</p>`;
});

document.getElementById("done").addEventListener("click", () => {
    //console.log(roomCode)
    isDone = true;
    socket.emit("done", input, roomCode, uid);


});
socket.on("updatePlayers", (players) => {
    //console.log(players);
    allPlayers = players;
    let allReady = true;
    let color;
    document.getElementById("connectedPlayers").innerHTML = "";
    document.querySelectorAll("#waiting p")[0].classList.add("hidden")
    players.forEach((p) => {
        console.log(p)
        let div = document.createElement("div");
        div.classList.add("playerName")
        let text = document.createTextNode(`${p[0]}`);
        let para = document.createElement("p");
        para.appendChild(text);
        console.log(color)
        //document.getElementById("connectedPlayers").appendChild(para);
        if(p[1]=="ready"){
          color="green"
            console.log(color)
        }else{
            color="red";
            console.log(color)
        }
        //document.getElementById("connectedPlayers").appendChild(createCircle(color))
        div.appendChild(para)
        div.style.color=color
        //div.appendChild(playerStatus(color))
        document.getElementById("connectedPlayers").appendChild(div)
        document.getElementById("connectedPlayers").style.fontSize="clamp(0px,5vh,100%)"
        document.getElementById("connectedPlayers").classList.remove("hidden");



        if (p[1] == "not ready") {
            allReady = false;
        }

    });
    if (allReady && isHost) {
        document.getElementById("startButton").classList.remove("hidden")
    }
});

document.getElementById("join").addEventListener("click", () => {
    isHost = false;
    let playerName = document.querySelectorAll("input")[0];
    playerName = playerName.value;
    let Code = document.querySelectorAll("input")[1];
    roomCode = Code.value;
    console.log(Code.value)
    if (
        Code != "" &&
        playerName != "" &&
        Code != undefined &&
        playerName != undefined
    ) {
        socket.emit("join", playerName, roomCode);
    }
});

socket.on("joined", (code, id, t) => {
    //console.log("hello")
    uid = id;
    turn = t
    document.getElementById("second").classList.toggle("hidden");
    document.getElementById("first").classList.toggle("hidden");
    document.getElementById("codeContainer").innerHTML = `<p>${code}</p>`;
});

socket.on("started", (m) => {
    console.log("dui choti kina?")

    gameStarted = true;
})

document.getElementById("startButton").addEventListener('click', () => {
    socket.emit("start", roomCode)
})

function createCircle(color){
  let svg = document.createElement("svg")
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg")
//   svg.setAttribute("height","50px");
//   svg.setAttribute("width","50px")
  let circle = document.createElement("circle")
  circle.setAttribute("cx","50%");
  circle.setAttribute("cy","50%");
  circle.setAttribute("r","50%");
  circle.style.fill=color;
  svg.appendChild(circle)
  return svg;
}

function playerStatus(color){
    let status = document.createElement("span");
    text = document.createTextNode("•");
    status.style.fontSize = "5em"
    status.style.color=color;
    status.appendChild(text);
    return status;
}