var current = 1,
    replaceFrom = "",
    clickers = document.querySelectorAll("#clickers div"),
    input = [],
    state = [],
    arr = [],
    cols = [],
    diag = [],
    progress = 0,
    doneR = [],
    doneC = [],
    doneD = [];
for (let e = 0; e < 25; e++) state.push(0);
for (let e = 0; e < 25; e++) input.push(0);

function handle(e, o) {
    if (0 == e.childNodes.length && "" == replaceFrom) {
        let n = document.createElement("p"),
            r = document.createTextNode(current);
        n.appendChild(r), e.appendChild(n), input[o.composedPath()[0].id] = current.toString(), 25 == current ? showDone() : current++
    } else if ("" == replaceFrom)(replaceFrom = e).style.backgroundColor = "red";
    else {
        let o = e.childNodes[0],
            n = replaceFrom.childNodes[0];
        null == o ? (e.appendChild(n), replaceFrom.style.backgroundColor = "", replaceFrom = "") : (e.replaceChild(n, o), replaceFrom.appendChild(o), replaceFrom.style.backgroundColor = "", replaceFrom = ""), 25 == current && showDone()
    }
}

function differentHandle(e, o) {
    console.log("ok"), val = e.children[0].innerText, console.log(val), socket.emit("checkTurn", turn, roomCode, val)
}
clickers.forEach(e => {
    e.addEventListener("click", o => {
        isDone || gameStarted || handle(e, o), gameStarted && isDone && differentHandle(e, o)
    })
}), socket.on("checked", e => {
    val = e[0], ok = e[1], ok ? document.getElementById(findIdFromVal(val)).style.backgroundColor = "green" : console.log(val)
}), socket.on("checkBack", e => {
    val = e[0], id = findIdFromVal(val), state[id - 1] = val, assignRows(state), assignCols(state), assignDiags(state), check();
    let o = document.getElementById("progress");
    1 == progress ? o.innerText = "B" : 2 == progress ? o.innerText = "B I" : 3 == progress ? o.innerText = "B I N" : 4 == progress || progress >= 5 && socket.emit("won", turn, roomCode)
}), socket.on("over", e => {
    document.getElementById("won").classList.remove("hidden"), document.getElementById("won").innerText = e
});
var random = document.getElementById("randomize");

function shuffleArray(e) {
    for (var o = e.length - 1; o > 0; o--) {
        var n = Math.floor(Math.random() * (o + 1)),
            r = e[o];
        e[o] = e[n], e[n] = r
    }
    return e
}

function init(e) {
    clickers.forEach((o, n) => {
        o.innerHTML = `<p>${e[n]}</p>`
    })
}

function showDone() {
    document.getElementById("done").classList.remove("hidden")
}

function findIdFromVal(e) {
    let o = document.querySelectorAll("#clickers div p");
    for (let n = 0; n < o.length; n++)
        if (o[n].innerText == e) return n + 1
}

function check() {
    for (let e = 0; e < 5; e++) console.log(!belongsTo(0, rows[e]), "rows", !belongsTo(e, doneR)), belongsTo(0, rows[e]) || belongsTo(rows[e], done) || (progress++, doneR.push(e));
    for (let e = 0; e < 5; e++) console.log(!belongsTo(0, cols[e]), "cols", !belongsTo(cols[e], done)), belongsTo(0, cols[e]) || belongsTo(e, doneC) || (progress++, doneC.push(e));
    for (let e = 0; e < 2; e++) console.log(!belongsTo(0, diag[e]), "disgs", !belongsTo(diag[e], done)), belongsTo(0, diag[e]) || belongsTo(e, doneR) || (progress++, doneD.push(e));
    console.log(progress)
}

function assignRows(e) {
    let o = [],
        n = [],
        r = 0;
    for (let l = 0; l < 5; l++) {
        for (let n = l; n < l + 5; n++) o.push(e[r]), r++;
        n.push(o), o = []
    }
    rows = n
}

function assignCols(e) {
    let o = [],
        n = [];
    for (let r = 0; r < 5; r++) {
        for (let n = r; n < 25; n += 5) o.push(e[n]);
        n.push(o), o = []
    }
    cols = n
}

function assignDiags(e) {
    let o = [],
        n = [];
    for (let n = 0; n < 25; n += 6) o.push(e[n]);
    n.push(o), o = [];
    for (let n = 4; n < 21; n += 4) o.push(e[n]);
    n.push(o), o = [], diag = n
}

function belongsTo(e, o) {
    for (let n = 0; n < o.length; n++)
        if (o[n] == e) return !0;
    return !1
}
random.addEventListener("click", e => {
    let o = [];
    for (let e = 1; e <= 25; e++) o.push(e.toString());
    init(o = shuffleArray(o)), input = o, showDone()
});