import Phaser from '../lib/phaser.js';

const boardSize = 10;
const playerBoardArray = [];
const computerBoardArray = [];

export default class Game extends Phaser.Scene{

  constructor(){
    super('game')
  }

  init(){

  }

  preload(){
    this.load.image('water', 'assets/water-tile.png');
    this.load.image('a-button', 'assets/button-a.png');
    this.load.image('b-button', 'assets/button-b.png');
    this.load.image('up-button', 'assets/button-up.png');
    this.load.image('down-button', 'assets/button-down.png');
    this.load.image('left-button', 'assets/button-left.png');
    this.load.image('right-button', 'assets/button-right.png');
    this.load.image('cursor-player', 'assets/cursor-player.png');
  }


  create(){
    let boardLength = boardSize * 32;//32x32 tiles
    let boardStartX = 112;
    let playerBoardStartY = 400;
    let computerBoardStartY = 48;
    let boardCenterX = 0;
    let boardCenterY = 0;
    let cursor = {onGrid: ""};

    //handle starting player cursor position
    if (boardSize % 2 == 0) {
      boardCenterX = (boardLength / 2) + boardStartX;
      boardCenterY = (boardLength / 2) + playerBoardStartY;
    } else {
      boardCenterX = (boardLength / 2) + boardStartX - 16;
      boardCenterY = (boardLength / 2) + playerBoardStartY - 16;
    }
  

    //game controller
    const aButton = this.add.sprite(580, 350, 'a-button').setScale(1.2);
    const bButton = this.add.sprite(580, 400, 'b-button').setScale(1.2);
    const upButton = this.add.sprite(500, 345, 'up-button').setScale(1.2);
    const downbutton = this.add.sprite(500, 405, 'down-button').setScale(1.2);
    const leftButton = this.add.sprite(470, 375, 'left-button').setScale(1.2);
    const rightButton = this.add.sprite(530, 375, 'right-button').setScale(1.2);
    const playerCursor = this.add.sprite(boardCenterX, boardCenterY, 'cursor-player').setScale(1.0);//432, 400

    let boardLetter = 'A';
    let pTileNumber = 0;
    //Create game board for computer
    for (let y = 0; y < boardLength; y = y + 32) {
      let boardNumber = 1;

      for (let x = 0; x < boardLength; x = x + 32) {
        this.add.image(x + boardStartX, computerBoardStartY, 'water').setScale(1.0);
        computerBoardArray.push(boardLetter + boardNumber);
        boardNumber++;
      }
      boardLetter = String.fromCharCode(boardLetter.charCodeAt(0) + 1);
      computerBoardStartY = computerBoardStartY + 32;
    }
    boardLetter = 'A';
    pTileNumber = 0;
    //create game board for player
    for (let y = 0; y < boardLength; y = y + 32) {
      let boardNumber = 1;
      for (let x = 0; x < boardLength; x = x + 32) {
        this.add.image(x + boardStartX, playerBoardStartY, 'water').setScale(1.0);
        playerBoardArray.push(boardLetter + boardNumber);
        pTileNumber++;
        boardNumber++;
      }
      boardLetter = String.fromCharCode(boardLetter.charCodeAt(0) + 1);
      playerBoardStartY = playerBoardStartY + 32;
    }

    let cursorStartPosition = (playerBoardArray[(playerBoardArray.length / 2) + 5]);
    cursor.onGrid = cursorStartPosition;
    console.log(cursor.onGrid);

    const layer0 = this.add.layer();
    const layer1 = this.add.layer();
    layer0.add([ aButton, bButton, upButton, downbutton, leftButton, rightButton]);
    layer1.add([playerCursor]);

    //keyboard movement
    this.input.keyboard.on('keydown-W', function () {playerCursor.y -= 32});
    this.input.keyboard.on('keydown-S', function () {playerCursor.y += 32});
    this.input.keyboard.on('keydown-A', function () {playerCursor.x -= 32});
    this.input.keyboard.on('keydown-D', function () {
      playerCursor.x += 32;
      cursor.onGrid = (playerBoardArray[(playerBoardArray.length / 2) + 6]);
      console.log(cursor.onGrid);
    });


    //Show computer board layout console
    console.log('\n\n\n\n');
    console.log("COMPUTER BOARD");
    let cFirst = 0;
    let cLast = 10
    for (let i = 0; i < boardSize; i++) {
      console.log(computerBoardArray.slice(cFirst, cLast));
      cFirst = cFirst + 10;
      cLast = cLast + 10;
    }
    //Show player board layout console
    console.log('\n\n\n\n');
    console.log('PLAYER BOARD');
    let pFirst = 0;
    let pLast = 10
    for (let i = 0; i < boardSize; i++) {
      console.log(playerBoardArray.slice(pFirst, pLast));
      pFirst = pFirst + 10;
      pLast = pLast + 10;
    }
  }


  update(){
  }
}
