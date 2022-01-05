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

    this.battleSprite;
  }

  init(){
    //this.startGame = false;
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
    this.load.image('cursor-active', 'assets/cursor-active.png');
    this.load.image('battleship', 'assets/battleship.png');
    this.load.image('cruiser', 'assets/cruiser.png');
    this.load.image('carrier', 'assets/carrier.png');
    this.load.image('destroyer', 'assets/destroyer.png');
    this.load.image('submarine', 'assets/submarine.png');
    this.load.image('sunk-battleship', 'assets/sunk-battleship.png');
    this.load.image('sunk-cruiser', 'assets/sunk-cruiser.png');
    this.load.image('sunk-carrier', 'assets/sunk-carrier.png');
    this.load.image('sunk-destroyer', 'assets/sunk-destroyer.png');
    this.load.image('sunk-submarine', 'assets/sunk-submarine.png');
    this.load.audio('cursor-move', 'assets/sfx/cursor-move.wav');
    this.load.audio('cursor-bounds', 'assets/sfx/cursor-bounds.wav');
    this.load.image('marker-hit', 'assets/marker-hit.png');
    this.load.image('marker-miss', 'assets/marker-miss.png');
  }


  create(){
    let boardLength = boardSize * 32;//32x32 tiles
    let boardStartX = 112;
    let playerBoardStartY = 200;//400
    let computerBoardStartY = 200;//48
    let playerBoardY = playerBoardStartY;    
    let computerBoardY = computerBoardStartY;
    let cursorStartPosition = {};
    let currentBoardArray = [];
    let boardCenterX = 0;
    let boardCenterY = 0;
    let cursor = {};
    let shipSelected = false;
    let selectedArray;
    let selectedShip;
    let shipArrayCopy;
    let canStartGame = true;
    let currentPlayer = 'player';
    let isPlaceable = this.canPlace;
    let canBePlaced;
    let texture;


    let playerBoard = this.playerBoardArray;
    let computerBoard = this.computerBoardArray;
    let pCarrierArray = this.playerCarrier;
    let pBattleshipArray = this.playerBattleship;
    let pCruiserArray = this.playerCruiser;
    let pSubmarineArray = this.playerSubmarine;
    let pDestroyerArray = this.playerDestroyer;

    let startGame = false;

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
  
    //game controller    //shift -350, +200
    const aButton = this.add.sprite(230, 550, 'a-button').setScale(1.2).setInteractive();
    const bButton = this.add.sprite(230, 600, 'b-button').setScale(1.2);
    const upButton = this.add.sprite(150, 545, 'up-button').setScale(1.2);//was 500, 345
    const downbutton = this.add.sprite(150, 605, 'down-button').setScale(1.2);
    const leftButton = this.add.sprite(120, 575, 'left-button').setScale(1.2).setInteractive();
    const rightButton = this.add.sprite(180, 575, 'right-button').setScale(1.2);
    const playerCursor = this.add.sprite(boardCenterX, boardCenterY, 'cursor-player').setScale(1.0);//432, 400
    let playerText = this.add.text(100, 150, `place your ships`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setInteractive();
    this.add.text(280, 520, 'keyboard controls:\nW: up        A: left\nS: down    D: right\nX: select\nZ: cancel\nR: rotate', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    let boardLetter = 'A';
    let pTileNumber = 0;
    //Create Computer game board
    for (let y = 0; y < boardLength; y = y + 32) {
      let boardNumber = 1;

      for (let x = 0; x < boardLength; x = x + 32) {
        //this.add.image(x + boardStartX, computerBoardStartY, 'water').setScale(1.0);
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

    //place computer ships
    currentBoardArray = this.computerBoardArray;
    let cCarrier = this.placeShip('carrier', 5, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerCarrier);
    let cBattleship = this.placeShip('battleship', 4, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerBattleship);
    let cCruiser = this.placeShip('cruiser', 3, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerCruiser);
    let cSubmarine = this.placeShip('submarine', 3, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerSubmarine);
    let cDestroyer = this.placeShip('destroyer', 2, boardSize, boardLength, boardStartX, computerBoardY, currentBoardArray, this.computerDestroyer);
    //place player ships
    currentBoardArray = this.playerBoardArray;
    let pCarrier = this.placeShip('carrier', 5, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerCarrier);
    let pBattleship = this.placeShip('battleship', 4, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerBattleship);
    let pCruiser = this.placeShip('cruiser', 3, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerCruiser);
    let pSubmarine = this.placeShip('submarine', 3, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerSubmarine);
    let pDestroyer = this.placeShip('destroyer', 2, boardSize, boardLength, boardStartX, playerBoardY, currentBoardArray, this.playerDestroyer);
    
    this.battleSprite = cBattleship;
    

    let layer0 = this.add.layer();
    let layer1 = this.add.layer();
    //group ships as layers to change visibility between transitions.
    let playerContainer = this.add.layer();
    let computerContainer = this.add.layer();
    layer0.add([ aButton, bButton, upButton, downbutton, leftButton, rightButton]);
    layer1.add([playerCursor]);
    playerContainer.add([ pCarrier, pBattleship, pCruiser, pSubmarine, pDestroyer]);
    computerContainer.add([ cCarrier, cBattleship, cCruiser, cSubmarine, cDestroyer]);
    playerContainer.visible = true;
    computerContainer.visible = false;

    //Game start button
    this.input.keyboard.on('keydown-F', function () {
      console.log('where cursor is: ',cursor);
      console.log('cboard: ',computerBoard);
      //console.log('\n\n\n\n');
      console.log('PLAYER BOARD');
      console.log(playerBoard);
      if (canStartGame === true) startGame = true
      //show computer board with ships hidden
      if (startGame) {
        playerContainer.visible = false;
        computerContainer.visible = true;// showing for testing.
        currentPlayer = 'player'
        playerText.setText(`${currentPlayer}'s turn`);
      }
    });

    aButton.on('pointerdown', function () {
      if (startGame) {
        console.log(computerBoard[cursor.onIndex].ship);
          computerBoard[cursor.onIndex].ship = 'target';
      }
    });

    //X: select
    this.input.keyboard.on('keydown-X', function () {
      if (startGame) return;
      canStartGame = false;
      let shipStart = playerBoard.find(element => element.shipType === cursor.onGrid.shipType);
      let shipId;
      if (cursor.onGrid.ship === true && shipSelected === false) {
        shipSelected = true;

        switch (cursor.onGrid.shipType) {
          case 'carrier': 
            shipId = pCarrier;
            selectedArray = pCarrierArray;
            selectedShip = shipId;
            texture = 'carrier';
            shipArrayCopy = Object.create(pCarrierArray);
          break;
          case 'battleship': 
            shipId = pBattleship;
            selectedArray = pBattleshipArray
            selectedShip = shipId;
            texture = 'battleship'
            shipArrayCopy = Object.create(pBattleshipArray);
          break;
          case 'cruiser': 
            shipId = pCruiser;
            selectedArray = pCruiserArray;
            selectedShip = shipId;
            texture = 'cruiser';
            shipArrayCopy = Object.create(pCruiserArray);
          break;
          case 'submarine': 
            shipId = pSubmarine;
            selectedArray = pSubmarineArray;
            selectedShip = shipId;
            texture = 'submarine';
            shipArrayCopy = Object.create(pSubmarineArray);
          break;
          case 'destroyer': 
            shipId = pDestroyer;
            selectedArray = pDestroyerArray;
            selectedShip = shipId;
            texture = 'destroyer';
            shipArrayCopy = Object.create(pDestroyerArray);
          break;
          default: console.log('error: no ship type on X press');
        }
        //remove ship from the player board
        for (let i = 0; i < selectedArray.length; i++) {
          selectedArray[i].shipType = '';
          selectedArray[i].ship = false;
        }
        cursor.onIndex = shipArrayCopy[0].index;
        cursor.onGrid.index = shipArrayCopy[0].index;
        cursor.xPos = shipStart.xPos;
        cursor.yPos = shipStart.yPos;

        if (shipArrayCopy[0].rotation === 'horizontal') {
          playerCursor.x = shipId.x + 16;
          playerCursor.y = shipId.y + 16;
          for (let i = 0; i < shipArrayCopy.length; i++) {
            shipArrayCopy[i].index = shipStart.index + i;
          }
        } else {
          playerCursor.x = shipId.x - 16;
          playerCursor.y = shipId.y + 16;
          for (let i = 0; i < shipArrayCopy.length; i++) {
            shipArrayCopy[i].index = (shipStart.index + (boardSize * i));
          }
        }
        let updatedPosition = playerBoard[(cursor.onIndex)];
        cursor.onGrid = updatedPosition;

      } else {
        if (canBePlaced && shipSelected) {
          shipSelected = false;
          let startTile = cursor.onGrid.index;
          //add new ship position to player board
          if (shipArrayCopy[0].rotation === 'horizontal') {
            for (let i = 0; i < selectedArray.length; i++) {
              playerBoard[startTile + i].angle = shipArrayCopy[0].angle;
              playerBoard[startTile + i].ship = true;
              playerBoard[startTile + i].shipType = texture;
              playerBoard[startTile + i].rotation = shipArrayCopy[0].rotation;
              selectedArray[i] = playerBoard[startTile + i];
              canStartGame = true;
            }
          } else {
            for (let i = 0; i < selectedArray.length; i++) {
              //console.log(startTile + (i * boardSize).angle);
              //console.log('cursor', cursor);
              playerBoard[startTile + (i * boardSize)].angle = shipArrayCopy[0].angle;
              playerBoard[startTile + (i * boardSize)].ship = true;
              playerBoard[startTile + (i * boardSize)].shipType = texture;
              playerBoard[startTile + (i * boardSize)].rotation = shipArrayCopy[0].rotation;
              selectedArray[i] = playerBoard[startTile + (i * boardSize)];
              canStartGame = true;
            }
          }
          shipArrayCopy = undefined;
        } else {
          cursorThud.play();
        }
      };
        //Change player cursor to selected cursor
      if (shipSelected) {
        playerCursor.setTexture('cursor-active');

        } else {
          playerCursor.setTexture('cursor-player');
        }
      //insert sound here.
    });

    //R: rotate
    this.input.keyboard.on('keydown-R', function () {
      let shipSize = 0;
      let shipBoundary = 0;
      let updatedPosition;
      if (shipArrayCopy) {
        shipSize = shipArrayCopy.length * 32;
    //check if ship goes off the board's x-axis when rotated.
    if ((playerCursor.x + shipSize) > boardStartX + boardLength && shipArrayCopy[0].rotation === 'vertical') {
      shipBoundary = (playerCursor.x + shipSize) - (boardStartX + (boardLength));
    }
    //check if ship goes off the board's y-axis when rotated.
    if ((playerCursor.y + shipSize) > playerBoardY + boardLength && shipArrayCopy[0].rotation === 'horizontal') {
      shipBoundary = (playerCursor.y + shipSize) - (playerBoardY + (boardLength));
    }
      switch (shipArrayCopy[0].angle) {
        //vertical down.
        case 0:
          selectedShip.angle += 90;
          selectedShip.x += 32;
          selectedShip.y -= shipBoundary;//move ship image if going off board.
          playerCursor.y -= shipBoundary;
          if (shipBoundary) {

            cursor.onIndex -= (boardSize * (shipBoundary / 32));
            updatedPosition = playerBoard[(cursor.onIndex)];
            cursor.onGrid = updatedPosition;
          }
          for (let i = 0; i < shipArrayCopy.length; i++) {
            shipArrayCopy[i].angle++;
            shipArrayCopy[i].rotation = 'vertical';
          }
          if (shipArrayCopy[0].angle > 3) {
            for (let i = 0; i < shipArrayCopy.length; i++) {
              shipArrayCopy[i].angle = 0;
              shipArrayCopy[i].rotation = 'horizontal';
            }
          }
          break;
        //horizontal left.
        case 1:
          selectedShip.angle -= 90;
          selectedShip.x -= 32;
          selectedShip.x -= shipBoundary;//move ship image if going off board.
          playerCursor.x -= shipBoundary;
          cursor.onIndex -= (shipBoundary / 32);
          updatedPosition = playerBoard[(cursor.onIndex)];
          cursor.onGrid = updatedPosition;
          selectedShip.flipX = !selectedShip.flipX;
          for (let i = 0; i < shipArrayCopy.length; i++) {
            shipArrayCopy[i].angle++;
            shipArrayCopy[i].rotation = 'horizontal';
          }
          if (shipArrayCopy[0].angle > 3) {
            for (let i = 0; i < shipArrayCopy.length; i++) {
              shipArrayCopy[i].angle = 0;
              shipArrayCopy[i].rotation = 'horizontal';
            }
          };
          break;
        //vertical up.
        case 2:
          selectedShip.angle += 90;
          selectedShip.x += 32;
          selectedShip.y -= shipBoundary;//move ship image if going off board.
          playerCursor.y -= shipBoundary;
          if (shipBoundary) {
            cursor.onIndex -= (boardSize * (shipBoundary / 32));
            updatedPosition = playerBoard[(cursor.onIndex)];
            cursor.onGrid = updatedPosition;
          }
          for (let i = 0; i < shipArrayCopy.length; i++) {
            shipArrayCopy[i].angle++;
            shipArrayCopy[i].rotation = 'vertical';
          }
          if (shipArrayCopy[0].angle > 3) {
            for (let i = 0; i < shipArrayCopy.length; i++) {
              shipArrayCopy[i].angle = 0;
              shipArrayCopy[i].rotation = 'horizontal';
            }
          };
          break;
        //horizontal right.
        case 3:
          selectedShip.angle -= 90;
          selectedShip.x -= 32;
          selectedShip.x -= shipBoundary;//move ship image if going off board.
          playerCursor.x -= shipBoundary;
          cursor.onIndex -= (shipBoundary / 32);
          updatedPosition = playerBoard[(cursor.onIndex)];
          cursor.onGrid = updatedPosition;
          selectedShip.flipX = !selectedShip.flipX;
          for (let i = 0; i < shipArrayCopy.length; i++) {
            shipArrayCopy[i].angle++;
            shipArrayCopy[i].rotation = 'horizontal';
          }
          if (shipArrayCopy[0].angle > 3) {
            for (let i = 0; i < shipArrayCopy.length; i++) {
              shipArrayCopy[i].angle = 0;
              shipArrayCopy[i].rotation = 'horizontal';
            }
          };
          break;
        default: console.log('error: ship angle not found');
      }
      canBePlaced = isPlaceable(shipArrayCopy, playerBoard, cursor.onIndex, selectedShip, texture);
      }
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
        if (shipSelected) selectedShip.y -= 32;
      }
      if (shipSelected) {
        canBePlaced = isPlaceable(shipArrayCopy, playerBoard, cursor.onGrid.index, selectedShip, texture);
      }
    });

    this.input.keyboard.on('keydown-S', function () {
      let isMoving = true;
      let shipSize = 0;
      let shipRot = '';
      if (shipArrayCopy) {
        shipSize = shipArrayCopy.length * 32;
        shipRot = shipArrayCopy[0].rotation;
      }
      playerCursor.y += 32;
      if (playerCursor.y > playerBoardY + (boardLength - 32) || (playerCursor.y + shipSize) > playerBoardStartY && shipRot === 'vertical') {
        cursorThud.play();
        playerCursor.y -= 32;
        isMoving = false;
      } else {
        cursorMoveSound.play();
        cursor.onIndex = cursor.onIndex + boardSize;
        let updatedPosition = playerBoard[(cursor.onIndex)];
        cursor.onGrid = updatedPosition;
        cursor.yPos = playerCursor.y;
        if (shipSelected) selectedShip.y += 32;
      }
      if (shipSelected && isMoving) {
        canBePlaced = isPlaceable(shipArrayCopy, playerBoard, cursor.onGrid.index, selectedShip, texture);
      }
    });

    this.input.keyboard.on('keydown-A', function () {
      let isMoving = true;
      playerCursor.x -= 32;
      if (playerCursor.x < boardStartX) {
        cursorThud.play();
        playerCursor.x += 32;
        isMoving = false;
      } else {
        cursorMoveSound.play();
      cursor.onIndex = cursor.onIndex - 1;
      let updatedPosition = playerBoard[(cursor.onIndex)];
      cursor.onGrid = updatedPosition;
      cursor.xPos = playerCursor.x;
      if (shipSelected) selectedShip.x -= 32;
      }
      if (shipSelected && isMoving) {
        canBePlaced = isPlaceable(shipArrayCopy, playerBoard, cursor.onGrid.index, selectedShip, texture);
      }
    });

    this.input.keyboard.on('keydown-D', function () {
      let shipSize = 0;
      let shipRot = '';
      if (shipArrayCopy) {
        shipSize = shipArrayCopy.length * 32;
        shipRot = shipArrayCopy[0].rotation;
      }

      playerCursor.x += 32;
      if (playerCursor.x > boardStartX + (boardLength - 32) || (playerCursor.x + shipSize) > boardStartX + (boardLength) && shipRot === 'horizontal') {
        cursorThud.play();
        playerCursor.x -= 32;
      } else {
        cursorMoveSound.play();
        cursor.onIndex = cursor.onIndex + 1;
        let updatedPosition = playerBoard[(cursor.onIndex)];
        cursor.onGrid = updatedPosition;
        cursor.xPos = playerCursor.x;
        if (shipSelected) selectedShip.x += 32;
      }
      if (shipSelected) {
        canBePlaced = isPlaceable(shipArrayCopy, playerBoard, cursor.onGrid.index, selectedShip, texture);
      }
    });
    console.log('this.computercarrier',this.computerCarrier);
  }

  update () {
    //this.battleSprite.setTexture('marker-hit');
    let boards = [this.computerBoardArray, this.playerBoardArray];
    let ships = [    
      this.computerCarrier,
      this.computerSubmarine,
      this.computerBattleship,
      this.computerDestroyer,
      this.computerCruiser,
      this.playerCarrier,
      this.playerSubmarine,
      this.playerBattleship,
      this.playerDestroyer,
      this.playerCruiser
    ];
    let isSunk;
    //update hit/miss markers for both players.
    for (let index = 0; index <= 1; index++) {
      for (let i = 0; i < boards[index].length; i++) {
        if ( boards[index][i].ship === 'target' && boards[index][i].shipType !== '') {
          let x = boards[index][i].xPos;
          let y = boards[index][i].yPos;
          this.add.sprite(x, y, 'marker-hit').setScale(1.0);
          boards[index][i].ship = 'hit';
        } else if (boards[index][i].ship === 'target' && boards[index][i].shipType === '') {
          let x = boards[index][i].xPos;
          let y = boards[index][i].yPos;
          this.add.sprite(x, y, 'marker-miss').setScale(1.0);
          boards[index][i].ship = 'hit';
        }
      }
    }
    //for (let i = 0; i < ships[0].length; i++) {
    //  isSunk = ships[0].some(element => element.ship === true);
    //  console.log(`${ships[0].shipType} is sunk: `,isSunk);
    //}
  }

  //First time placement of ship by the program. Places ship randomly on board, in a random position.
  placeShip(shipType, shipLength, boardSize, boardLength, boardStartX, playerBoardY, board, shipArray) {
    let okToPlace = false;
    let index = 0;
    let shipOrientation = '';
    let shipRotation = Phaser.Math.Between(0, 3);
    if (shipRotation === 0 || shipRotation === 2 ) shipOrientation = 'horizontal';
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
                board[tileStart + i].angle = shipRotation;
              }
              okToPlace = true;
          };
          index = tileStart;
        } while (okToPlace == false);
        
        let createHorizontalShip = this.add.sprite(board[index].xPos - 16, board[index].yPos - 16, shipType).setScale(1.0).setOrigin(0,0);
        if (shipRotation === 2) createHorizontalShip.flipX = true;
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
                board[tileStart + (i * boardSize)].angle = shipRotation;
              }
              okToPlace = true;
          };
          index = tileStart;
        } while (okToPlace == false);
        
        let createVerticalShip = this.add.sprite(board[index].xPos + 16, board[index].yPos - 16, shipType).setScale(1.0).setOrigin(0,0);
        createVerticalShip.angle += 90;
        if (shipRotation === 3) createVerticalShip.flipX = true;
        return createVerticalShip;
      default: console.log('error');
    }
  }

  //Checks if the ship overlaps with any other ship when the program places ships.
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
  
  //Check if player's selected ship position is not overlapping another ship, or out of bounds.
  canPlace (shipArrayCopy, playerBoard, cursorIndex, shipSprite, texture) { 

    if (shipArrayCopy[0].rotation === 'horizontal') {
      for (let i = 0; i < shipArrayCopy.length; i++) {
        if (playerBoard[(cursorIndex + i)].ship === true) {
          shipSprite.setTexture('sunk-' + texture);
          return false;
        } else {
          shipSprite.setTexture(texture);
        }
      } 
      return true;
    }
    if (shipArrayCopy[0].rotation === 'vertical') {
      for (let i = 0; i < shipArrayCopy.length; i++) {
        if (playerBoard[(cursorIndex + (i * boardSize))].ship === true) {
          shipSprite.setTexture('sunk-' + texture);
          return false;
        } else {
          shipSprite.setTexture(texture);
        }
      }
      return true;
    }
  }
}
