function Board(row = 3, col = 3) {
  function square(type, i, j) {
    return { type, i, j };
  }

  let squares = [];

  //1 == X and 2 == O
  let playerSquareType = 1 + Math.floor(Math.random() * 2);
  let botPlayerSquareType = playerSquareType === 1 ? 2 : 1;
  let playerFirst = playerSquareType === 1;
  let rowLength = row;
  let colLength = col;

  const bot = (function (botSquare) {
    generatePosition = () => Math.floor(Math.random() * row);

    function pickMove() {
      let move = [generatePosition(), generatePosition()];
      while (true) {
        if (squares[move[0]][move[1]].type === 0) {
          return move;
        } else {
          move = [generatePosition(), generatePosition()];
        }
      }
    }

    function play() {
      let move = pickMove();

      squares[move[0]][move[1]].type = botSquare;
    }

    return { play };
  })(botPlayerSquareType)

  function start() {
    for (let i = 0; i < rowLength; i++) {
      squares.push([]);
      for (let j = 0; j < colLength; j++) {
        squares[i].push(square(0, i, j));
      }
    }
  }

  function playAt(row, col) {
    if (squares[row][col].type === 0) {
      squares[row][col].type = playerSquareType;
      return true;
    }

    return false;
  }

  const wonHorizontal = (player) => {
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        if (squares[i][j].type !== player) {
          break;
        } else if (j === (colLength - 1)) {
          return true;
        }
      }
    }
    return false;
  }

  const wonVerticly = (player) => {
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        if (squares[j][i].type !== player) {
          break;
        } else if (j === (colLength - 1)) {
          return true;
        }
      }
    }

    return false;
  }

  const wonDiagonal = (player) => {
    //left -> right
    for(let i = 0; i < rowLength; i++){
      if(squares[i][i].type !== player){
        break;
      }else if(i === (rowLength - 1)){
        return true;
      }
    }

    //left <- right
    for(let i = 0; i < rowLength; i++){
      if(squares[i][(colLength - 1) - i].type !== player){  
        break;
      }else if(i === (rowLength - 1)){
        return true;
      }
    }

    return false;
  }

  function hasWon(playerType) {
    return wonDiagonal(playerType) || wonVerticly(playerType) || wonHorizontal(playerType);
  }

  const playerWon = () => hasWon(playerSquareType);
  const botWon = () => hasWon(botPlayerSquareType);

  //Loops through the rows first because squares = [][]
  const draw = () => {
    const occupied = () => {
      let all = true;
      squares.forEach(square => square.forEach(s => {
        if(s.type === 0) all = false;
      }))
      return all;
    }
    return occupied() && !playerWon() && !botWon();
  }
  
  start();
  
  return { playAt, bot, squares, playerFirst, playerWon, botWon, draw};
};
