//handle click
var current = 1;
var clickers= document.querySelectorAll("#clickers div");
clickers.forEach(el=>{
    el.addEventListener('click',e=>{
        console.log(e.composedPath()[0].id)
        let p = document.createElement('p')
        let text = document.createTextNode(current)
        p.appendChild(text)
        el.appendChild(p)
        current++;
    })
})