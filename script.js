const $ = (s) => document.querySelector(s);

function delegate(parent, selector, type, fn) {
    function delegatedFunction(event) {
        let handler = this;
        let target = event.target;

        const closest = target.closest(selector);
        if (handler.contains(closest)) {
            fn.call(closest, event);
        }
    }
    parent.addEventListener(type, delegatedFunction);
}



let level = {
    1: [
        [0, 0, 0, 2, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [3, 0, 0, 3, 0],
        [1, 0, 0, 0, 0]],

    2: [
        [2, 0, 0, 9, 0, 0, 0, 5, 0],
        [1, 0, 0, 8, 0, 11, 0, 0, 5],
        [0, 2, 0, 0, 6, 0, 7, 0, 0],
        [0, 0, 0, 0, 0, 11, 0, 10, 0, 0],
        [0, 0, 0, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 3, 6],
        [0, 9, 0, 4, 8, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 10, 3]],

    3: [
        [1, 0, 0, 0, 3, 0, 5, 0, 2],
        [0, 0, 0, 0, 0, 0, 8, 5, 0],
        [7, 4, 0, 6, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 2],
        [0, 0, 4, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 7, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 6, 0, 0, 0, 0, 8]]
}

let board;
let fields;
let width;
let height;


let mouseToggle = false;
let startNumber;
let oldCell;
let startField;
let endField;
let isPlaying = false;

let steps = [];

function mainMenu() {
    var isInfo = document.getElementById("info")

    if (!isInfo) {
        var buttons = document.createElement("div");
        var info = document.createElement("div");

        buttons.id = "buttons";
        buttons.classList.add("buttonContainer");
        buttons.innerHTML = `<button type="button" class="mainButton" onclick="setLevel(1)" style="color: green; cursor: pointer; ">KÖNNYŰ</button>
            <button type = "button" class="mainButton" onclick = "setLevel(2)" style = "color: orange; cursor: pointer;" > KÖZEPES</button>
                <button type="button" class="mainButton" onclick="setLevel(3)" style="color: red; cursor: pointer;">NEHÉZ</button>`
        document.getElementById("container").appendChild(buttons);
        info.id = "info";
        info.innerHTML = "Készítette: Harsányi Péter"
        document.getElementById("container").appendChild(info);
    }

    var table = document.getElementById("table");
    if (table) {
        document.getElementById("saveLoadDiv").remove();
        table.remove()
    }
}

function colorCell(event) {
    let td = this;
    let tr = td.parentNode;
    let y = td.cellIndex;
    let x = tr.rowIndex;

    cell = fields[x][y];

    let colorToDelete = NumberToColor(startNumber);


    if (mouseToggle == true && ((oldCell.x == cell.x && (cell.y == oldCell.y + 1 || cell.y == oldCell.y - 1)) || (oldCell.y == cell.y && (cell.x == oldCell.x + 1 || cell.x == oldCell.x - 1)))) {

        if (startField == oldCell && fields[x][y].getColor() != "") {
            deleteLine(colorToDelete);
        }

        if (fields[x][y] == steps[steps.length - 2]) {
            steps.pop();
            oldCell.setColor("");
            oldCell = cell;

            playAudio("backpop.mp3");
        }

        if (fields[x][y].number == 0 && fields[x][y].getColor() == "") {

            if (steps.length == 1) {
                deleteLine(colorToDelete);
            }

            fields[x][y].setColor(NumberToColor(startNumber));


            steps.push(fields[x][y])
            oldCell = cell;

            if (startField.number != 0) {
                let randomSzam = Math.floor(Math.random() * 2 + 1);


                playAudio("pop1.mp3");

            }

        }

        if (startField != fields[x][y] && fields[x][y].number == startNumber && fields[x][y].isComplete == false) {
            startField.isComplete = true;
            fields[x][y].isComplete = true;

        }
    }
}

function colorCellPhone(node) {
    console.log(node);

    let td = node;
    let tr = td.parentNode;
    let y = td.cellIndex;
    let x = tr.rowIndex;

    cell = fields[x][y];

    let colorToDelete = NumberToColor(startNumber);


    if (mouseToggle == true && ((oldCell.x == cell.x && (cell.y == oldCell.y + 1 || cell.y == oldCell.y - 1)) || (oldCell.y == cell.y && (cell.x == oldCell.x + 1 || cell.x == oldCell.x - 1)))) {

        if (startField == oldCell && fields[x][y].getColor() != "") {
            deleteLine(colorToDelete);
        }

        if (fields[x][y] == steps[steps.length - 2]) {
            steps.pop();
            oldCell.setColor("");
            oldCell = cell;

            playAudio("backpop.mp3");
        }

        if (fields[x][y].number == 0 && fields[x][y].getColor() == "") {

            if (steps.length == 1) {
                deleteLine(colorToDelete);
            }

            fields[x][y].setColor(NumberToColor(startNumber));


            steps.push(fields[x][y])
            oldCell = cell;

            if (startField.number != 0) {
                let randomSzam = Math.floor(Math.random() * 2 + 1);


                playAudio("pop1.mp3");

            }

        }

        if (startField != fields[x][y] && fields[x][y].number == startNumber && fields[x][y].isComplete == false) {
            startField.isComplete = true;
            fields[x][y].isComplete = true;

        }
    }
}


function createTable() {

    isPlaying = true;

    var table = document.getElementById("table");

    table.innerHTML = "";
    let content = "";

    let nth = 0;
    for (let i = 0; i < height; i++) {

        content += "<tr>";

        for (let j = 0; j < width; j++) {

            content += `<td id="cell${nth}">${board[i][j] == 0 ? "" : board[i][j]}</td>`
            nth++;
        }
        content += "</tr>";
    }

    table.innerHTML = content;

    let saveLoadDiv = document.createElement("div");
    document.getElementById("container").appendChild(saveLoadDiv)
    saveLoadDiv.setAttribute("id", "saveLoadDiv");
    saveLoadDiv.classList.add("buttonContainer")

    saveLoadDiv.innerHTML = `<button id="saveButton" class="mainButton" onclick="saveGame()" style="cursor: pointer">MENTÉS</button>
                             <button id="loadButton" class="mainButton" onclick="loadGame()" style="cursor: pointer">BETÖLTÉS</button>`


    setTimeout(function () {
        arr = new Array(width);

        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(height);
        }

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                arr[i][j] = {
                    color: fields[i][j].getColor(),
                }

            }
        }
    }, 1);

    if ((difficulty == 1 && localStorage.getItem("easy")) || (difficulty == 2 && localStorage.getItem("medium")) || (difficulty == 3 && localStorage.getItem("hard"))) {
        loadButton.style.color = "steelblue";
        loadButton.style.backgroundColor = "#E0E0E0"

    }
}


