// const { room } = require("../class");

var current = 1; //stores the value which is to be added to the cell the player clicks
var replaceFrom="";//required to handle swaps(player clicks on a pre-occupoid cell)
var clickers= document.querySelectorAll("#clickers div");//stores the divs which overlay the board and determine which cell was selected
var input=[]//stores the data to be sent to the server
var state=[]//stores status;
var arr=[]
var cols=[]
var diag=[]
var progress = 0;
var doneR= [];
var doneC= [];
var doneD =[];
for (let i=0;i<25;i++){
    state.push(0)
}
//initializes the input array with zeros
for(let i = 0;i<25;i++){
    input.push(0);
}

//adding eventListeners to the clickers mentioned above.
clickers.forEach(el=>{
    el.addEventListener('click',e=>{
        if(!isDone&&!gameStarted){
        handle(el,e)
        }
        if(gameStarted&&isDone){
            differentHandle(el,e)
        }
    })
})

function handle(el,e){

        if(el.childNodes.length==0&&replaceFrom==""){//it the selected cell is not already acupied and user hadn't clicked on preoccupied cell before this
        let p = document.createElement('p')
        let text = document.createTextNode(current)
        p.appendChild(text)
        el.appendChild(p)
        //adds a p element inside the cell(the clicker directly above the cell) with the current value of the current variable
        input[e.composedPath()[0].id]=current.toString()
        //e.composedPath()[0] returns the element in which the event took place
        //the input array is modified to store the board correctly
        //if the board is full the player can submit it
        if(current==25){
            showDone()
        }else{
            current++
        }
    }else{
        //this part will be executed if the player clicked a preoccupied cell or had clicked on preoccupied cell before it
       if(replaceFrom==""){
           //this part will be execueted if the player has clicked a preoccupied cell
           replaceFrom=el;
           replaceFrom.style.backgroundColor="red"
           //stores the current cell in replaceFrom and changes the background color to red
       }else{
           //this part will be executed if the player clicked a preoccupied cell before
           let temp = el.childNodes[0];
           let temp2 = replaceFrom.childNodes[0];
           //storing the values of current and previously clicked cell to swap
           if(temp==undefined){
            //executed if current clicked cell is empty
                el.appendChild(temp2)
                replaceFrom.style.backgroundColor=""
                replaceFrom=""
            //add the previous cells value to current cell
           }else{
                el.replaceChild(temp2,temp);
            //replace the value of current cell with previous cell
                replaceFrom.appendChild(temp);
            //append this cells value to previous cell
                replaceFrom.style.backgroundColor=""
                replaceFrom=""
           }

           //if the board is filled the player can submit it
           if(current == 25){
               showDone()
           }
           
       }
    }
}


function differentHandle(el,e)
{
    console.log("ok")
    val = el.children[0].innerText
    console.log(val)
    socket.emit("checkTurn",turn,roomCode,val)
}
// console.log(socket)
socket.on("checked",(arr)=>{
    val = arr[0];
    ok=arr[1]
   //console.log("mega ok")
    if(ok){
        //console.log(val)
        //console.log(findIdFromVal(val))
        
        document.getElementById(findIdFromVal(val)).style.backgroundColor="green"

    }else{
        console.log(val)
    }
})

socket.on("checkBack",arr=>{
    val=arr[0];
    id = findIdFromVal(val);
    state[id-1]=val;
    assignRows(state)
    assignCols(state)
    assignDiags(state)
    check()
    let progressDiv = document.getElementById("progress");
    if(progress==1){
        progressDiv.innerText="B"
    }else if(progress == 2){
        progressDiv.innerText="B I"
    }else if(progress == 3){
        progressDiv.innerText = "B I N"
    }else if(progress == 4){
        progressDiv.innerText = "B I N G"
    }else if(progress >=5){
        progressDiv.innerText = "B I N G O"
        showBingo()
        //socket.emit("won",turn,roomCode)
    }
})

socket.on("over",name=>{
    document.getElementById("won").classList.remove("hidden");
    document.getElementById("won").innerText = name;
})

//when the random button is cliked an array with numbers 1-25 is randomized and the board is populated
var random= document.getElementById("randomize")
random.addEventListener('click',e=>{
    let arr=[]
    for(let i=1;i<=25;i++){
        arr.push(i.toString())
    }
    arr = shuffleArray(arr);
    //console.log(arr)
    init(arr);
    input = arr
    showDone()  
})

document.getElementById("bingo").addEventListener("click",()=>{
    socket.emit("bingo",turn,roomCode)
})

//shuffles any given array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
//fills the board with values from an array
function init(arr){
    clickers.forEach((el,i)=>{
        el.innerHTML=`<p>${arr[i]}</p>`;
    })
}
//did not want to copy code
function showDone(){
    document.getElementById("done").classList.remove('hidden')
}

function findIdFromVal(val){
    let ps = document.querySelectorAll("#clickers div p");
    for(let i=0;i<ps.length;i++){
        if(ps[i].innerText==val){
            return i+1;
        }
    }
}


function check(){
    for(let i=0;i<5;i++){
        console.log(!(belongsTo(0,rows[i])),"rows",!belongsTo(i,doneR))
        if(!belongsTo(0,rows[i])&&!belongsTo(i,doneR)){
            progress++;
            doneR.push(i);
            console.log(doneR)
        }
    }
    for(let i=0;i<5;i++){
        console.log(!(belongsTo(0,cols[i])),"cols",!belongsTo(i,doneC))

       if(!belongsTo(0,cols[i])&&!belongsTo(i,doneC)){
          progress++;
          doneC.push(i)
          console.log(doneC)
       }
   }
   for(let i=0;i<2;i++){
    console.log(!(belongsTo(0,diag[i])),"disgs",!belongsTo(i,doneD))

       if(!belongsTo(0,diag[i])&&!belongsTo(i,doneD)){
           progress++;
           doneD.push(i)
           console.log(doneD)

        }
   }
   console.log(progress)
}

function assignRows(state){
    let arr=[];
    let arr2=[];
    let a=0
   //console.log(state)
    for(let i=0;i<5;i++){
        for(let j=i;j<i+5;j++){
            arr.push(state[a]);
            a++
        }
        //console.log(arr)
        arr2.push(arr);
        arr=[]
    }
    rows=arr2;
}

function assignCols(state){
    let arr=[];
    let arr2=[];
    for(let i=0;i<5;i++){
        for(let j=i;j<25;j+=5){
            arr.push(state[j])
        }
        arr2.push(arr);
        arr=[]
    }
    cols=arr2;
}
function assignDiags(state){
    let arr=[];
    let arr2=[];
    for(let i=0;i<25;i+=6){
        arr.push(state[i])
    }
    arr2.push(arr)
    arr=[]
    for(let i=4;i<21;i+=4){
        arr.push(state[i])
    }
    arr2.push(arr)
    arr=[]
    diag=arr2;
}

function belongsTo(e, arr) {
    //console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == e) {
        return true;
      }
    }
    return false;
  }


function showBingo(){
    document.getElementById("bingo").classList.remove("hidden")
}
