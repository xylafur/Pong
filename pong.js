
  var canvas = document.createElement("canvas"), c = canvas.getContext("2d");
  canvas.width = 800; canvas.height = 400;
  document.body.appendChild(canvas);

  var playerPoints = 0, oponentPoints = 0;

  /****************************************************************************
  * Generic methods:                                                          *
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

        drawEverything()
          Parameters:
            None
          Description:
            Calls the draw function on everything

        drawMiddleLine()
          Parameters:
            None
          Description:
            Draws the white lines signiling the middle of the board.
  ******************************************************************************/
  var drawEverything = function(){
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    drawMiddleLine();
    player.draw();
    enemy.draw();
  }

  var drawMiddleLine = function(){
    c.fillStyle = "white";
    for(var i = 0; i < canvas.height / 10; i++){
      if( i % 3 == 0){
        c.fillRect(canvas.width / 2 + 2, i * 10, 5, 20);
      }
    }
  }

  function Platform(xPos, yPos, inHeight = 50, inWidth = 10){
    this.x = xPos;
    this.y = yPos;
    this.height = inHeight;
    this.width = inWidth;
  }
  Platform.prototype.draw = function(){
    c.fillStyle = "white";
    checkBoundsPlatform(this, canvas);
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  var checkBoundsPlatform = function(platform, canvas){

  }

  setInterval(function(){
    drawEverything();
  }, 30);

  var player = new Platform(50, 50);
  var enemy = new Platform(canvas.width - 50, 50);