function deleteLine(colorToDelete) {
    for (let i = 0; i < height; i++) {

        for (let j = 0; j < width; j++) {

            if (fields[i][j].getColor() == colorToDelete && fields[i][j].number == 0) {
                fields[i][j].setColor("");
            }
        }
    }
}



function init() {
    content = "";

    createTable();

    let nodes = document.querySelectorAll("td");

    let x = 0;
    let y = 0;

    for (tds of nodes) {
        fields[x][y] = {
            cell: tds,
            number: board[x][y],
            x: x,
            y: y,

            setColor: function (color) {
                this.cell.style.backgroundColor = color;
            },

            getColor: function () {
                return this.cell.style.backgroundColor;
            }
        }

        if (fields[x][y].number !== 0) {
            fields[x][y].setColor(NumberToColor(fields[x][y].number));
        }

        y = y + 1;
        if (y == width) {
            x = x + 1;
            y = 0;
        }
    }
}

let arr;

function keyUp() {

    let td = this;
    let tr = td.parentNode;
    let y = td.cellIndex;
    let x = tr.rowIndex;

    let endNumber = fields[x][y].number;
    let colorToDelete = NumberToColor(startNumber);


    if (fields[x][y].number != 0 && fields[x][y].number == startField.number) {
        endField = fields[x][y];
    }

    if (startNumber == endNumber && startField != fields[x][y] && fields[x][y].number != 0) {


        startField.isComplete = true;
        endField.isComplete = true;

        playAudio("done.wav");

    }

    mouseToggle = false;

    if ((startNumber != endNumber || fields[x][y] == startField)) {

        deleteLine(colorToDelete)
        playAudio("backpop.mp3");
    }

    steps = [];

    if (!((oldCell.x == fields[x][y].x && (fields[x][y].y == oldCell.y + 1 || fields[x][y].y == oldCell.y - 1)) || (oldCell.y == fields[x][y].y && (fields[x][y].x == oldCell.x + 1 || fields[x][y].x == oldCell.x - 1)))     /* && fields[x][y].color != startField.color*/) {

        deleteLine(colorToDelete);
    }


    let emptyCounter = 0;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (fields[i][j].getColor() == "") {
                emptyCounter++;

            }
        }
    }

    if (emptyCounter == 0) {


        wins();


    }


    setTimeout(function () {
        arr = new Array(width);

        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(height);
        }

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                arr[i][j] = {
                    color: fields[i][j].getColor(),
                }

            }
        }
    }, 1);

}

function NumberToColor(number) {
    if (number == 1) return "steelblue"
    if (number == 2) return "firebrick"
    if (number == 3) return "forestgreen"
    if (number == 4) return "darkorange"
    if (number == 5) return "grey"
    if (number == 6) return "mediumseagreen"
    if (number == 7) return "saddlebrown"
    if (number == 8) return "violet"
    if (number == 9) return "purple"
    if (number == 10) return "navy"
    if (number == 11) return "red"
}


function playAudio(src) {
    var audio = new Audio(`./sounds/${src}`);
    audio.play();
}


