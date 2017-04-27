/* implementing function to draw the boxes over the objects in game board */
/*function drawBox(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
};*/

/*********************** Enemies *****************************/

var Enemy = function (x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = this.randomSpeed(50, 200);
    this.width = 80;
    this.height = 67;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
        this.x = 0;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // drawBox(this.x, this.y + 77, 101, 67, "yellow");
};

// Creating the function which will return random speeds for the enemy object
Enemy.prototype.randomSpeed = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
};

/*********************** Player ******************************/

var Player = function (speed) {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.width = 50;
    this.height = 50;
    this.life = 3;
    this.lifeArray = ["images/Heart.png", "images/Heart.png", "images/Heart.png"];
};

/***************************** Life Display and Life Reducer Functions ***************************/

/*Player.prototype.displayLife = function () {
    for (var i = 0; i < this.lifeArray.length; i++) {
        var formattedLifeHeart = HTMLlifeHeart.replace('%data%', this.lifeArray[i]);
        $("#heartList:last").append(formattedLifeHeart);
    }
};
*/
// This function will reduce the life hearts and will display the reduced life on the game board
/*Player.prototype.lifeReducer = function () {
    var lastChild = $("ul li:last-child");
    $(lastChild).remove();
};*/

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // drawBox(this.x + 17, this.y + 63, 66, 75, "blue");
};

Player.prototype.update = function () {

    /* Cheking player should not move out screen */
    if (this.x > 404) {
        this.x = 404;
    }

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.y > 400) {
        this.y = 400;
    }

    if (this.y < 60) {
        this.resetPosition(); // resetting the position of the player
        this.resetGame(false); // resetting the game
        alert('Congratulation !!! You Beat the Bugs !!!');
    }

    /* Invoking the collison detection function */
    this.checkCollisionsBugs();
};

// Event Listner function for player
Player.prototype.handleInput = function (key) {

    if (key === 'left') {
        this.x = this.x - 101;
    }
    if (key === 'right') {
        this.x = this.x + 101;
    }
    if (key === 'up') {
        this.y = this.y - 85;
    }
    if (key === 'down') {
        this.y = this.y + 85;
    }
    if (key === 'restart') {
        location.reload();
    }
};

// This function will reset the position of the player.
Player.prototype.resetPosition = function () {
    this.x = 202;
    this.y = 400;
};

/* Creating the Collision Detection function for player */
Player.prototype.checkCollisionsBugs = function () {
    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        // var bool = false;
        if (this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.height + this.y > enemy.y) {

            this.resetPosition(); //resetting the position of the player after collision
            ctx.clearRect(0, 0, 120, 60); // reducing the life hearts on game board
            allLife.splice(allLife.length - 1, 1);
            // this.gameOver(); // call this function when temporary gameOver functionality is needed
        }
    }
};

/************************** Enemy and Player initialization **************************/

var allEnemies = [];

allEnemies.push(new Enemy(-300, 60));
allEnemies.push(new Enemy(-200, 145));
allEnemies.push(new Enemy(-100, 230));
allEnemies.push(new Enemy(-400, 60));
allEnemies.push(new Enemy(-250, 145));
allEnemies.push(new Enemy(-350, 230));
allEnemies.push(new Enemy(-350, 315));

// creating the 'player' object 
var player = new Player();

// Displaying the life of the player on the HTML page
// document.getElementById('life').textContent = player.life;
// player.displayLife();

/*************************** Life Counter *******************/

var Life = {
    x: 0,
    y: 0,
    sprite: "images/Heart.png",
    render: function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 40, 60);
    }
};

var life1 = Object.create(Life);
life1.x = 0;

var life2 = Object.create(Life);
life2.x = 40;

var life3 = Object.create(Life);
life3.x = 80;

var allLife = [life1, life2, life3];

/*************************** Game Over *********************************/
// temporary Game Over functionality
/*Player.prototype.gameOver = function () {
    var bool = true;
    if (allLife.length === 0) {
        alert("YO LOSE !!!!");
        this.resetGame(bool);
    }
};*/

var Gameover = {
    x: 0,
    y: 0,
    render: function () {
        if (allLife.length === 0) {
            ctx.fillStyle = "#1b1a1a";
            ctx.fillRect(this.x, this.y, 505, 606);
            ctx.font = "50px Comic Sans MS";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Game Over !!!", 505 / 2, 606 / 2);
            ctx.font = "20px Comic Sans MS";
            ctx.fillText("Hit Space Bar to restart the Game", 505 / 2, 350);
        }
    }
};

var gameover = Object.create(Gameover);

/*************************** Winning Game *****************************/

Player.prototype.resetGame = function (bool) {
    if (bool) {
        allLife.push(life1);
        allLife.push(life2);
        allLife.push(life3);
    } else {
        var count = allLife.length;
        var addCount = 3 - count;

        if (addCount === 1) {
            allLife.push(life3);
        } else if (addCount === 2) {
            allLife.push(life2);
            allLife.push(life3);
        }
    }
};

/*************************** Event Listener ****************************/

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'restart'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});