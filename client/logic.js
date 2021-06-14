//handle click
var current = 1;
var val;
var replaceFrom="";
var clickers= document.querySelectorAll("#clickers div");
var input=[]
for(let i = 0;i<25;i++){
    input.push(0);
}
clickers.forEach(el=>{
    el.addEventListener('click',e=>{
        handle(el,e)
    })
})

function handle(el,e){
    //console.log(el)
        if(el.childNodes.length==0&&replaceFrom==""){
        //console.log(e.composedPath()[0].id)
        let p = document.createElement('p')
        let text = document.createTextNode(current)
        p.appendChild(text)
        el.appendChild(p)
        input[e.composedPath()[0].id]=current.toString()
        current++;
        if(current==25){
            showDone()
        }
    }else{
        //console.log(el,replaceFrom,el==replaceFrom)
       if(replaceFrom==""){
           replaceFrom=el;
           replaceFrom.style.backgroundColor="red"
       }else{
           let temp = el.childNodes[0];
           let temp2 = replaceFrom.childNodes[0];
           //console.log(temp,temp2,replaceFrom)
           if(temp==undefined){
               el.appendChild(temp2)
               console.log(el)
               console.log(replaceFrom)
               //replaceFrom.removeChild(replaceFrom.childNodes[0])
               replaceFrom.style.backgroundColor=""
                replaceFrom=""
           }else{
           el.replaceChild(temp2,temp);
           replaceFrom.appendChild(temp);
           replaceFrom.style.backgroundColor=""
           replaceFrom=""
           }
           if(current == 25){
               showDone()
           }
           //console.log(replaceFrom)
           //console.log(replaceFrom.childNodes)
           //replaceFrom.appendChild(temp);
           
       }
    }
}


//handle random button
var random= document.getElementById("randomize")
random.addEventListener('click',e=>{
    let arr=[]
    for(let i=1;i<=25;i++){
        arr.push(i)
    }
    arr = shuffleArray(arr);
    //console.log(arr)
    init(arr);
    input = arr
    showDone()
})

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function init(arr){
    clickers.forEach((el,i)=>{
        el.innerHTML=`<p>${arr[i]}</p>`;
    })
}

function showDone(){
    document.getElementById("done").classList.remove('hidden')
}