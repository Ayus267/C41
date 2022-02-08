class Game {
  constructor() { 
    this.resetTitle = createElement("h2");  //All these are the properties of the class
    this.resetButton = createButton(""); 
    this.leadeboardTitle = createElement("h2"); 
    this.leader1 = createElement("h2"); 
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref('gameState');
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    form = new Form();
    form.display();

    player = new Player();
    player.getCount();

    car1 = createSprite(width / 2 - 100, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.05;

    car2 = createSprite(width / 2 + 100, height - 100);    //error
    car2.addImage("car2", car2_img);
    car2.scale = 0.05;

    cars = [car1, car2];
     
    var fuels = new Group ();
    var powerCoins = new Group();
    var obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.addSprites(fuels,4,fuelImage,0.02);
    this.addSprites(powerCoins,20,powercoinImage,0.09);
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
  }

  addSprites(spriteGroup,numberofSprites,spriteImage,scale,positions=[]) {
    for(var i=0;i<numberofSprites;i++){

    if(positions.length>0){
     x=positions[i].x;  //For obstacles we are getting x and y value fromt the obstaclesPositions array
     y=positions[i].y; 
   }
   else{
    var x=random(width/2+150,width/2-150); //For fuels and powercoins
    var y=random(-height*4.5,height-400);
   }

    var sprite1=createSprite(x,y);
    sprite1.addImage("sprite",spriteImage);
    sprite1.scale=0.05;
    spriteGroup.add(sprite1);    
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset"); 
    this.resetTitle.class("resetText"); 
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton"); 
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard"); 
    this.leadeboardTitle.class("resetText"); 
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText"); 
    this.leader1.position(width / 3 - 50, 80); 

    this.leader2.class("leadersText"); 
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers != undefined) {
      image(track_img, 0, -height * 5, width, height * 6);
      this.showFuelBar();
      this.showLife();
      this.showLeaderboard();

      var index = 0;

      for (var plr in allPlayers) {
        index = index + 1;
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }
      this.handlePlayerControls();

      const finishLine=height*6-100;

      if(player.positionY>finishLine){
        gameState = 2,
        player.rank = player.rank+1;
        player.updateCarsAtEnd(player.rank);
        player.update();
        //this.showRank();
      }

      drawSprites();                             
    }
  }                                              

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
  }

  handleResetButton(){
    this.resetButton.mousePressed(
     () =>{
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
     }
    );
  }

  showLeaderboard(){
    var leader1,leader2;
    var players = Object.values(allPlayers);
    //console.log(players);

    if ((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1 ) {  
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score; 
  }

  if (players[1].rank === 1) { 
    leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
   }

   this.leader1.html(leader1); 
   this.leader2.html(leader2);
 }

   showRank(){
    swal(
      {
        title: `Awesome!!!`,
        text: "You have completed the Game!!",
        // imageUrl:"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/reset.png",
        // imageSize: "150x150",
        confirmButtonText: "Play Again"
      },
     );
    }

    showLife() { 
      push(); 
      image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20); 
      fill("white"); rect(width / 2 - 100, height - player.positionY - 400, 185, 20); 
      fill("#f50057"); rect(width / 2 - 100, height - player.positionY - 400, player.life, 20); 
      noStroke(); 
      pop(); 
  }

  showFuelBar() { 
    push(); 
    image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20); 
    fill("white"); rect(width / 2 - 100, height - player.positionY - 350, 185, 20); 
    fill("#ffc400"); rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20); 
    noStroke(); 
    pop(); 
  }

  gameOver() {
    swal(
      {
        title: `Oops!! You lost the game`,
        text: "Chal Nikal !",
        // imageUrl:"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/reset.png",
        // imageSize: "150x150",
        confirmButtonText: "Play Again"
      }
     );
  }
}