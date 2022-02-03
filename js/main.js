"use strict";
var principal;
var myObstacles = [];
var myScore;
var puntuacion = 0;

window.addEventListener("load", start);
window.addEventListener("resize", function () {
    myGameArea.canvas.width = window.innerWidth;
    myGameArea.canvas.height = window.innerHeight;
});

document.oncontextmenu = function () { return false }


function start() {
    principal = new component(50, 50, "red", myGameArea.canvas.width / 2, myGameArea.canvas.height / 2);
    myScore = new component("30px", "Consolas", "white", 280, 40, "text");
    myGameArea.start();
    myGameArea.context.fillStyle = "black";
    myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 0);
        this.frameNo = 0;
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function component(width, height, color, x, y, ty) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        var ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (principal.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
    if ((myGameArea.frameNo % 2000 == 0)) {
        puntuacion += 20;
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    var velocidad = 0.05;
    if (myGameArea.frameNo > 1000) {
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
            for (var j = 0; j < Number(Math.random() * (5 - 1) + 1); j += 1) {
                y = (myGameArea.canvas.height - (Math.random() * myGameArea.canvas.height));
                x = myGameArea.canvas.width + (Math.random() * myGameArea.canvas.width);
                myObstacles.push(new component(100, 100, "black", x, y));
            }
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myObstacles[i].x + 50 < 0) {
                myObstacles.splice(i, 1);
            }
        }
        for (var i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += velocidad * puntuacion * -1;
            myObstacles[i].update();
        }
    }
    principal.speedX = 0;
    principal.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37] && principal.x > 0) { principal.speedX = -3; }
    if (myGameArea.keys && myGameArea.keys[39] && principal.x < myGameArea.canvas.width - principal.width - 2.99) { principal.speedX = 3; }
    if (myGameArea.keys && myGameArea.keys[38] && principal.y > myGameArea.canvas.height - myGameArea.canvas.height - 2.99) { principal.speedY = -3; }
    if (myGameArea.keys && myGameArea.keys[40] && principal.y < myGameArea.canvas.height - 30) { principal.speedY = 3; }
    principal.newPos();
    myScore.text = "Puntuacion: " + puntuacion;
    myScore.update();
    principal.update();
}