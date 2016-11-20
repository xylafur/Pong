//I don't like code on the first line its to close to the top
  var canvas = document.createElement("canvas"),        //the actual canvas we manipulate
  c = canvas.getContext("2d");                          //used to draw game objects
  canvas.width = 800; canvas.height = 400;              //max size of the canvas
  document.body.appendChild(canvas);                    //pinning this canvas onto the DOM

  var playerPoints = 0, opponentPoints = 0;              //just a score of each players points
  var playerSpeed = 10, enemySpeed = 10,                 //max speed at which players can move
  ballSpeedX = -100, ballSpeedY = 5;                     //speed of the ball in X and Y directions


  var player = new Platform(50, 50);                    //Player platform object (left side)
  var enemy = new Platform(canvas.width - 50, 50);      //Enemy platform object (right side)
  var ball = new Ball();                                //Ball game object that bounces around

  /****************************************************************************
  * Generic functions:                                                        *
  *                                                                           *
  *    checkCollision()                                                       *
  *      Parameters:                                                          *
  *        object1 (platform): First element to check collision against       *
  *        object2 (ball): second element to check collision against          *
  *      Description:                                                         *
  *        return a boolean stating true if the two objects are currently     *
  *        colliding and false otherwise.                                     *
  *                                                                           *
  *    bounceBall()                                                           *
  *      Parameters:                                                          *
  *        platform : either the player or the opponent.                      *
  *        ball: the ball that bounces around.                                *
  *      Description:                                                         *
  *        will set the ball's x velocity to the inverse of what it currently *
  *        is set to and then change the y velocity depending on where it     *
  *        hits the platform at.  (higher to the top or the bottom will       *
  *        result in a higher magnitude)                                      *
  *                                                                           *
  *      moveObject()                                                         *
  *        Parameters:                                                        *
  *          object: what you want to move                                    *
  *          xVeloc: ammount in x to move by                                  *
  *          yVeloc: ammount in y to moce by                                  *
  *        Description:                                                       *
  *          Just a generic move method that will change an object's location *
  *          based on its velocity.                                           *
  *                                                                           *
  *     checkBoundsBall()                                                     *
  *        Parameters:                                                        *
  *          Ball: the object to check if in bounds                           *
  *          canvas: playfield                                                *
  *        Description:                                                       *
  *          Check to see if the ball is outside the edge of the playfield.   *
  *          If it hits an upper or lower bound the y velocity is inversed    *
  *          while if it hits a side edge it will reward a point to either the*
  *          player or to the oponent.                                        *
  *                                                                           *
  *      checkBoundsPlatform()                                                *
  *        Parameters:                                                        *
  *          Platform                                                         *
  *          canvas                                                           *
  *        Description:                                                       *
  *          void method that will keep the player and the oponent in bounds. *
  *          Will be called in the platform object's prototype function to    *
  *            ensure that it never leaves the gamefield.                     *
  *                                                                           *
  *      drawEverything()                                                     *
  *        Parameters:                                                        *
  *          None                                                             *
  *        Description:                                                       *
  *          Calls the draw function on everything                            *
  *                                                                           *
  *      drawMiddleLine()                                                     *
  *        Parameters:                                                        *
  *          None                                                             *
  *        Description:                                                       *
  *          Draws the white lines signiling the middle of the board.         *
  *                                                                           *
  *      enemyAI()                                                            *
  *        Parameters:                                                        *
  *          enemy: the enemy game object platform                            *
  *          ball: the ball game object                                       *
  *        Description:                                                       *
  *          if the ball gets within a certian distance of the enemy it will  *
  *            begin to move in the direction of the ball.                    *
  *
          displayScore()
            Parameters:
              None
            Description:
              Displays the player and the enemy's scores in the corners

          calcCenterY()
            Parameters:
              Platform
            Description:
              returns the center of a platform in Y axis (number from 0 to
                canvas.height)
  ******************************************************************************/

  var drawEverything = function(){
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    drawMiddleLine();
    displayScore();
    enemyAI(enemy, ball);
    checkCollision(player, ball);
    checkCollision(enemy, ball);
    player.draw();
    enemy.draw();
    ball.draw();
  }

  var enemyAI = function(enemy, ball){
    if(ball.x >= 3 * canvas.width / 4){
      //console.log("on enemy side.");
      if(calcCenterY(enemy) > calcCenterY(ball))
        enemy.y -= enemySpeed;
      else if(calcCenterY(enemy) < calcCenterY(ball))
        enemy.y += enemySpeed;
    }
  }

  var drawMiddleLine = function(){
    c.fillStyle = "white";
    //White lines of length 20 are drawn at canvas positions of 45
    for(var i = 0; i < canvas.height / 10; i++)
      if( i % 4 == 0)
        c.fillRect(canvas.width / 2 + 2, i * 10 + 10, 5, 20);
  }

  var checkBoundsPlatform = function(platform, canvas){
    if(platform.y < 0)
      platform.y = 0;
    else if(platform.y >= canvas.height - platform.height)
      platform.y = canvas.height - platform.height;
  }

  var moveObject = function(object, xVeloc, yVeloc){
    object.xVel = xVeloc;
    object.yVel = yVeloc;
    //console.log("moveObject triggered.");
  }

  var checkBoundsBall = function(ball, canvas){
    //hits top
    if(ball.y <= 0)
      ball.yVel = -ball.yVel;
    //hits bottom
    else if(ball.y >= canvas.height - ball.height)
      ball.yVel = -ball.yVel;

    //exits left
    if(ball.x + ball.width <= 0){
      opponentPoints++;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.xVel = 5;
      ball.yVel = 5;
    }
    //exits right
    else if(ball.x >= canvas.width){
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.xVel = -5;
      ball.yVel = -5;
      playerPoints++;
    }
  }

  var checkCollision = function(platform, ball){
    //meaning the ball is coming towards the player
    if(ball.xVel < 0){
      if(platform.x + platform.width >= ball.x && platform.x <= ball.x &&
          ball.y >= platform.y && platform.y  + platform.height  >= ball.y)
        bounceBall(platform, ball);
    }
    else{
      if(platform.x == ball.x + ball.width && ball.y >= platform.y
          && ball.y < platform.y + platform.height)
        bounceBall(platform, ball);
    }
  }

  var bounceBall = function(platform, ball){

    //console.log(Math.abs(calcCenterY(platform) - calcCenterY(ball)));

    //this means that the ball is above the middle
    //  of the platform bc up is 0 and down is positive
    if(calcCenterY(platform) > calcCenterY(ball) ){
      if(Math.abs(calcCenterY(platform) - calcCenterY(ball)) > 30){
        ball.yVel = -15;
      }
      else if(Math.abs(calcCenterY(platform) - calcCenterY(ball)) > 10){
        ball.yVel = -10;
      }
      else{
        ball.yVel = -5;
      }
    }
    else{
      if(Math.abs(calcCenterY(platform) - calcCenterY(ball)) > 30){
        ball.yVel = 15;
      }
      else if(Math.abs(calcCenterY(platform) - calcCenterY(ball)) > 10){
        ball.yVel = 10;
      }
      else{
        ball.yVel = 5;
      }
    }

    ball.xVel = -ball.xVel;
  }

  var calcCenterY = function(platform){
    return platform.y + (platform.height / 2);
  }

  var displayScore = function(){
    c.font = "30px Georgia";
    c.fillText(playerPoints, 10, 30);
    c.fillText(opponentPoints, canvas.width - 50, 30);
  }

  /*******************************************************
  ** Platform object constructor and all of its methods **
  *******************************************************/
  function Platform(xPos, yPos, inHeight = 50, inWidth = 10){
    this.x = xPos;
    this.y = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.height = inHeight;
    this.width = inWidth;
  }
  Platform.prototype.draw = function(){
    c.fillStyle = "white";
    this.updateLocation();
    checkBoundsPlatform(this, canvas);
    c.fillRect(this.x, this.y, this.width, this.height);
  }
  Platform.prototype.updateLocation = function(){
    this.x += this.xVel;
    this.y += this.yVel;
  }

  /*******************************************************
  **   Ball object constructor and all of its methods   **
  *******************************************************/
  function Ball(xPos = canvas.width / 2, yPos = canvas.height / 2, xV = -5, yV = 3, w = 20, h = 20){
    this.x = xPos;
    this.y = yPos;
    this.xVel = xV;
    this.yVel = yV;
    this.width = w;
    this.height = h;
  }
  Ball.prototype.draw = function(){
    c.fillStyle = "white";
    this.updateLocation();
    checkBoundsBall(this, canvas);
    c.fillRect(this.x, this.y, this.width, this.height);
  }
  Ball.prototype.updateLocation = function(){
    this.x += this.xVel;
    this.y += this.yVel;
  }



  /*******************************************************
  **  Event listener functions (for player movement)    **
  *******************************************************/
  document.addEventListener('keydown', function(event){
    //console.log("Keydown event triggered with keycode: " + event.keyCode);
    //up arrow
    //top of the canvas is 0 so we subtract speed to move up
    if(event.keyCode == 38)
      moveObject(player, 0, -playerSpeed);
    //down arrow
    //bottom of canvas if canvas.height so we add to move down
    else if(event.keyCode == 40)
      moveObject(player, 0, playerSpeed);
  });
  document.addEventListener('keyup', function(event){
    moveObject(player, 0, 0);
  });


  //set interval is a function that triggers a function every set ammount of seconds
  setInterval(function(){
    drawEverything();
  }, 30);
