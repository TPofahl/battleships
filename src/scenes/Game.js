import Phaser from '../lib/phaser.js';

const boardSize = 10;

export default class Game extends Phaser.Scene{

  constructor(){
    super('game')
    this.computerBoardArray = [];
    this.playerBoardArray = [];

    this.computerCarrier = [];
    this.computerSubmarine = [];
    this.computerBattleship = [];
    this.computerDestroyer = [];
    this.computerCruiser = [];

    this.playerCarrier = [];
    this.playerSubmarine = [];
    this.playerBattleship = [];
    this.playerDestroyer = [];
    this.playerCruiser = [];
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
    this.load.image('battleship', 'assets/battleship.png');
    this.load.image('cruiser', 'assets/cruiser.png');
    this.load.image('carrier', 'assets/carrier.png');
    this.load.image('destroyer', 'assets/destroyer.png');
    this.load.image('submarine', 'assets/submarine.png');
    this.load.audio('cursor-move', 'assets/sfx/cursor-move.wav');
    this.load.audio('cursor-bounds', 'assets/sfx/cursor-bounds.wav');
  }


  create(){
    let boardLength = boardSize * 32;//32x32 tiles
    let boardStartX = 112;
    let playerBoardStartY = 400;
    let computerBoardStartY = 48;
    let playerBoardY = playerBoardStartY;    
    let computerBoardY = computerBoardStartY;
    let cursorStartPosition = {};
    let currentBoardArray = [];
    let boardCenterX = 0;
    let boardCenterY = 0;
    let cursor = {};
    let playerBoard = this.playerBoardArray;
    const cursorMoveSound = this.sound.add('cursor-move', {volume: 0.2});
    const cursorThud = this.sound.add('cursor-bounds', {volume: 0.2});

    //handle starting player cursor visible position
    if (boardSize % 2 == 0) {
      boardCenterX = (boardLength / 2) + boardStartX;
      boardCenterY = (boardLength / 2) + playerBoardStartY;
    } else {
      boardCenterX = (boardLength / 2) + boardStartX - 16;
      boardCenterY = (boardLength / 2) + playerBoardStartY - 16;
    }
  
    this.add.text(450, 300, 'Place your ships', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    //game controller
    const aButton = this.add.sprite(580, 350, 'a-button').setScale(1.2);
    const bButton = this.add.sprite(580, 400, 'b-button').setScale(1.2);
    const upButton = this.add.sprite(500, 345, 'up-button').setScale(1.2);
    const downbutton = this.add.sprite(500, 405, 'down-button').setScale(1.2);
    const leftButton = this.add.sprite(470, 375, 'left-button').setScale(1.2);
    const rightButton = this.add.sprite(530, 375, 'right-button').setScale(1.2);
    const playerCursor = this.add.sprite(boardCenterX, boardCenterY, 'cursor-player').setScale(1.0);//432, 400
    this.add.text(450, 450, 'keyboard controls:\nW: up        A: left\nS: down    D: right\nX: select\nZ: cancel', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    let boardLetter = 'A';
    let pTileNumber = 0;

    //Create Computer game board
    for (let y = 0; y < boardLength; y = y + 32) {
      let boardNumber = 1;

      for (let x = 0; x < boardLength; x = x + 32) {
        this.add.image(x + boardStartX, computerBoardStartY, 'water').setScale(1.0);
        this.computerBoardArray.push({id: boardLetter + boardNumber, ship:false, shipType: '', rotation: '', xPos: x + boardStartX, yPos: computerBoardStartY});
        boardNumber++;
      }
      boardLetter = String.fromCharCode(boardLetter.charCodeAt(0) + 1);
      computerBoardStartY = computerBoardStartY + 32;
    }
    boardLetter = 'A';
    pTileNumber = 0;
    //create Player game board
    for (let y = 0; y < boardLength; y = y + 32) {
      let boardNumber = 1;
      let k = 0;
      for (let x = 0; x < boardLength; x = x + 32) {
        this.add.image(x + boardStartX, playerBoardStartY, 'water').setScale(1.0);
        this.playerBoardArray.push({ id: boardLetter + boardNumber, index: pTileNumber, ship:false, shipType: '', rotation: '', xPos: x + boardStartX, yPos: playerBoardStartY });
        pTileNumber++;
        boardNumber++;
        k++
      }
      boardLetter = String.fromCharCode(boardLetter.charCodeAt(0) + 1);
      playerBoardStartY = playerBoardStartY + 32;
    }
    //set cursor starting position logic to board
      cursorStartPosition = (this.playerBoardArray[(this.playerBoardArray.length / 2) + (boardSize / 2)]);
      cursor.onGrid = cursorStartPosition;
      cursor.onIndex = (this.playerBoardArray.length / 2) + (boardSize / 2);

    const layer0 = this.add.layer();
    const layer1 = this.add.layer();
    layer0.add([ aButton, bButton, upButton, downbutton, leftButton, rightButton]);
    layer1.add([playerCursor]);

    //place computer ships
    console.log('COMP');
    currentBoardArray = this.computerBoardArray;
    this.placeShip('carrier', 5, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerCarrier);
    this.placeShip('battleship', 4, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerBattleship);
    this.placeShip('cruiser', 3, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerCruiser);
    this.placeShip('submarine', 3, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerSubmarine);
    this.placeShip('destroyer', 2, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerDestroyer);
    console.log('PLAYER');
    //place player ships
    currentBoardArray = this.playerBoardArray;
    let pCarrier = this.placeShip('carrier', 5, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerCarrier);
    let pBattleship = this.placeShip('battleship', 4, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerBattleship);
    let pCruiser = this.placeShip('cruiser', 3, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerCruiser);
    let pSubmarine = this.placeShip('submarine', 3, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerSubmarine);
    let pDestroyer = this.placeShip('destroyer', 2, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerDestroyer);
    
    //keyboard select buttons
    this.input.keyboard.on('keydown-X', function () {
      let shipId;
      let saveCursorPos = cursor;
      let shipStart = playerBoard.find(element => element.shipType === cursor.onGrid.shipType);
      console.log('X press: ', saveCursorPos);

      if (cursor.onGrid.ship === true) {
        console.log('SHIP LOCATED');
        
        switch (cursor.onGrid.shipType) {
          case 'carrier': 
          shipId = pCarrier;
          break;
          case 'battleship': shipId = pBattleship;
          break;
          case 'cruiser': shipId = pCruiser;
          break;
          case 'submarine': shipId = pSubmarine;
          break;
          case 'destroyer': shipId = pDestroyer;
          break;
          default: console.log('error: no ship type on X press');
        }

        if (cursor.onGrid.rotation === 'horizontal') {
          playerCursor.x = shipId.x + 16;
          playerCursor.y = shipId.y + 16;
        } else {
          playerCursor.x = shipId.x - 16;
          playerCursor.y = shipId.y + 16;
        }
        //console.log('ship start: ',shipStart);
        console.log('cursor', cursor);
        //cursor.onGrid = shipStart;
        cursor.onGrid.id = shipStart.id;
        cursor.onGrid.index = shipStart.index;
        cursor.onGrid.xPos = shipStart.xPos;
        cursor.onGrid.yPos = shipStart.yPos;
        //console.log('START: ', shipStart);
        console.log('new cursor position: ', cursor.onGrid.id);
        console.log('CHECK BOARD', playerBoard);
        console.log('CHECK CURSOR', cursor);
      }
      //insert sound here.
    });

    //keyboard movement
    this.input.keyboard.on('keydown-W', function () {

      playerCursor.y -= 32;
      if (playerCursor.y < playerBoardY) {
        cursorThud.play();
        playerCursor.y +=32;
      } else {
        cursorMoveSound.play();
        cursor.onIndex = cursor.onIndex - boardSize;
        let updatedPosition = playerBoard[(cursor.onIndex)];
        cursor.onGrid = updatedPosition;
        cursor.yPos = playerCursor.y;
      }
      console.log('cursor pos: ', cursor.onGrid.id);
    });

    this.input.keyboard.on('keydown-S', function () {

      playerCursor.y += 32;
      if (playerCursor.y > playerBoardY + (boardLength - 32)) {
        cursorThud.play();
        playerCursor.y -= 32;
      } else {
        cursorMoveSound.play();
        cursor.onIndex = cursor.onIndex + boardSize;
        let updatedPosition = playerBoard[(cursor.onIndex)];
        cursor.onGrid = updatedPosition;
        cursor.yPos = playerCursor.y;
      }
      console.log('cursor pos: ', cursor.onGrid.id);
    });

    this.input.keyboard.on('keydown-A', function () {

      playerCursor.x -= 32;
      if (playerCursor.x < boardStartX) {
        cursorThud.play();
        playerCursor.x += 32;
      } else {
        cursorMoveSound.play();
      cursor.onIndex = cursor.onIndex - 1;
      let updatedPosition = playerBoard[(cursor.onIndex)];
      cursor.onGrid = updatedPosition;
      cursor.xPos = playerCursor.x;
      }
      console.log('cursor pos: ', cursor.onGrid.id);
    });

    this.input.keyboard.on('keydown-D', function () {
      playerCursor.x += 32;
      if (playerCursor.x > boardStartX + (boardLength -32)) {
        cursorThud.play();
        playerCursor.x -= 32;
      } else {
        cursorMoveSound.play();
        cursor.onIndex = cursor.onIndex + 1;
        let updatedPosition = playerBoard[(cursor.onIndex)];
        cursor.onGrid = updatedPosition;
        cursor.xPos = playerCursor.x;
      }
      console.log('cursor pos: ', cursor.onGrid.id);
    });
    
    //Show computer board layout console
    console.log('\n\n\n\n');
    console.log("COMPUTER BOARD");
    let cFirst = 0;
    let cLast = boardSize;
    for (let i = 0; i < boardSize; i++) {
      console.log(this.computerBoardArray.slice(cFirst, cLast));
      cFirst = cFirst + boardSize;
      cLast = cLast + boardSize;
    }
    console.log('c-carrier: ', this.computerCarrier);
    console.log('c-battleship: ', this.computerBattleship);
    console.log('c-cruiser: ', this.computerCruiser);
    console.log('c-submarine: ', this.computerSubmarine);
    console.log('c-destroyer: ', this.computerDestroyer);

    //Show player board layout console
    console.log('\n\n\n\n');
    console.log('PLAYER BOARD');
    let pFirst = 0;
    let pLast = boardSize;
    for (let i = 0; i < boardSize; i++) {
      console.log(this.playerBoardArray.slice(pFirst, pLast));
      pFirst = pFirst + boardSize;
      pLast = pLast + boardSize;
    }

    console.log('p-carrier: ', this.playerCarrier);
    console.log('p-battleship: ', this.playerBattleship);
    console.log('p-cruiser: ', this.playerCruiser);
    console.log('p-submarine: ', this.playerSubmarine);
    console.log('p-destroyer: ', this.playerDestroyer);
  }

  placeShip(shipType, shipLength, boardSize, boardLength, boardStartX, playerBoardY, board, shipArray) {
    let okToPlace = false;
    let index = 0;
    let shipOrientation = '';
    let shipRotation = Phaser.Math.Between(0, 3);
    if (shipRotation === 0 || shipRotation === 1 ) shipOrientation = 'horizontal';
    else {shipOrientation = 'vertical'};

    switch (shipOrientation) {
      case 'horizontal':
        do {
          let tileStart = Phaser.Math.Between(0, board.length - 1);
          if (board[tileStart].xPos + ((shipLength - 1) * 32) > (boardLength + boardStartX) - 32) {
            okToPlace = false;
          } else if (this.checkShipCollision(boardSize, tileStart, shipLength, 'horizontal', board)) {
            okToPlace = false;
          } else {
              for (let i = 0; i < shipLength; i++) {
                shipArray[i] = board[(tileStart + i)];
                board[tileStart + i].ship = true;
                board[tileStart + i].shipType = shipType;
                board[tileStart + i].rotation = shipOrientation;
              }
              okToPlace = true;
          };
          index = tileStart;
        } while (okToPlace == false);
        
        let createHorizontalShip = this.add.sprite(board[index].xPos - 16, board[index].yPos - 16, shipType).setScale(1.0).setOrigin(0,0);
        if (shipRotation === 1) createHorizontalShip.flipX = true;
        return createHorizontalShip;
      
      case 'vertical':
        do {
          let tileStart = Phaser.Math.Between(0, board.length - 1);
          if (board[tileStart].yPos + ((shipLength - 1) * 32) > (boardLength + playerBoardY) - 32) {
            okToPlace = false;
          } else if (this.checkShipCollision(boardSize, tileStart, shipLength, 'vertical', board)) {
            okToPlace = false;
          } else {
              for (let i = 0; i < shipLength; i++) {
                shipArray[i] = board[(tileStart + (i * boardSize))];
                board[tileStart + (i * boardSize)].ship = true;
                board[tileStart + (i * boardSize)].shipType = shipType;
                board[tileStart + (i * boardSize)].rotation = shipOrientation;
              }
              okToPlace = true;
          };
          index = tileStart;
        } while (okToPlace == false);
        
        let createVerticalShip = this.add.sprite(board[index].xPos + 16, board[index].yPos - 16, shipType).setScale(1.0).setOrigin(0,0);
        createVerticalShip.rotation += 1.57;//rotate 90 degrees
        if (shipRotation === 2) createVerticalShip.flipX = true;
        return createVerticalShip;
      default: console.log('error');
    }
  }


  checkShipCollision(boardSize, tileStart, shipLength, shipRotation, board) {
    if (shipRotation === 'horizontal') {
      let shipLocation = board.slice(tileStart, tileStart + shipLength);
      return shipLocation.some(element => element.ship === true);
    }
    if (shipRotation === 'vertical') {
      let shipLocation = [];
      shipLocation.push(board[tileStart]);
      for (let i = 1; i < shipLength; i++) {
        shipLocation.push(board[tileStart + (i * boardSize)]);
      }
      return shipLocation.some(element => element.ship === true);
    }
  }
}
