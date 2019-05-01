//NEEDS
//Firebase link for instantaneous communication between computers, Jquery link
//Rock Paper Scissors Logic
//Character Select, Similar to the logic done in smash javascript project.
//Many of these variables are going to need to be constantly tranferred between firebase and back.
//Including: player move selection player slots, tracking for wins and losses for the current players. 
//Variables needed: Player slot full (One for each player), variables for players choices, (This will be best to put in a player object), Win and loss counter for each player
//BONUS: Try a chat box, as well as player names.
//The names can be asked for displayed in chat and above player box. 
//SUPER BONUS:Have the database act like smash ultimate arena, loser goes out you can have more than two players.




//LEFT TO DO!!!!!!!!!!!!!!!!
    //Add firebase support only loading data in. DOOOONE
    //Fix picture timing (for rock display) DONE
    //find an ez way to reset in use if a player leaves. Hard reset button is an ok solution


    //Pictures need to load after you a game finishes on the second screen OK!######################
    //Have names disappear after A player is done choosing DONE!!!!!######################
    //Have the other players buttons dissappear. (done locally after logging in)######################
    //add a leave function, that resets one of the players to default#######################
    //Adda a win tracker to the player cards.#############

    //Small bug sometimes player 2 choice doesnt reset.
    //Add a chatbox!
    
//-----------------------------------------------------------Firebase Link--------------------------------------------------------------------------------
 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyC3G5sFPVs0NpeS9dDHDUuVKAehgL4ETrc",
    authDomain: "rockpaperscissorslive.firebaseapp.com",
    databaseURL: "https://rockpaperscissorslive.firebaseio.com",
    projectId: "rockpaperscissorslive",
    storageBucket: "rockpaperscissorslive.appspot.com",
    messagingSenderId: "899919827359"
  };
  firebase.initializeApp(config);

  
//-------------------------------------------------variables---------------------------------------------------------------------------

//These are the player variables, this will store their name and move. The ready variable should be set to true when an option has been selected!
var playerOne = {name: "",
                move: "missing",
                inUse: false,
                local: false,
                ready: false,
                wins: 0,
                losses: 0,
                chat: ""}

var playerTwo = {name: "",
                move: "no.",
                inUse: false,
                local: false,
                ready: false,
                wins: 0,
                losses: 0,
                chat: ""}

//This is the image variable for easier image swapping!

var images = {
    waiting: "assets/images/waiting.gif",
    ready : "assets/images/ready.png",
    rock : "assets/images/rock.png",
    scissors : "assets/images/scissors.png",
    paper : "assets/images/paper.png",
    thinking : ["assets/images/thinking0.png","assets/images/thinking1.gif","assets/images/thinking2.gif","assets/images/thinking3.gif","assets/images/thinking4.gif"]
}
//These variables will be stored in the browser only! and will allow the buttons to show up on only the screen that they are needed! If one of these is set to local the other buttons should always be hidden!
var playerOneLocal = false;
var playerTwoLocal = false;
var show = "show";
var hide = "hide";
//Database Ref
var database = firebase.database();

var totalWins = 0;
var localChat = "";

//----------------------------------------------------------Functions that save to database and load-----------------------------------------------------

function allSave(){
    playerOneSave();
    playerTwoSave();
}

function playerOneSave(){
    database.ref().update({
        playerOne : playerOne,
    })
}

function playerTwoSave(){
    database.ref().update({
        playerTwo : playerTwo,
    })
}


//-----------------------------------------------------------Function to show and hide--------------------------------------------------------------------

//These function hide the user name storage.
function userNameOne(arg){
    if (arg === show){
        $(".playeronelogin").show();
        //console.log(arg)
            //console.log("show in")
    }
        if (arg === hide){
           // console.log(arg)
            //onsole.log(" in hide")
            $(".playeronelogin").hide();
        }
}

