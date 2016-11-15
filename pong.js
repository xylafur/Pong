
  var canvas = document.createElement("canvas"), c = canvas.getContext("2d");
  canvas.width = 800; canvas.height = 400;
  document.body.appendChild(canvas);

  var playerPoints = 0, oponentPoints = 0;
  var playerSpeed = 10, ballSpeedX = -10, ballSpeedY = 5;


  var player = new Platform(50, 50);
  var enemy = new Platform(canvas.width - 50, 50);
  var ball = new Ball();

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

  ******************************************************************************/

  var drawEverything = function(){
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    drawMiddleLine();
    checkCollision(player, ball);
    checkCollision(enemy, ball);
    player.draw();
    enemy.draw();
    ball.draw();
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
    if(ball.y <= 0)
      ball.yVel = -ball.yVel;
    else if(ball.y >= canvas.height - ball.height)
      ball.yVel = -ball.yVel;
  }

  var checkCollision = function(platform, ball){
    //meaning the ball is coming towards the player
    if(ball.xVel < 0){
      if(platform.x + platform.width >= ball.x && platform.x <= ball.x &&
          ball.y >= platform.y && platform.y  + platform.height  >= ball.y)
        ball.xVel = -ball.xVel;
    }
    else{
      if(platform.x == ball.x + ball.width)
        ball.xVel = -ball.xVel;
    }
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
