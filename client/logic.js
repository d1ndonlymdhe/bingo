
var current = 1; //stores the value which is to be added to the cell the player clicks
var replaceFrom="";//required to handle swaps(player clicks on a pre-occupoid cell)
var clickers= document.querySelectorAll("#clickers div");//stores the divs which overlay the board and determine which cell was selected
var input=[]//stores the data to be sent to the server

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


function differentHandle(el,e){
    
}


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