function userNameTwo(arg){
    if (arg === show){
 console.log(arg)
            console.log("show in")
        $(".playertwologin").show();
    }
        if (arg === hide){
            console.log(arg)
            console.log(" in hide")
            $(".playertwologin").hide();
        }
}
//These two functions are for hiding player buttons until they login
function playButtonsOne(arg){
    if (arg === show){
    $(".playerOneButtons").show();
    //$(".chat-box").show();
}
    if (arg === hide){
        $(".playerOneButtons").hide();
        //$(".chat-box").hide();
    }
}

function playButtonsTwo(arg){
    if (arg === show){
    $(".playerTwoButtons").show();
    //$(".chat-box").show();
}
    if (arg === hide){
        $(".playerTwoButtons").hide();
        //$(".chat-box").hide();
    }
}
// playButtonsOne(hide);
// playButtonsTwo(hide);
// userNameOne(hide);
// userNameTwo(hide);
//

//UPDATES EVERYTHING
function updateDOM(){
    $("#player-one-wins").text(playerOne.wins);
    $("#player-two-wins").text(playerTwo.wins);
    $("#player-one-total-games").text(playerOne.wins + playerOne.losses);
    $("#player-two-total-games").text(playerTwo.wins + playerTwo.losses);
    $("#p1-display-name").text(playerOne.name);
    $("#p2-display-name").text(playerTwo.name);

}
//Basically fits in, this is image swap function
function imageSwapOne (){
    //player not selected
    if (playerOne.inUse === false){
      //  alert("Waiting image GO!")
        $("#player-one-img").attr("src", images.waiting)
    }
    //Player selected but move not
    if (playerOne.inUse === true && playerOne.ready === false){
       // alert("Thinking!")
        $("#player-one-img").attr("src", images.thinking[2])
    }
    //Player and move selected!
    if (playerOne.inUse === true && playerOne.ready === true){
       // alert("Ready to see whats good!")
        $("#player-one-img").attr("src", images.ready)
        waitFunction(3);
    }
    //Display moves
    //rock
    if (playerOne.inUse === true && playerOne.move === "rock" && playerTwo.ready === true){
        //alert("ROCK GO! " + playerTwo.ready)
        $("#player-one-img").attr("src", images.rock)
        waitFunction(3);
    }
    //paper
    if (playerOne.inUse === true && playerOne.move === "paper" && playerTwo.ready === true){
        $("#player-one-img").attr("src", images.paper)
        waitFunction(3);
    }
    //scissor
    if (playerOne.inUse === true && playerOne.move === "scissor" && playerTwo.ready === true){
        $("#player-one-img").attr("src", images.scissors)
        waitFunction(3);
    }
}

//Player TWO
function imageSwapTwo (){
    //player not selected
    if (playerTwo.inUse === false){
        //alert("Waiting image GO!")
        $("#player-two-img").attr("src", images.waiting)
    }
    //Player selected but move not
    if (playerTwo.inUse === true && playerTwo.ready === false){
       // alert("Thinking!")
        $("#player-two-img").attr("src", images.thinking[2])
    }
    //Player and move selected!
    if (playerTwo.inUse === true && playerTwo.ready === true){
       // alert("Ready to see whats good!")
        $("#player-two-img").attr("src", images.ready)
        waitFunction(3);
    }
    //Display moves
    //rock
    if (playerTwo.inUse === true && playerTwo.move === "rock" && playerOne.ready === true){
        
        $("#player-two-img").attr("src", images.rock)
        waitFunction(3)
    }
    //paper
    if (playerTwo.inUse === true && playerTwo.move === "paper" && playerOne.ready === true){
        $("#player-two-img").attr("src", images.paper)
        waitFunction(3);
    }
    //scissor
    if (playerTwo.inUse === true && playerTwo.move === "scissor" && playerOne.ready === true){
        $("#player-two-img").attr("src", images.scissors)
        waitFunction(3);
    }
}

