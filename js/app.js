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
    this.speed = this.randomSpeed(150, 250);
    this.width = 80;
    this.height = 67;
};

var Enemy1 = function (x, y) {
    this.sprite = 'images/enemy-bug-revert.png';
    this.x = x;
    this.y = y;
    this.speed = this.randomSpeed(200, 250);
    this.width = 80;
    this.height = 67;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
        this.x = -100;
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

// making enemy type 2
Enemy1.prototype.update = function (dt) {
    this.x = this.x - this.speed * dt;
    if (this.x < -100) {
        this.x = 600;
    }
};

// Draw the enemy on the screen, required method for game
Enemy1.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // drawBox(this.x, this.y + 77, 101, 67, "yellow");
};

// Creating the function which will return random speeds for the enemy object
Enemy1.prototype.randomSpeed = function (min, max) {
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
    this.winGame = false;
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    drawBox(this.x + 17, this.y + 63, 66, 75, "blue");
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

    if (this.y < 60 ) {
        if (key.length === 0) {
            this.winGame = true;
            this.resetPosition(); // resetting the position of the player
        }
        
        this.previousPosition();
        
        // this.resetGame(false); // resetting the game
        // alert('Congratulation !!! You Beat the Bugs !!!');
    }

    /* Invoking the collison detection function */
    this.checkCollisionsBugs();

    // Checking the collision with Rock
    this.checkCollisionsRock();

    // Checking the collision with Key
    this.checkCollisionKey();
};

// Event Listner function for player
Player.prototype.handleInput = function (key) {

    this.savePosition();

    switch (key) {
    case 'left':
        this.x -= 101;
        break;
    case 'right':
        this.x += 101;
        break;
    case 'up':
        this.y -= 85;
        break;
    case 'down':
        this.y += 85;
        break;
    case 'restart':
        location.reload();
        break;
    }
};

// This function will reset the position of the player.
Player.prototype.resetPosition = function () {
    this.x = 202;
    this.y = 400;
};

// Creating a function to check the pervious position of the player
Player.prototype.savePosition = function () {
    X = this.x;
    Y = this.y
};

Player.prototype.previousPosition = function () {
    this.x = X;
    this.y = Y;
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

// Player colliding with Rock
Player.prototype.checkCollisionsRock = function () {
    if (this.x < rock.x + rock.width &&
        this.x + this.width > rock.x &&
        this.y < rock.y + rock.height &&
        this.height + this.y > rock.y) {

        this.previousPosition();
    }
};

// Player colliding with Key
Player.prototype.checkCollisionKey = function () {
    for (var i = 0; i < key.length; i++) {
        var keyValue = key[i];

        if (this.x < keyValue.x + keyValue.width &&
            this.x + this.width > keyValue.x &&
            this.y < keyValue.y + keyValue.height &&
            this.height + this.y > keyValue.y) {

            console.log("Player collide with the key");
            // Removing the key when the player collide with the key
            key.splice(key.length - 1, 1);
        }
    }
};

/************************** Items and Obstacles **************************************/
var Rock = {
    sprite: 'images/Rock.png',
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    render: function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        drawBox(this.x + 7, this.y + 67, 87, 87, "red");
    }
};

var rock = Object.create(Rock);
rock.x = 101;
rock.y = 400;

var Key = {
    sprite: 'images/Key.png',
    x: 0,
    y: 410,
    width: 50,
    height: 50,
    render: function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        drawBox(this.x + 31, this.y + 58, 42, 83, "black");
    }
};

var key = [Object.create(Key)];

/************************** Enemy and Player initialization **************************/

var allEnemies = [];

allEnemies.push(new Enemy(-5, 60));
allEnemies.push(new Enemy(-5, 230));
allEnemies.push(new Enemy(-400, 60));
allEnemies.push(new Enemy(-350, 230));
// allEnemies.push(new Enemy(-350, 315));
allEnemies.push(new Enemy1(300, 145));
allEnemies.push(new Enemy1(100, 145));

// creating the 'player' object 
var player = new Player();

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
            ctx.fillText( "Game Over !!!", 505 / 2, 606 / 2);
            ctx.font = "20px Comic Sans MS";
            ctx.fillText("Hit Space Bar to restart the Game", 505 / 2, 350);
        }
    }
};

var gameover = Object.create(Gameover);

/*************************** Winning Game *****************************/

var Wingame = {
    x: 0,
    y: 0,
    render: function () {
        if (player.winGame) {
            ctx.fillStyle = "#1b1a1a";
            ctx.fillRect(this.x, this.y, 505, 606);
            ctx.font = "50px Comic Sans MS";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Congratulation !!!", 505 / 2, 606 / 2);
            ctx.font = "20px Comic Sans MS";
            ctx.fillText("You beat the bugs !!! Press spacebar to play again", 505 / 2, 350);
        }
    }
};

var wingame = Object.create(Wingame);

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