var origBoard;// store the current state of the game board.
const huPlayer='O';// human player
const aiPlayer='X';// AI player.

//An array of arrays, each inner array representing a combination of board indices that constitute a winning line.
const winCombos=[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

// Selects all the elements with the class 'cell' and stores them in a NodeList.
const cells=document.querySelectorAll('.cell');
startGame();//Calls the startGame function to initialize the game.
function startGame() {
    document.querySelector(".endgame").style.display="none";//Hides the endgame display.
    origBoard=Array.from(Array(9).keys());//Initializes origBoard and Create an array of 0-8
    for (var i=0; i < cells.length; i++) {
        cells[i].innerText='';//Clears the text
        cells[i].style.removeProperty('background-color');//Clears background color of each cell.
        cells[i].addEventListener('click', turnClick, false);

    }
}

function turnClick(square){
    if (typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, huPlayer);//Checks if the clicked cell is still available (not already taken).
    if (!checkTie()) turn(bestSpot(), aiPlayer);//If there is no tie, makes a move for the AI player using the bestSpot function.
    }
}

function turn(squareId, player){
    origBoard[squareId] = player;//Updates the board state and the UI with the player's move.
    document.getElementById(squareId).innerText=player;
    let gameWon=checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);//Checks if the move resulted in a win, and if so, ends the game.
}

//23:56
//Finds all the board indices that the player has played.
function checkWin(board, player){
    //create an array plays
    /*The reduce method is called on the board array. 
    The reduce method iterates through each element in the array, 
    applying a function that accumulates a result. This function 
    takes four arguments: the accumulator (a), the current element (e), 
    the current index (i), and the original array (which is omitted here 
    as it's not needed).*/
    let plays=board.reduce((a, e, i) => 
        (e === player ) ? a.concat(i) : a, []);
    let gameWon = null; 
    //Checks each winning combination to see if the player has all the indices in one of those combinations.
    for (let [index, win] of winCombos.entries()){
        //Returns the winning combination if there is a win.
        if (win.every(elem => plays.indexOf(elem) > -1)){
           gameWon={index: index, player: player}; 
           break;
        }
    }
    return gameWon;
}

//Highlights the winning cells.
function gameOver(gameWon){
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor=
            gameWon.player == huPlayer ? "blue" : "red";
    }
    //Removes click event listeners to prevent further moves.
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", turnClick, false);

    }
    //Displays the winner message.
    declareWinner(gameWon.player == huPlayer ? "You win": "You Lose" );
}

//Displays the endgame message with the winner.
function declareWinner(who){
    document.querySelector(".endgame").style.display="block";
    document.querySelector(".endgame .text").innerText=who;
}

//Returns an array of indices that are still available (not yet taken by a player).
function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

//Uses the minimax algorithm to determine the best move for the AI player and returns the index of that move.
function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}


//Checks if there are no more empty squares.
//If true, declares a tie and highlights all cells in green.
//Removes click event listeners to prevent further moves.
function checkTie(){
    if (emptySquares().length == 0){
        for (var i=0; i<cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener("click", turnClick, false);

        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

//Implements the minimax algorithm to simulate all possible moves and outcomes.
//Evaluates and returns the best possible move for the AI player based on scores.
//This algorithm ensures the AI plays optimally.
function minimax(newBoard, player){
    var availSpots=emptySquares(newBoard);
    if (checkWin(newBoard, player)){
        return {score: -10};
    }
    else if (checkWin(newBoard, aiPlayer)){
        return {score: 20};
    }
    else if (availSpots.length === 0){
        return {score: 0};
    }
    var moves= [];
    for (var i=0; i < availSpots.length; i++){
        var move={};
        move.index= newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer){
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }  else{
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }
    var bestMove;
    if (player ===aiPlayer){
        var bestScore = -10000;
        for (var i=0; i < moves.length ; i++){
            if (moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    
    }
    else{
        var bestScore = 10000;
        for (var i=0; i < moves.length ; i++){
            if (moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];

}