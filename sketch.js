let player;
let mover;
let gravity;
let jetpack;
let flames = false;
let dragConstant = 0.001;
let drag;
let speed = 0.2;
let lasers = [];
let rain = [];
let minutes;
let seconds;
let playerImage;
let invincible = false;
let oneUp = false;
let health = 3;
let gameOver = false;
let img1, img2, img3, img4, bgImage;
let locationOne, locationTwo;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let playerScore;
let isPaused = false;
let totalPauseDuration = 0;
let pauseStartTime = 0;
let actualGameTimer = 0;
let laserDelay;
let lastLaserTime = 0;
let lastRainTime = 0;


function preload() {
    img1 = "images/normalBarry.jpg";
    img2 = "images/crazyBarry.jpg";
    img3 = "images/runningBarry.jpg";
    img4 = "images/scaredBarry.jpg";
    bgImage = loadImage("images/background.jpg");
}

function setup() {
    localStorage.clear(); //Clears the localstorage, and hence the leaderboard.
    let canvas = createCanvas(800, 800);
    canvas.parent("canvas-container");
    locationOne = 0;
    locationTwo = width;

    //If a skin has been selected, load it, else load default.
    if (localStorage.getItem("skin")) {
        playerImage = loadImage(localStorage.getItem("skin"));
    }
    else {
        playerImage = loadImage(img1);
    }

    let btn1 = document.getElementById("myBtn1");
    let btn2 = document.getElementById("myBtn2");
    let btn3 = document.getElementById("myBtn3");
    let btn4 = document.getElementById("myBtn4");

    btn1.addEventListener("click", () => {
        playerImage = loadImage(img1);
        localStorage.setItem("skin", "images/normalBarry.jpg");
    });
    btn2.addEventListener("click", () => {
        playerImage = loadImage(img2);
        localStorage.setItem("skin", "images/crazyBarry.jpg");
    });
    btn3.addEventListener("click", () => {
        playerImage = loadImage(img3);
        localStorage.setItem("skin", "images/runningBarry.jpg");
    });
    btn4.addEventListener("click", () => {
        playerImage = loadImage(img4);
        localStorage.setItem("skin", "images/scaredBarry.jpg");
    });


    angleMode(DEGREES);
    ellipseMode(CENTER)

    gravity = createVector(0, 0.3);
    jetpack = createVector(0, -0.55);

    mover = new Mover();

    console.log("function has been setup!");
}

