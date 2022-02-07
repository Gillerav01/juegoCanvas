var principal;
var myObstacles = [];
var myScore;
var puntuacion = 0;
var touches;

window.addEventListener("load", start);
window.addEventListener("resize", function () {
    myGameArea.canvas.width = window.innerWidth;
    myGameArea.canvas.height = window.innerHeight;
    myScore.x = window.innerWidth / 2;
});

document.oncontextmenu = function () { return false }

function start() {

    principal = new component(50, 50, "red", 100, window.innerHeight / 2);
    myScore = new component("30px", "Consolas", "white", window.innerWidth / 2 - 120, 50, "text");
    myGameArea.start();
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
        if (navigator.userAgent.match(/Android/i) != null) {
            this.canvas.addEventListener('touchmove', function (e) {
                principal.x = e.touches[0].pageX - principal.halfX;
                principal.y = e.touches[0].pageY - principal.halfY;
            }, false);
        } else {
            window.addEventListener('keydown', function (e) {
                myGameArea.keys = (myGameArea.keys || []);
                myGameArea.keys[e.keyCode] = true;
            })
            window.addEventListener('keyup', function (e) {
                myGameArea.keys[e.keyCode] = false;
            })
        }
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

function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.type = type;
    this.halfX = width / 2;
    this.halfY = height / 2;
    this.x = x;
    this.y = y;
    this.update = function () {
        var ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = "bold 48px serif";
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
            localStorage.setItem("puntuacion", puntuacion);
            if (puntuacion > localStorage.getItem("record")) {
                localStorage.setItem("record", puntuacion);
            }
            myGameArea.context.fillStyle = "black";
            myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
            myGameArea.context.fillStyle = "white";
            myGameArea.context.font = "30px Consolas";
            myGameArea.context.fillText("Has perdido", myGameArea.canvas.width / 2 - 100, myGameArea.canvas.height / 2);
            myGameArea.context.fillText("Puntuación: " + puntuacion, myGameArea.canvas.width / 2 - 100, myGameArea.canvas.height / 2 + 50);
            myGameArea.context.fillText("Record: " + localStorage.getItem("record"), myGameArea.canvas.width / 2 - 100, myGameArea.canvas.height / 2 + 100);
            myGameArea.context.fillText("Pulsa R para reiniciar", myGameArea.canvas.width / 2 - 100, myGameArea.canvas.height / 2 + 150);
            document.onkeydown = function (e) {
                if (e.keyCode == 82) {
                    location.reload();
                }
            setTimeout(function () {
                    location.reload();
            }, 3000);
            }
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    var velocidad = 0.10;
    if (myGameArea.frameNo > 2000) {
        if ((myGameArea.frameNo % 1000 == 0)) {
            puntuacion += 10;
        }
        var stringPuntuacion = "" + puntuacion;
        var subStringPuntuacion = parseInt(stringPuntuacion.substring(0, 1));
        if (puntuacion >= 50) {
            subStringPuntuacion = 5;
        }


        if (myGameArea.frameNo == 1 || everyinterval(300)) {
            for (var j = 0; j < Math.random() * (subStringPuntuacion - 1) + 1; j += 1) {
                y = (myGameArea.canvas.height - (parseInt(Math.random() * (myGameArea.canvas.height - 50) + 50)));
                x = myGameArea.canvas.width + (parseInt(Math.random() * myGameArea.canvas.width));
                myObstacles.push(new component(100, 100, "yellow", x, y));
            }
        }
        for (var i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += velocidad * puntuacion * -1;
            myObstacles[i].update();
        }
    }
    principal.speedX = 0;
    principal.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37] && principal.x > 0) {
        if (puntuacion < 150) {
            principal.speedX = -4;
        } else {
            principal.speedX = -5;
        }
    }
    if (myGameArea.keys && myGameArea.keys[39] && principal.x < myGameArea.canvas.width - principal.width - 2.99) {
        if (puntuacion < 150) {
            principal.speedX = 4;
        } else {
            principal.speedX = 5;
        }
    }
    if (myGameArea.keys && myGameArea.keys[38] && principal.y > myGameArea.canvas.height - myGameArea.canvas.height - 2.99) {
        if (puntuacion < 150) {
            principal.speedY = -4;
        } else {
            principal.speedY = -5;
        }
    }
    if (myGameArea.keys && myGameArea.keys[40] && principal.y < myGameArea.canvas.height - 30) {
        if (puntuacion < 150) {
            principal.speedY = 4;
        } else {
            principal.speedY = 5;
        }
    }
    principal.newPos();
    myScore.text = "Puntuacion: " + puntuacion;
    myScore.update();
    principal.update();
}