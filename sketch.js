//reference from ChatGPT
let gameState = "start"; // start, characterSelect, settingSelect, fighting, gameOver
let selectedCharacter = null;
let selectedSetting = null;
let player1, player2; // Characters
let winner = null;
let myFont1,myFont2;
let sound1,sound2,sound3,sound4,sound5;
let player1Shield = false;
let player2Shield = false; 

function preload() {
  img1 = loadImage('standpose_panda.gif'); 
  img2 = loadImage('standpose_cat.gif'); 
  panda = loadImage('panda.png');
  cat = loadImage('cat.png');
  pandakey = loadImage('pandakey.png');
  catkey = loadImage('catkey.png');
  punch = loadImage('catpunch.png');
  desert = loadImage('desert.jpg');
  forest = loadImage('forest.jpg');
  key12 = loadImage('key12.png');
  keynm = loadImage('keynm.png');
  pandafart = loadImage('fart.png');
  myFont1=loadFont("PublicPixel.ttf");
  myFont2=loadFont("nokiafc22.ttf"); //or try out Fipps-Regular.otf
  sound1 = loadSound("jump.wav");
  sound2 = loadSound("adventure.wav");
  sound3 = loadSound("fart.wav");
  sound4 = loadSound("hit.wav");
  sound5 = loadSound("win.wav");
}

function setup() {
  let canvas=createCanvas(800, 600);
  canvas.parent('fight'); 
}

function draw() {
  background(212, 234, 208);

  if (gameState === "start") {
    showStartScreen();
  } else if (gameState === "characterSelect") {
    showCharacterSelection();
  } else if (gameState === "settingSelect") {
    showSettingSelection();
  } else if (gameState === "fighting") {
    fight();
  } else if (gameState === "gameOver") {
    showGameOver();
  }
}

function showStartScreen() {
  textAlign(CENTER);
  textSize(90);
  textFont(myFont2);
  text("AniFighterz", width / 2, height / 2 - 50);
  textSize(25);
  textFont(myFont1);
  text("Press ENTER to start", width / 2, height / 2 +50);
  textSize(10);
  text("By Yanyan Li, Lihua Lei, Joel CD", width / 2, height / 2 +100);
  
  if (keyIsPressed && keyCode === ENTER) {
    sound1.play();
    gameState = "characterSelect";
  }
}

function showCharacterSelection() {
  textAlign(CENTER);
  textSize(50);
  textFont(myFont2);
  text("Select the Player", width / 2, 100);
  textFont(myFont1);
  textSize(15);
  text("Remember! Shield can be used only ONCE!", width / 2, 500);
  image(panda, 180, 150, 120, 120);
  image(cat, 480, 150, 120, 115);
  image(pandakey, 190, 260, 120, 120);
  image(catkey, 490, 260, 120, 120);
  image(key12, 190, 370, 60, 80);
  image(keynm, 490,370,60,80);
  text("Punch", 290,400);
  text("Punch", 590,400);
  text("Shield", 600,440);
  text("Shield", 300,440);
  textSize(30);
  text("Press SPACE to go next", width / 2, 550);

  if (keyIsPressed && key === ' ') {
    sound1.play();
      gameState = "settingSelect";
    }
}

function showSettingSelection() {
  textAlign(CENTER);
  textSize(50);
  textFont(myFont2);
  text("Select the Setting", width / 2, 200);
  textSize(30);
  textFont(myFont1);
  text("Forest (Press f)", width / 2, 300);
  text("Barren (Press b)", width / 2, 400);

  if (keyIsPressed && key === 'f') {
    sound1.play();
    selectedSetting = "forest";
    startFight(true); 
  }
  if (keyIsPressed && key === 'b') {
    sound1.play();
    selectedSetting = "desert";
    startFight(true); 
  }
}

function startFight(ai) {
  player1 = new Fighter1(100, height - 300, img1);
  player2 = new Fighter2(width - 300, height - 300, img2);
  gameState = "fighting";
  sound2.loop();
  sound2.setVolume(0.5);
  sound2.play();
}

function fight() {
  if (selectedSetting === "forest") {
    image(forest, 0, 0, 800, 600);
  } else if (selectedSetting === "desert") {
    image(desert, 0, 0, 800, 600);
  }

  player1.display();
  player2.display();
  player1.handleInput(); // Fighter1 movement and actions
  player2.handleInput(); // Fighter2 movement and actions
  drawHealthBars();
  
  if (checkForWin()) {
    sound5.play();
    sound2.stop();
    gameState = "gameOver";
  }
}

function checkForWin() {
  if (player1.health <= 0) {
    winner = player2;
    return true;
  } else if (player2.health <= 0) {
    winner = player1;
    return true;
  }
  return false;
}

function showGameOver() {
  textAlign(CENTER);
  textSize(32);
  if (winner === player1) {
    text("Player 1 Wins!", width / 2, height / 2);
  } else {
    text("Player 2 Wins!", width / 2, height / 2);
  }
  text("Press r to restart", width / 2, height / 2 + 100);

  if (keyIsPressed && key === 'r') {
    gameState = "start"; // Restart the game
  }
}