//------------------------------------------------------Button Functions-------------------------------------------------------------------------------
//The button function should store a value from pressing the buttons. 
//Player one buttons
//Player one name on click
$("#play-one-submit").on("click", function(){
    //Grabs value from input
    playerOne.name = $("#p1-name").val().trim();
    //Changes name locally
    
    playerOneLocal = true;
    //Sets the player one to in use, then hides the options for player two!
    playerOne.inUse = true;
    imageSwapOne();
    imageSwapTwo();
    playButtonsTwo(hide);
    userNameTwo(hide);
    // userNameTwo(hide);
    //Hides input after done
    userNameOne(hide);
    //Save everything onto the cloud server
    playerOneSave();
    updateDOM();

    
})

$("#play-two-submit").on("click", function(){
    //grabs the value from input
    playerTwo.name = $("#p2-name").val().trim();
    playerTwoLocal = true;
    //Changes name locally
    $("#p2-display-name").text(playerTwo.name);
    
    //Sets the player one to in use, then hides the options for player two!
    playerTwo.inUse = true;
    playButtonsOne(hide);
    userNameTwo(hide);
    //Hides input after done
    imageSwapTwo();
    imageSwapOne();
   // userNameTwo(hide);
    userNameOne(hide);
    
    playerTwoSave();
    
    updateDOM();
    //Load everything onto the cloud server
})
//This function will update changes from cloud server!

//DRAG BUTTON FUNCTIONS BACK HERE IN CASE OF ERROR
    //THESE FUNCTIONS WORKED ON LINE 129
//This function grabs the users next move from the buttons!
$(".playerOneButtons").on("click", function(){
    // alert($(this).val())
    //Stores the value click from the button, needs to be uploaded to firebase
     playerOne.move = $(this).val();
     playerOne.ready = true;
    //Saves stats right on click so it can be loaded for the other player
     playerOneSave();
     imageSwapOne();
     imageSwapTwo();
     //checks to see if both players are ready then compares their choices. 
     rpsLogic();
     updateDOM();
     
 
 })
 
 $(".playerTwoButtons").on("click", function(){
     // alert($(this).val())
     //Stores the value click from the button, needs to be uploaded to firebase
      playerTwo.move = $(this).val();
      playerTwo.ready = true;
      playerTwoSave();
      imageSwapOne();
      imageSwapTwo();
      
      //checks to see if both players are ready then compares their choices. 

      rpsLogic();
      updateDOM();
  
  })

  $("#p1-leave").on("click", function(){
    p1Reset();
    playerOneSave();
    updateDOM();
  })

  $("#p2-leave").on("click", function(){
    p2Reset();
    playerTwoSave();
    updateDOM();
  })

  $(".chat-input").on("click", function(){
     // alert("button press")
     if (playerOneLocal === true){

         playerOne.chat = $(".player-chat").val();
         playerOneSave();
         


     }
     if (playerTwoLocal === true){
         playerTwo.chat = $(".player-chat").val();
         playerTwoSave();
        
     }
        
      })

  

//------------------------------------ROCK PAPER SCISSORS LOGIC--------------------------------------------------------
function rpsLogic(){
    if(playerOne.ready === true && playerTwo.ready === true){
        //Player one win scenarios
        if (playerOne.move === "rock" && playerTwo.move ==="scissor" || playerOne.move === "paper" && playerTwo.move === "rock" || playerOne.move === "scissor" && playerTwo.move === "paper"){
            //waitFunction(2);
            alert("Player "+ playerOne.name + " Wins!");
            playerOne.wins++;
            playerTwo.losses++;
            
            softReset();
            
            allSave();
            imageSwapOne();
            imageSwapTwo();
        }
        //Player Two win scenarios
        if (playerTwo.move === "rock" && playerOne.move ==="scissor" || playerTwo.move === "paper" && playerOne.move === "rock" || playerTwo.move === "scissor" && playerOne.move === "paper"){
            //waitFunction(2);
            alert("Player "+ playerTwo.name + " Wins!");
            playerTwo.wins++;
            playerOne.losses++;
            softReset();
            allSave();
            imageSwapOne();
            imageSwapTwo(); 
        }
        //Tie
        if (playerOne.move === playerTwo.move){
            //waitFunction(2);
            alert("Wow you tied!");
            softReset();
            allSave();
            imageSwapOne();
            imageSwapTwo();
        }
    }
}

