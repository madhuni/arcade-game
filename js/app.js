/* implementing function to draw the boxes over the objects in game board */
function drawBox(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
};

/*********************** Enemies *****************************/

var Enemy = function (x, y) {

    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = this.randomSpeed(50, 250);
    this.width = 100;
    this.height = 67;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
        this.x = 0;
    }
    /*this.checkCollisionsBugs();*/
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    drawBox(this.x, this.y + 77, 101, 67, "yellow");
};

// Creating the function which will return random speeds for the enemy object

Enemy.prototype.randomSpeed = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
};

/*********************** Player ******************************/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (speed) {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.width = 70;
    this.height = 75;
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    drawBox(this.x + 17, this.y + 63, 70, 75, "blue");
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
        this.reset();
        console.log('You WON !!!!');
    }

    /* Invoking the collison detection function */

    this.checkCollisionsBugs();
};

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
};

Player.prototype.reset = function () {

    this.x = 202;
    this.y = 400;
};

/* Creating the Collision Detection function for player */
Player.prototype.checkCollisionsBugs = function () {

    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        if (this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.height + this.y > enemy.y) {
            // collision detected!
            console.log('Collision detected !!!');
            player.reset();
        }
    }
};

// Initializing the "allEnemies" array. It will consist of all the enemies objects.
var allEnemies = [];

allEnemies.push(new Enemy(-300, 60));
allEnemies.push(new Enemy(-200, 145));
allEnemies.push(new Enemy(-100, 230));
allEnemies.push(new Enemy(-400, 60));
allEnemies.push(new Enemy(-250, 145));
allEnemies.push(new Enemy(-350, 230));
allEnemies.push(new Enemy(-350, 315));

/* creating the 'player' object */
var player = new Player();
 
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});