function drawHealthBars() {
  image(panda, width / 2 - 130, 40, 60, 60);
  image(cat, width / 2 + 70, 40, 60, 60);
  push();
  fill(255, 0, 0);
  rect(50, 50, player1.health * 2, 20); // Player 1 Health bar
  fill(255, 0, 0);
  rect(width - 250, 50, player2.health * 2, 20); // Player 2 Health bar
  pop();
}

class Fighter1 {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.shieldHealth = 50;
    this.s = 30;
    this.width = 200;
    this.height = 200;
    this.img = img;
    this.jumping = false;
    this.velocityY = 0;
  }

  display() {
     if (keyIsDown(49)) { 
       image(this.img,1000,1000);
     }else{
       image(this.img, this.x, this.y, this.width, this.height);
    this.x = constrain(this.x, 0, width-this.width);
    }
  }

  handleInput() {
    // Fighter1 Controls - WAD
    if (keyIsDown(65)) this.x -= 5; // A key
    if (keyIsDown(68)) this.x += 5; // D key
    if (keyIsDown(87) && !this.jumping) { // W key (Jump)
      sound1.play();
      this.jumping = true;
      this.velocityY = -14; // Initial jump velocity
    }
    if (this.jumping) {
      this.y += this.velocityY;
      this.velocityY += 0.5; // Gravity
      if (this.y >= height - 300) { // Ground level
        this.y = height - 300; // Reset position to ground
        this.jumping = false;
      }
    }

    this.punch(player2);
    this.shield();
  }

  punch(object) {
    let d = dist(this.x + 40, this.y, object.x, object.y);
    if (keyIsDown(49)) {  // 1 key
      sound3.play();
      push();
      scale(-1, 1);
      image(pandafart, -this.x-200, this.y, -this.width, this.height);
      pop();
      if (d < 80 && d > 0 && player2Shield == false) {
        object.takeDamage(0.5);
      } else if (this.shieldHealth <100 && d < 80 && d > 0 && player2Shield == true){
        object.shieldHeal(0.4);
      }
    }
  }

  shield() {
    if (this.shieldHealth > 0 && keyIsDown(50)) {  // 2 key for shield
      player1Shield = true;
      push();
      fill(0, 0, 255, 100);
      rect(this.x+100, this.y, this.width-100, this.height);
      this.shieldHealth --; // Shield only shows for 3 sec
      pop();
    } else {
      player1Shield = false;
    } 
  }

  takeDamage(damage) {
    this.health -= damage;
  }
  
  shieldHeal(damage){
    this.health += damage;
  }
}

class Fighter2 {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.shieldHealth = 50;
    this.s = 70; // Width of the punch
    this.width = 200;
    this.height = 200;
    this.img = img;
    this.jumping = false;
    this.velocityY = 0;
  }

  display() {
    image(this.img, this.x, this.y, this.width, this.height);
    this.x = constrain(this.x, 0, width-this.width);
  }

  handleInput() {
    // Fighter2 Controls - Arrow Keys
    if (keyIsDown(LEFT_ARROW)) this.x -= 5; // Move left
    if (keyIsDown(RIGHT_ARROW)) this.x += 5; // Move right
    if (keyIsDown(UP_ARROW) && !this.jumping) { // Jump
      sound1.play();
      this.jumping = true;
      this.velocityY = -14; // Initial jump velocity
    }

    // Handle jump physics
    if (this.jumping) {
      this.y += this.velocityY;
      this.velocityY += 0.5; // Gravity effect
      if (this.y >= height - 300) { // Ground level
        this.y = height - 300; // Reset position to ground
        this.jumping = false;
      }
    }

    this.punch(player1); // Check if Fighter2 punches
    this.shield(); // Check if Fighter2 activates shield
  }

  punch(object) {
    let d = dist(this.x + 40, this.y, object.x, object.y); // Adjusted for punch position

    if (keyIsDown(78)) {  // 'N' key for punch
      image(punch,this.x, this.y + 40, this.s, this.s); 
      if (d < 150 && d > 100 && player1Shield == false) {
        sound4.play();
        object.takeDamage(0.5);
      } else if (this.shieldHealth <100 && d < 150 && d > 100 && player1Shield == true){
        object.shieldHeal(0.4);
      }
    }
  }

  shield() {
    if (this.shieldHealth > 0 && keyIsDown(77)) {  // 'M' key for shield
      player2Shield = true;
      push();
      fill(0, 0, 255, 100);
      rect(this.x, this.y, this.width-100, this.height); // Draw shield hitbox
      this.shieldHealth --; // Shield only shows for 3 sec
      pop();
    }else {
      player2Shield = false; 
    }
}

  takeDamage(damage) {
    this.health -= damage;
  }
  
    shieldHeal(damage){
    this.health += damage;
  }
}