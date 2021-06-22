var current = 1;
var replaceFrom = ""; 
var clickers = document.querySelectorAll("#clickers div"); 
var input = [] 
var state = [] 
var arr = []
var cols = []
var diag = []
var progress = 0;
var doneR = [];
var doneC = [];
var doneD = [];
for (let i = 0; i < 25; i++) {
    state.push(0)
}
for (let i = 0; i < 25; i++) {
    input.push(0);
}

clickers.forEach(el => {
    el.addEventListener('click', e => {
        if (!isDone && !gameStarted) {
            handle(el, e)
        }
        if (gameStarted && isDone) {
            differentHandle(el, e)
        }
    })
})

function handle(el, e) {

    if (el.childNodes.length == 0 && replaceFrom == "") { 
        let p = document.createElement('p')
        let text = document.createTextNode(current)
        p.appendChild(text)
        el.appendChild(p)
        input[e.composedPath()[0].id] = current.toString()
        if (current == 25) {
            showDone()
        } else {
            current++
        }
    } else {
        if (replaceFrom == "") {
            replaceFrom = el;
            replaceFrom.style.backgroundColor = "red"
        } else {
            let temp = el.childNodes[0];
            let temp2 = replaceFrom.childNodes[0];
            if (temp == undefined) {
                el.appendChild(temp2)
                replaceFrom.style.backgroundColor = ""
                replaceFrom = ""
            } else {
                el.replaceChild(temp2, temp);
                replaceFrom.appendChild(temp);
                replaceFrom.style.backgroundColor = ""
                replaceFrom = ""
            }

            if (current == 25) {
                showDone()
            }

        }
    }
}


function differentHandle(el, e) {
    console.log("ok")
    val = el.children[0].innerText
    console.log(val)
    socket.emit("checkTurn", turn, roomCode, val)
}
socket.on("checked", (arr) => {
    val = arr[0];
    ok = arr[1]
    if (ok) {

        document.getElementById(findIdFromVal(val)).style.border = "3px solid yellow"
        document.getElementById(findIdFromVal(val)).style.borderRadius="100%"

    } else {
        console.log(val)
    }
})

socket.on("checkBack", arr => {
    val = arr[0];
    id = findIdFromVal(val);
    state[id - 1] = val;
    assignRows(state)
    assignCols(state)
    assignDiags(state)
    check()
    let progressDiv = document.getElementById("progress");
    if (progress == 1) {
        progressDiv.innerText = "B"
    } else if (progress == 2) {
        progressDiv.innerText = "B I"
    } else if (progress == 3) {
        progressDiv.innerText = "B I N"
    } else if (progress == 4) {
        progressDiv.innerText = "B I N G"
    } else if (progress >= 5) {
        progressDiv.innerText = "B I N G O"
        showBingo()
    }
})

socket.on("over", name => {
    document.getElementById("won").classList.remove("hidden");
    document.getElementById("won").innerText = name;
})

var random = document.getElementById("randomize")
random.addEventListener('click', e => {
    let arr = []
    for (let i = 1; i <= 25; i++) {
        arr.push(i.toString())
    }
    arr = shuffleArray(arr);
    init(arr);
    input = arr
    showDone()
})

document.getElementById("bingo").addEventListener("click", () => {
    socket.emit("bingo", turn, roomCode)
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
function init(arr) {
    clickers.forEach((el, i) => {
        el.innerHTML = `<p>${arr[i]}</p>`;
    })
}
function showDone() {
    document.getElementById("done").classList.remove('hidden')
}

function findIdFromVal(val) {
    let ps = document.querySelectorAll("#clickers div p");
    for (let i = 0; i < ps.length; i++) {
        if (ps[i].innerText == val) {
            return i + 1;
        }
    }
}


function check() {
    for (let i = 0; i < 5; i++) {
        console.log(!(belongsTo(0, rows[i])), "rows", !belongsTo(i, doneR))
        if (!belongsTo(0, rows[i]) && !belongsTo(i, doneR)) {
            progress++;
            doneR.push(i);
            document.querySelectorAll("#rows line")[i].classList.remove("hidden")
            document.querySelectorAll("#rows line")[i].classList.add("animate")
        }
    }
    for (let i = 0; i < 5; i++) {
        console.log(!(belongsTo(0, cols[i])), "cols", !belongsTo(i, doneC))

        if (!belongsTo(0, cols[i]) && !belongsTo(i, doneC)) {
            progress++;
            doneC.push(i)
            document.querySelectorAll("#cols line")[i].classList.remove("hidden")
            document.querySelectorAll("#cols line")[i].classList.add("animate")
        }
    }
    for (let i = 0; i < 2; i++) {
        console.log(!(belongsTo(0, diag[i])), "disgs", !belongsTo(i, doneD))

        if (!belongsTo(0, diag[i]) && !belongsTo(i, doneD)) {
            progress++;
            doneD.push(i)
            document.querySelectorAll("#diag line")[i].classList.remove("hidden")
            document.querySelectorAll("#diag line")[i].classList.add("animate")

        }
    }
    console.log(progress)
}

function assignRows(state) {
    let arr = [];
    let arr2 = [];
    let a = 0
    for (let i = 0; i < 5; i++) {
        for (let j = i; j < i + 5; j++) {
            arr.push(state[a]);
            a++
        }
        arr2.push(arr);
        arr = []
    }
    rows = arr2;
}

function assignCols(state) {
    let arr = [];
    let arr2 = [];
    for (let i = 0; i < 5; i++) {
        for (let j = i; j < 25; j += 5) {
            arr.push(state[j])
        }
        arr2.push(arr);
        arr = []
    }
    cols = arr2;
}

function assignDiags(state) {
    let arr = [];
    let arr2 = [];
    for (let i = 0; i < 25; i += 6) {
        arr.push(state[i])
    }
    arr2.push(arr)
    arr = []
    for (let i = 4; i < 21; i += 4) {
        arr.push(state[i])
    }
    arr2.push(arr)
    arr = []
    diag = arr2;
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


function showBingo() {
    document.getElementById("bingo").classList.remove("hidden")
}