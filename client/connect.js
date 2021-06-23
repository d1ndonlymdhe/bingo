const socket = io();
var roomCode;
var allPlayers = [];
var uid = 0;
var isHost = false;
var gameStarted = false;
var isDone = false;
var turn = 0;
var prev = 0;
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
    document.getElementById("first").classList.add("hidden");
    document.getElementById("second").classList.remove("hidden");
    let container = document.getElementById("codeContainer");
    roomCode = code;
    container.innerHTML = `<p>${code}</p>`;
});

document.getElementById("done").addEventListener("click", () => {
if(!belongsTo(0,input)){
    isDone = true;
    socket.emit("done", input, roomCode, uid , "ready");
}
});
socket.on("updatePlayers", (players) => {
    console.log(players);
    allPlayers = players;
    let allReady = true;
    let color;
    document.getElementById("connectedPlayers").innerHTML = "";
    document.querySelectorAll("#waiting p")[0].classList.add("hidden")
    players.forEach((p) => {
        let div = document.createElement("div");
        div.classList.add("playerName")
        let text = document.createTextNode(`${p[0]}`);
        let para = document.createElement("p");
        para.appendChild(text);
        console.log(color)
        if(p[1]=="ready"){
          color="green"
        }else{
            color="red";
        }
        div.appendChild(para)
        div.style.color=color
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
    uid = id;
    turn = t
    document.getElementById("second").classList.toggle("hidden");
    document.getElementById("first").classList.toggle("hidden");
    document.getElementById("codeContainer").innerHTML = `<p>${code}</p>`;
});

socket.on("started", (m) => {
    document.getElementsByClassName("playerName")[0].children[0].classList.add("turn");
    prev = 0;
    gameStarted = true;
    let buttons=document.querySelectorAll("#buttons button")
    buttons.forEach(el=>{
        if(!belongsTo("hidden",el.classList))
        el.classList.add("hidden")
    })
})

socket.on("turnUpdate",(turn)=>{
    let playerNames= document.getElementsByClassName("playerName")
    console.table(prev,turn,playerNames[prev].children[0],playerNames[turn-1].children[0],playerNames)
    playerNames[prev].children[0].classList.remove("turn")
    playerNames[turn-1].children[0].classList.add("turn")   
    prev = turn-1
})


document.getElementById("startButton").addEventListener('click', () => {
if(document.querySelectorAll(".playerName").length >1){
    socket.emit("start", roomCode)
}
})

document.getElementById("reset").addEventListener('click',()=>{
if(!gameStarted){
    input = [];
    for(let i=0;i<25;i++){
        input.push[i]
    }
    isDone = false;
    clickers.forEach((el)=>{
        el.innerHTML=""
        replaceFrom = ""
        current = 1
    })
    socket.emit("done",input, roomCode ,uid ,"not ready")
}
})

