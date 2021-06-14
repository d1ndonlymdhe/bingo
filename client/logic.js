//handle click
var current = 1;
var val;
var replaceFrom="";
var clickers= document.querySelectorAll("#clickers div");
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
        current++;
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
           //console.log(replaceFrom)
           //console.log(replaceFrom.childNodes)
           //replaceFrom.appendChild(temp);
           
       }
    }
}