function draw() {
    // background(122);
    image(bgImage, locationOne, 0, width, height);
    image(bgImage, locationTwo, 0, width, height);
    locationOne -= 2;
    locationTwo -= 2;
    if (locationOne < -width) {
        locationOne = width;
    }
    if (locationTwo < -width) {
        locationTwo = width;
    }


    renderLeaderboard();
    minutes = floor(actualGameTimer / 60);
    seconds = floor(actualGameTimer % 60);

    if (actualGameTimer < 8) {
        laserDelay = 0.3;
    }
    else if (actualGameTimer < 14) {
        laserDelay = 0.2;
    }
    else if (actualGameTimer < 20) {
        laserDelay = 0.1;
    }
    else if (actualGameTimer < 30) {
        laserDelay = 0.06;
    }
    else {
        laserDelay = 0.03;
    }
    spawnLaser(laserDelay);
    if (actualGameTimer > 5) {
        spawnRain(1);
    }

    //Draws hearts.
    let heartSize = 30;
    for (let i = 0; i < health; i++) {
        let x = width - (heartSize + 10) * (i + 1); // Move left from the right edge
        let y = 25; // Keep hearts at the top
    
        drawHeart(x, y, heartSize);
    }

    //Draws "PAUSED" when game is paused.
    if (isPaused) {
        textAlign(CENTER);
        textSize(50);
        fill(0, 255, 0);
        text("PAUSED", width/2, 60);
    }
    //Understanding the timer. Imagine a stopwatch.
    //You press start at 0 seconds.
    //After 5 seconds, you press pause.
    //You wait around for a bit (let’s say 3 seconds), then press resume.
    //The stopwatch doesn’t count the 3 seconds you were paused — it just picks up from 5 and keeps going.
    //So the time on the stopwatch would be the total time you were holding the stopwatch minus the time you had it paused.
    if (!isPaused) {
        //Timer = time now - totalPauseDuration => into seconds.
        actualGameTimer = (millis() - totalPauseDuration) / 1000;
    }

    //Draws timer.
    textSize(24);
    textAlign(LEFT)
    fill(255);
    text(nf(minutes, 2) + ":" + nf(seconds, 2), 30, 45);

    lasers.forEach((laser, index) => {
        laser.move();
        laser.show();

        if (laser.x < -10) {
            lasers.splice(index, 1);
        };

        if (collideRectRect(laser.x, laser.y, laser.width, laser.height, mover.pos.x, mover.pos.y, mover.width, mover.height) && !invincible) {
            invincible = true;
            health -= 1;
            //Wait 1 seconds then turn invincibility off.
            setTimeout(() => {
                invincible = false;
            }, 1000);
        };
    });

    rain.forEach((drop, index) => {
        drop.move();
        drop.show();

        if (drop.y > height) {
            rain.splice(index, 1);
        };

        if (collideRectRect(drop.x, drop.y, drop.width, drop.height, mover.pos.x, mover.pos.y, mover.width, mover.height) && !oneUp) {
            if (health < 3) {
                health += 1;
            }
            rain.splice(index, 1);
            oneUp = true;
            setTimeout(() => {
                oneUp = false;
            }, 200);
        };
    });

    drag = mover.vel.copy();
    drag.normalize(); //sets mag to 1, AKA a unit vector.
    drag.mult(-dragConstant * mover.vel.magSq());
    let rightForce = createVector(cos(0) * speed, sin(0) * speed);
    let leftForce = createVector(cos(180) * speed, sin(180) * speed);
    mover.applyForce(gravity);
    mover.applyForce(drag);

    mover.update();
    mover.display();
    mover.checkEdges();


    //65 is the keycode for the "a" key
    if (keyIsDown(65)) {
        mover.applyForce(leftForce);
    }

    //68 is the keycode for the "d" key
    if (keyIsDown(68)) {
        mover.applyForce(rightForce);
    }

    //32 is the keycode for the spacebar
    if (keyIsDown(32)) {
        flames = true;
        mover.applyForce(jetpack);
    }
    else {
        flames = false;
    }

    if (health == 0 && !gameOver) {
        gameOver = true;

        playerScore = actualGameTimer;
        submitScore();

        location.reload();
    }
}

function keyPressed() {
    //27 is keycode for the Escape button.
    if (keyCode === 27) {
        if (!isPaused) {
            isPaused = true;
            pauseStartTime = millis();
            noLoop();
        }
        else if (isPaused) {
            isPaused = false;
            let pausedDuration = millis() - pauseStartTime;
            totalPauseDuration = totalPauseDuration + pausedDuration;
            loop();
        }
    }
}






//Functions
function submitScore() {
    let username;
    if (leaderboard.length < 3 || playerScore > leaderboard[2].score) {
        username = prompt("Enter your Username: ");
        //If username is blank or the prompt is cancelled, username is set to "Anonymous".
        if (username == null || username.trim() == "") {
            username = "Anonymous";
        };
        leaderboard.push({name: username, score: playerScore});
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 3);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
}

function renderLeaderboard() {
    let leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = "";
    leaderboard.forEach((score, index) => {
    leaderboardDiv.innerHTML += index + 1 + ": " + score.name + " - " + score.score + "</br>";
    });
}

function spawnLaser(delay) {
    if (actualGameTimer - lastLaserTime > delay) {
        lasers.push(new Laser());
        lastLaserTime = actualGameTimer;
    }
}

function spawnRain(delay) {
    if (actualGameTimer - lastRainTime > delay) {
        rain.push(new Rain());
        lastRainTime = actualGameTimer;
    }
}

function drawHeart(x, y, size) {
    fill(255, 0, 0); // Red color for the heart
    
    // Heart shape using two triangles and a circle (to form the heart shape)
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 2, x, y + size);
    bezierVertex(x + size, y + size / 2, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
  }

