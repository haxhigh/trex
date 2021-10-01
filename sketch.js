//declaring variables 
var trex, trexImg, tc;
var ground, groundImg;
var invisibleGround;
var cloud, cloudImg, cloudsGroup;
var obstacle;
var ob1, ob2, ob3, ob4, ob5, ob6, obstaclesGroup;
var die,jump,checkpoint;

var gameOver,restart,gameOverImg,restartImg;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;

//loading images and animations and sounds
function preload() {
    trexImg = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    groundImg = loadImage("ground2.png");
    cloudImg = loadImage("cloud.png");
    ob1 = loadImage("obstacle1.png");
    ob2 = loadImage("obstacle2.png");
    ob3 = loadImage("obstacle3.png");
    ob4 = loadImage("obstacle4.png");
    ob5 = loadImage("obstacle5.png");
    ob6 = loadImage("obstacle6.png");
    tc = loadAnimation("trex_collided.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    die = loadSound("die.mp3");
    checkpoint = loadSound("checkpoint.mp3");
    jump = loadSound("jump.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    //creating t-rex
    trex = createSprite(50, height-120, 20, 50);
    trex.addAnimation("rex", trexImg);
    trex.addAnimation("trexc",tc);
    trex.scale = 0.6;

    //Game over
    gameOver = createSprite(width/2,height/2-40,40,40);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 1;

    //Restart
    restart = createSprite(width/2,height/2,30,30);
    restart.addImage(restartImg);
    restart.scale = 0.6

    //creating ground
    ground = createSprite(width/2,height-10, width, 20);
    ground.addImage("g", groundImg);

    //creating invisible ground for debuging
    invisibleGround = createSprite(width/2, height-10, width, 10);
    invisibleGround.visible = false;

    var randomnumber = Math.round(random(10, 14));
    console.log(randomnumber);

    cloudsGroup = new Group();
    obstaclesGroup = new Group();


}


function draw() {
    background("white");

    //trex.debug = true
    trex.setCollider("circle", 0, 0, 30);
    // trex.setCollider("rectangle",0,0,200,trex.height);

    if (gameState == PLAY) {
        //making t-rex jump
        if (touches.length>0||keyDown("space") && trex.y > height-60) {
            trex.velocityY = -10;
            jump.play();
            touches = [];
        }

        trex.velocityY = trex.velocityY + 0.5; //applying gravity

        //making ground move 
        ground.velocityX = -2;

        //making ground infinite 
        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        if (frameCount % 60 == 0) {
            spawnClouds();
        }

        if (frameCount % 130 == 0) {
            spawnObstacles();
        }

        if (trex.isTouching(obstaclesGroup)) {
            gameState = END;
            die.play();
        }
        /*if (trex.isTouching(obstaclesGroup)){
                trex.velocityY = -12;
        }
        trex.velocityY = trex.velocityY + 0.5; //applying gravity
        */
        //addingScore
        score = score + Math.round(frameCount / 60);
        if(score>0 && score%100 == 0){
            checkpoint.play();
        }

        restart.visible = false;
        gameOver.visible = false;

    } else if (gameState == END) {
        ground.velocityX = 0;
        cloudsGroup.setVelocityXEach(0);
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1);
        obstaclesGroup.setLifetimeEach(-1);
        trex.changeAnimation("trexc");
        restart.visible = true;
        gameOver.visible = true;
        if(mousePressedOver(restart)){
            restart2();
        }
    }
    //collding with invisible ground
    trex.collide(invisibleGround);
    drawSprites();
    text("Score: " + score, width-60, 50);

}

function spawnObstacles() {
    obstacle = createSprite(600, height-25, 40, 10);
    var r = Math.round(random(1, 6));
    switch (r) {
        case 1:
            obstacle.addImage(ob1);
            break
        case 2:
            obstacle.addImage(ob2);
            break
        case 3:
            obstacle.addImage(ob3);
            break
        case 4:
            obstacle.addImage(ob4);
            break
        case 5:
            obstacle.addImage(ob5);
            break
        case 6:
            obstacle.addImage(ob6);
            break
    }
    obstacle.scale = 0.5;
    obstacle.velocityX = -3;
    obstacle.lifetime = -width/obstacle.velocityX;
    obstaclesGroup.add(obstacle);
}


function spawnClouds() {
    cloud = createSprite(width, height-300, 20, 30);
    cloud.y = Math.round(random(10, 60));
    cloud.scale = 0.6;
    cloud.addImage(cloudImg);
    cloud.velocityX = -3;
    cloud.depth = trex.depth;
    trex.depth += 1;
    console.log("t" + trex.depth);
    console.log("c" + cloud.depth);
    cloud.lifetime = -width/cloud.velocityX;
    cloudsGroup.add(cloud);
}

function restart2(){
    score = 0;
    //console.log("ok")
    gameState = PLAY;
    restart.visible = false;
    gameOver.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.changeAnimation("rex");
}