function rightClick(event) {
    event.preventDefault();

    let td = this;
    let tr = td.parentNode;
    let y = td.cellIndex;
    let x = tr.rowIndex;

    let colorToDelete = fields[x][y].getColor();

    deleteLine(colorToDelete)
    playAudio("backpop.mp3")
}

let difficulty

let lastNode;

function setLevel(x) {

    let table = document.createElement("table");
    table.id = "table";
    document.getElementById("container").appendChild(table);
    document.getElementById("buttons").remove();
    document.getElementById("info").remove();

    delegate($("table"), "td", "mousedown", toggleMouse);
    delegate($("table"), "td", "mouseup", keyUp);
    delegate($("table"), "td", "mouseover", colorCell);
    delegate($("table"), "td", "contextmenu", rightClick);

    board = level[x];
    width = board[0].length;
    height = board.length;
    fields = new Array(width);

    difficulty = x;

    for (var i = 0; i < fields.length; i++) {
        fields[i] = new Array(height);
    }

    init();
}

function toggleMouse() {
    mouseToggle = true;

    let td = this;
    let tr = td.parentNode;
    let y = td.cellIndex;
    let x = tr.rowIndex;

    if (fields[x][y].number != 0) {
        startField = fields[x][y];
    }

    if (fields[x][y].number !== 0) {
        startNumber = fields[x][y].number;
    }
    else {
        startNumber = "";
    }

    steps.push(fields[x][y])

    oldCell = fields[x][y];

}

function wins() {

    let winText = document.createElement("div");
    winText.setAttribute("id", "winText");
    document.getElementById("container").appendChild(winText);
    winText.classList.add("win")
    winText.innerHTML = `<img style="height:200pt; margin:5vh" src="./win.png"><button id="winButton" style="margin:5vh; cursor: pointer" class="mainButton">MENÜ</button>`
    document.getElementById("winButton").onclick = function () {
        winText.remove();
        mainMenu();
    }

    playAudio("win.wav");
    isPlaying = false;
}

function saveGame() {

    let gameData = [];

    let loadButton = document.getElementById("loadButton");

    let i = 0;
    let j = 0;

    if (difficulty == 1) {

        if (!localStorage.getItem("easy")) {
            save("easy");
            loadButton.style.color = "steelblue";
            loadButton.style.backgroundColor = "#E0E0E0"
        }
        else {
            overwrite("easy");


        }

    }

    if (difficulty == 2) {
        if (!localStorage.getItem("medium")) {
            save("medium");
            loadButton.style.color = "steelblue";
            loadButton.style.backgroundColor = "#E0E0E0"
        }
        else {
            overwrite("medium");


        }
    }

    if (difficulty == 3) {
        if (!localStorage.getItem("hard")) {
            save("hard");
            loadButton.style.color = "steelblue";
            loadButton.style.backgroundColor = "#E0E0E0"
        }
        else {
            overwrite("hard");


        }
    }

    function save(diff) {
        if (arr !== undefined) {
            for (arrays of arr) {
                for (objs of arrays) {


                    gameData.push(JSON.stringify(objs));

                    j++;
                }
                i++;
                j = 0;
            }

            localStorage.setItem(diff, gameData)
        }
    }

    function overwrite(diff) {

        let decisionDiv = document.createElement("div")
        decisionDiv.setAttribute("id", "decisionDiv")


        let refDiv = document.getElementById("saveLoadDiv");

        document.getElementById("container").appendChild(decisionDiv);

        decisionDiv.innerHTML = `<div id="close" style="cursor:pointer">X</div><p>Felül akarja írni a korábbi mentést?</p>
                                    <button id="overwrite" style="cursor:pointer">Felülír</button>
                                     <button id="cancel" style="cursor:pointer">Mégse</button>`

        let overWriteButton = document.getElementById("overwrite");
        let neverMindButton = document.getElementById("cancel");
        let closeButton = document.getElementById("close");

        overWriteButton.onclick = function () {
            save(diff);
            decisionDiv.remove();
        };

        neverMindButton.onclick = function () { decisionDiv.remove() };
        closeButton.onclick = function () { decisionDiv.remove() };
    }

}

function loadGame() {

    if (localStorage.length != 0) {



        if (difficulty == 1) {


            let str = localStorage.getItem("easy");

            var array = JSON.parse("[" + str + "]");

            let k = 0;

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    fields[i][j].setColor(array[k].color)
                    k++;
                }
            }



        }


        if (difficulty == 2) {
            let str = localStorage.getItem("medium");

            var array = JSON.parse("[" + str + "]");

            let k = 0;

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    fields[i][j].setColor(array[k].color)
                    k++;
                }
            }
        }



        if (difficulty == 3) {
            let str = localStorage.getItem("hard");

            var array = JSON.parse("[" + str + "]");

            let k = 0;

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    fields[i][j].setColor(array[k].color)
                    k++;
                }
            }
        }


    }


}