//Chatbox Logic
//This chatbox will take chat inputted from a computer, checks which user is local then sends the message with the username. I'm only adding in one variable because i'm assuming chat will be slow.
function chatbox(){
    if (playerOne.chat !== ""){
        $(".user-chat").append(playerOne.name + ": " + playerOne.chat + "<br>");
        playerOne.chat = "";
        playerOneSave();
    }
    if (playerTwo.chat !== ""){
        $(".user-chat").append(playerTwo.name + ": " + playerTwo.chat + "<br>");
        playerTwo.chat = "";
        playerTwoSave();
    }
}

function showChat (){
    if (playerOneLocal === true || playerTwoLocal === true){
        $(".chat-box").show();
    }else{
        $(".chat-box").hide();
    }
}

function softReset (){
    
    playerOne.move = "missing";
    playerTwo.move = "no.";
    playerOne.ready = false;
    playerTwo.ready = false;
    imageSwapOne();
    imageSwapTwo();
   // $("#player-one-img").attr("src", images.thinking[4])
    //$("#player-two-img").attr("src", images.thinking[3])
    //For testing purposes
    //playerOne.inUse = false
  
}

function hardReset (){
p1Reset();
p2Reset();
allSave();
}

//individual resets
function p1Reset(){
    playerOne.move = "missing";
    playerOne.ready = false;
    playerOne.inUse = false;
    playerOne.wins = 0;
    playerOne.losses = 0;
    playerOne.name = "Player One";
    playerOneSave();
    imageSwapOne();
}

function p2Reset(){
    playerTwo.move = "no.";
    playerTwo.ready = false;
    playerTwo.inUse = false;
    playerTwo.wins = 0;
    playerTwo.losses = 0;  
    playerTwo.name = "Player Two";
    playerTwoSave();
    imageSwapTwo();
}

//Short timer Function, to make image swapping look nicer
function waitFunction (waitTime){
    clearTimeout();
    setTimeout( function(){}, waitTime * 1000);
}

$("#reset").on("click", hardReset)
//-------------------------------------------------------FIREBASE LIVE UPDATE SECTION--------------------------------------------------------------------
//This section will probably have to host the buttons, since those are all the live interaction, they will cause updates when pressed.
database.ref().on("value", function(snapshot){
    playerOne = snapshot.val().playerOne;
    playerTwo = snapshot.val().playerTwo;
    showChat();
    chatbox();
   
    
    //console.log(playerTwo);
   // alert(playerOne.name);
imageSwapOne();
imageSwapTwo();
updateDOM();
//alert("data changed!")
if (playerOne.inUse === true && playerOneLocal === true){
    //console.log("hide name 2")
    playButtonsOne(show);
   // alert("HIDE NAME")
   userNameTwo(hide);
  //  $(".playertwologin").hide();
}else if (playerOne.inUse === true && playerOneLocal !== true){
    //console.log("hide name 1")
    playButtonsOne(hide);
    userNameOne(hide);
}else if (playerOne.inUse !== true && playerOneLocal !== true){
    //console.log("Show name one")
playButtonsOne(hide)
    //userNameOne(show)
}

//For 
if (playerTwo.inUse === true && playerTwoLocal === true){
    //console.log("Hide name one")
    playButtonsTwo(show);
    userNameOne(hide);
}else if (playerTwo.inUse === true && playerTwoLocal !== true){
    //console.log("Hide name two")
    playButtonsTwo(hide);
    userNameTwo(hide);
}else if (playerTwo.inUse !== true && playerTwoLocal !== true) {
    //console.log("Show name two")
    playButtonsTwo(hide);
   // userNameTwo(show);
}

if (totalWins !== playerOne.wins + playerTwo.wins){
    totalWins = playerOne.wins + playerTwo.wins
    softReset();
    allSave();
}
})