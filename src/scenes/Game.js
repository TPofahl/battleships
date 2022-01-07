import Phaser from 'phaser';

const boardSize = 8;

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
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

    this.isShot = false;
    this.isPlayerTurn = true;
    this.playerContainer = [];
    this.computerContainer = [];

    this.computerSunk = [];
    this.computerMarkers = [];
    this.playerSunk = [];
    this.playerMarkers = [];

    this.duration = 100; // scene change duration.
  }

  init(data) {
    this.pName = data.playerName;
  }

  preload() {
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

  create() {
    console.log('passed result: ', this.pName);
    const boardLength = boardSize * 32; // 32x32 tiles
    const boardStartX = 112;
    let playerBoardStartY = 200; // 400
    let computerBoardStartY = 200; // 48
    const playerBoardY = playerBoardStartY;
    const computerBoardY = computerBoardStartY;
    let cursorStartPosition = {};
    let currentBoardArray = [];
    let boardCenterX = 0;
    let boardCenterY = 0;
    const cursor = {};
    let shipSelected = false;
    let selectedArray;
    let selectedShip;
    let shipArrayCopy;
    let canStartGame = true;
    const currentPlayer = this.pName;
    const isPlaceable = this.canPlace;
    let canBePlaced;
    let texture;
    this.isShot = false;

    let gameOver = false;

    const playerBoard = this.playerBoardArray;
    const computerBoard = this.computerBoardArray;
    const pCarrierArray = this.playerCarrier;
    const pBattleshipArray = this.playerBattleship;
    const pCruiserArray = this.playerCruiser;
    const pSubmarineArray = this.playerSubmarine;
    const pDestroyerArray = this.playerDestroyer;
    const { playerText } = this;

    let startGame = false;

    const cursorMoveSound = this.sound.add('cursor-move', { volume: 0.2 });
    const cursorThud = this.sound.add('cursor-bounds', { volume: 0.2 });

    // handle starting player cursor sprite position
    if (boardSize % 2 === 0) {
      boardCenterX = boardLength / 2 + boardStartX;
      boardCenterY = boardLength / 2 + playerBoardStartY;
    } else {
      boardCenterX = boardLength / 2 + boardStartX - 16;
      boardCenterY = boardLength / 2 + playerBoardStartY - 16;
    }

    // game controller    //shift -350, +200
    const aButton = this.add
      .sprite(230, 550, 'a-button')
      .setScale(1.2)
      .setInteractive();
    const bButton = this.add.sprite(230, 600, 'b-button').setScale(1.2);
    const upButton = this.add.sprite(150, 545, 'up-button').setScale(1.2); // was 500, 345
    const downbutton = this.add.sprite(150, 605, 'down-button').setScale(1.2);
    const leftButton = this.add
      .sprite(120, 575, 'left-button')
      .setScale(1.2)
      .setInteractive();
    const rightButton = this.add.sprite(180, 575, 'right-button').setScale(1.2);
    const playerCursor = this.add
      .sprite(boardCenterX, boardCenterY, 'cursor-player')
      .setScale(1.0); // 432, 400
    this.playerText = this.add
      .text(100, 150, 'place your ships', {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
      .setInteractive();
    this.add.text(
      280,
      520,
      'keyboard controls:\nW: up        A: left\nS: down    D: right\nX: select\nR: rotate',
      { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
    );
    let boardLetter = 'A';
    let pTileNumber = 0;
    // Create Computer game board
    for (let y = 0; y < boardLength; y += 32) {
      let boardNumber = 1;
      for (let x = 0; x < boardLength; x += 32) {
        // this.add.image(x + boardStartX, computerBoardStartY, 'water').setScale(1.0);
        this.computerBoardArray.push({
          id: boardLetter + boardNumber,
          ship: false,
          shipType: '',
          rotation: '',
          xPos: x + boardStartX,
          yPos: computerBoardStartY,
          hit: false,
        });
        boardNumber += 1;
      }
      boardLetter = String.fromCharCode(boardLetter.charCodeAt(0) + 1);
      computerBoardStartY += 32;
    }
    boardLetter = 'A';
    pTileNumber = 0;
    // create Player game board
    for (let y = 0; y < boardLength; y += 32) {
      let boardNumber = 1;
      for (let x = 0; x < boardLength; x += 32) {
        this.add.image(x + boardStartX, playerBoardStartY, 'water').setScale(1.0);
        this.playerBoardArray.push({
          id: boardLetter + boardNumber,
          index: pTileNumber,
          ship: false,
          shipType: '',
          rotation: '',
          xPos: x + boardStartX,
          yPos: playerBoardStartY,
          hit: false,
          sunk: false,
        });
        pTileNumber += 1;
        boardNumber += 1;
      }
      boardLetter = String.fromCharCode(boardLetter.charCodeAt(0) + 1);
      playerBoardStartY += 32;
    }
    // set cursor starting position logic to board
    cursorStartPosition =
      this.playerBoardArray[this.playerBoardArray.length / 2 + boardSize / 2];
    cursor.onGrid = cursorStartPosition;
    cursor.onIndex = this.playerBoardArray.length / 2 + boardSize / 2;

    // place computer ships
    currentBoardArray = this.computerBoardArray;
    const cCarrier = this.placeShip(
      'carrier',
      5,
      boardSize,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerCarrier
    );
    const cBattleship = this.placeShip(
      'battleship',
      4,
      boardSize,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerBattleship
    );
    const cCruiser = this.placeShip(
      'cruiser',
      3,
      boardSize,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerCruiser
    );
    const cSubmarine = this.placeShip(
      'submarine',
      3,
      boardSize,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerSubmarine
    );
    const cDestroyer = this.placeShip(
      'destroyer',
      2,
      boardSize,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerDestroyer
    );
    // place player ships
    currentBoardArray = this.playerBoardArray;
    const pCarrier = this.placeShip(
      'carrier',
      5,
      boardSize,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerCarrier
    );
    const pBattleship = this.placeShip(
      'battleship',
      4,
      boardSize,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerBattleship
    );
    const pCruiser = this.placeShip(
      'cruiser',
      3,
      boardSize,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerCruiser
    );
    const pSubmarine = this.placeShip(
      'submarine',
      3,
      boardSize,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerSubmarine
    );
    const pDestroyer = this.placeShip(
      'destroyer',
      2,
      boardSize,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerDestroyer
    );

    this.pCarrier = pCarrier;
    this.pBattleship = pBattleship;
    this.pCruiser = pCruiser;
    this.pSubmarine = pSubmarine;
    this.pDestroyer = pDestroyer;

    const layer0 = this.add.layer();
    const layer1 = this.add.layer();
    // group ships as layers to change visibility between transitions.
    this.playerContainer = this.add.layer();
    this.computerContainer = this.add.layer();
    this.computerSunk = this.add.layer();
    this.playerSunk = this.add.layer();
    this.computerMarkers = this.add.layer();
    this.playerMarkers = this.add.layer();

    layer0.add([aButton, bButton, upButton, downbutton, leftButton, rightButton]);
    layer1.add([playerCursor]);
    this.playerContainer.add([
      pCarrier,
      pBattleship,
      pCruiser,
      pSubmarine,
      pDestroyer,
    ]);
    this.computerContainer.add([
      cCarrier,
      cBattleship,
      cCruiser,
      cSubmarine,
      cDestroyer,
    ]);
    this.playerContainer.visible = true;
    this.computerContainer.visible = false;

    // Game start button
    this.input.keyboard.on(
      'keydown-F',
      () => {
        if (this.isPlayerTurn) {
          console.log('cboard: ', this.computerBoardArray);
          console.log('pBoard: ', this.playerBoardArray);
          if (canStartGame === true) startGame = true;
          // show computer board with ships hidden
          if (startGame) {
            this.playerContainer.visible = false;
            this.computerContainer.visible = false; // true
            this.playerText.setText(`${this.pName}'s turn`);
          }
        }
      },
      this
    );

    aButton.on(
      'pointerdown',
      function handle() {
        if (startGame && this.isPlayerTurn) {
          const checkShot = computerBoard[cursor.onIndex];
          const currentShip = computerBoard[cursor.onIndex].shipType;
          let shipArray;
          let shipTexture;
          let shipSprite;

          switch (currentShip) {
            case 'carrier':
              shipArray = this.computerCarrier;
              shipTexture = 'carrier';
              shipSprite = cCarrier;
              break;
            case 'battleship':
              shipArray = this.computerBattleship;
              shipTexture = 'battleship';
              shipSprite = cBattleship;
              break;
            case 'cruiser':
              shipArray = this.computerCruiser;
              shipTexture = 'cruiser';
              shipSprite = cCruiser;
              break;
            case 'submarine':
              shipArray = this.computerSubmarine;
              shipTexture = 'submarine';
              shipSprite = cSubmarine;
              break;
            case 'destroyer':
              shipArray = this.computerDestroyer;
              shipTexture = 'destroyer';
              shipSprite = cDestroyer;
              break;
            case '':
              break;
            default:
              console.log('error: no ship type on button press');
          }
          const x = computerBoard[cursor.onIndex].xPos;
          const y = computerBoard[cursor.onIndex].yPos;
          // check if there is a ship in the selected spot, not hit.
          if (checkShot.hit === false && checkShot.ship === true) {
            // this.computerContainer.add(this.add.sprite(x, y, 'marker-hit').setScale(1.0));
            this.computerMarkers.add(
              this.add.sprite(x, y, 'marker-hit').setScale(1.0)
            );
            computerBoard[cursor.onIndex].hit = true;
            // Check if all spaces on selected ship are hit.
            const notSunk = shipArray.some((element) => !element.hit === true);
            if (notSunk === false) {
              this.computerContainer.remove(shipSprite);
              this.computerMarkers.add(shipSprite);
              shipSprite.setTexture(`sunk-${shipTexture}`);
              for (let i = 0; i < shipArray.length; i++) shipArray[i].sunk = true;
            }
          } else if (checkShot.hit === false && checkShot.ship === false) {
            // this.computerContainer.add(this.add.sprite(x, y, 'marker-miss').setScale(1.0));
            this.computerMarkers.add(
              this.add.sprite(x, y, 'marker-miss').setScale(1.0)
            );
            computerBoard[cursor.onIndex].hit = true;
          }
          gameOver = this.isGameOver(); // check for gameover.
        }
        if (gameOver) {
          this.scene.start('game-over', { winner: this.pName });
          return;
        }
        if (startGame && this.isPlayerTurn === true) {
          this.time.delayedCall(
            this.duration,
            this.sceneChange,
            [playerText, currentPlayer],
            this
          );
        } else if (this.isPlayerTurn === false) {
          this.time.delayedCall(
            this.duration,
            this.sceneChange,
            [playerText, currentPlayer],
            this
          );
        }
      },
      this
    );

    // X: select
    this.input.keyboard.on('keydown-X', () => {
      if (startGame) return;
      canStartGame = false;
      const shipStart = playerBoard.find(
        (element) => element.shipType === cursor.onGrid.shipType
      );
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
            selectedArray = pBattleshipArray;
            selectedShip = shipId;
            texture = 'battleship';
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
          default:
            console.log('error: no ship type on X press');
        }
        // remove ship from the player board
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
            shipArrayCopy[i].index = shipStart.index + boardSize * i;
          }
        }
        const updatedPosition = playerBoard[cursor.onIndex];
        cursor.onGrid = updatedPosition;
      } else if (canBePlaced && shipSelected) {
        shipSelected = false;
        const startTile = cursor.onGrid.index;
        // add new ship position to player board
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
            playerBoard[startTile + i * boardSize].angle = shipArrayCopy[0].angle;
            playerBoard[startTile + i * boardSize].ship = true;
            playerBoard[startTile + i * boardSize].shipType = texture;
            playerBoard[startTile + i * boardSize].rotation =
              shipArrayCopy[0].rotation;
            selectedArray[i] = playerBoard[startTile + i * boardSize];
            canStartGame = true;
          }
        }
        shipArrayCopy = undefined;
      } else {
        cursorThud.play();
      }
      // Change player cursor to selected cursor
      if (shipSelected) {
        playerCursor.setTexture('cursor-active');
      } else {
        playerCursor.setTexture('cursor-player');
      }
      // insert sound here.
    });

    // R: rotate
    this.input.keyboard.on('keydown-R', () => {
      let shipSize = 0;
      let shipBoundary = 0;
      let updatedPosition;
      if (shipArrayCopy) {
        shipSize = shipArrayCopy.length * 32;
        // check if ship goes off the board's x-axis when rotated.
        if (
          playerCursor.x + shipSize > boardStartX + boardLength &&
          shipArrayCopy[0].rotation === 'vertical'
        ) {
          shipBoundary = playerCursor.x + shipSize - (boardStartX + boardLength);
        }
        // check if ship goes off the board's y-axis when rotated.
        if (
          playerCursor.y + shipSize > playerBoardY + boardLength &&
          shipArrayCopy[0].rotation === 'horizontal'
        ) {
          shipBoundary = playerCursor.y + shipSize - (playerBoardY + boardLength);
        }
        switch (shipArrayCopy[0].angle) {
          // vertical down.
          case 0:
            selectedShip.angle += 90;
            selectedShip.x += 32;
            selectedShip.y -= shipBoundary; // move ship image if going off board.
            playerCursor.y -= shipBoundary;
            if (shipBoundary) {
              cursor.onIndex -= boardSize * (shipBoundary / 32);
              updatedPosition = playerBoard[cursor.onIndex];
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
          // horizontal left.
          case 1:
            selectedShip.angle -= 90;
            selectedShip.x -= 32;
            selectedShip.x -= shipBoundary; // move ship image if going off board.
            playerCursor.x -= shipBoundary;
            cursor.onIndex -= shipBoundary / 32;
            updatedPosition = playerBoard[cursor.onIndex];
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
            }
            break;
          // vertical up.
          case 2:
            selectedShip.angle += 90;
            selectedShip.x += 32;
            selectedShip.y -= shipBoundary; // move ship image if going off board.
            playerCursor.y -= shipBoundary;
            if (shipBoundary) {
              cursor.onIndex -= boardSize * (shipBoundary / 32);
              updatedPosition = playerBoard[cursor.onIndex];
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
          // horizontal right.
          case 3:
            selectedShip.angle -= 90;
            selectedShip.x -= 32;
            selectedShip.x -= shipBoundary; // move ship image if going off board.
            playerCursor.x -= shipBoundary;
            cursor.onIndex -= shipBoundary / 32;
            updatedPosition = playerBoard[cursor.onIndex];
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
            }
            break;
          default:
            console.log('error: ship angle not found');
        }
        canBePlaced = isPlaceable(
          shipArrayCopy,
          playerBoard,
          cursor.onIndex,
          selectedShip,
          texture
        );
      }
    });

    // keyboard movement
    this.input.keyboard.on('keydown-W', () => {
      playerCursor.y -= 32;
      if (playerCursor.y < playerBoardY) {
        cursorThud.play();
        playerCursor.y += 32;
      } else {
        cursorMoveSound.play();
        cursor.onIndex -= boardSize;
        const updatedPosition = playerBoard[cursor.onIndex];
        cursor.onGrid = updatedPosition;
        cursor.yPos = playerCursor.y;
        if (shipSelected) selectedShip.y -= 32;
      }
      if (shipSelected) {
        canBePlaced = isPlaceable(
          shipArrayCopy,
          playerBoard,
          cursor.onGrid.index,
          selectedShip,
          texture
        );
      }
    });

    this.input.keyboard.on('keydown-S', () => {
      let isMoving = true;
      let shipSize = 0;
      let shipRot = '';
      if (shipArrayCopy) {
        shipSize = shipArrayCopy.length * 32;
        shipRot = shipArrayCopy[0].rotation;
      }
      playerCursor.y += 32;
      if (
        playerCursor.y > playerBoardY + (boardLength - 32) ||
        (playerCursor.y + shipSize > playerBoardStartY && shipRot === 'vertical')
      ) {
        cursorThud.play();
        playerCursor.y -= 32;
        isMoving = false;
      } else {
        cursorMoveSound.play();
        cursor.onIndex += boardSize;
        const updatedPosition = playerBoard[cursor.onIndex];
        cursor.onGrid = updatedPosition;
        cursor.yPos = playerCursor.y;
        if (shipSelected) selectedShip.y += 32;
      }
      if (shipSelected && isMoving) {
        canBePlaced = isPlaceable(
          shipArrayCopy,
          playerBoard,
          cursor.onGrid.index,
          selectedShip,
          texture
        );
      }
    });

    this.input.keyboard.on('keydown-A', () => {
      let isMoving = true;
      playerCursor.x -= 32;
      if (playerCursor.x < boardStartX) {
        cursorThud.play();
        playerCursor.x += 32;
        isMoving = false;
      } else {
        cursorMoveSound.play();
        cursor.onIndex -= 1;
        const updatedPosition = playerBoard[cursor.onIndex];
        cursor.onGrid = updatedPosition;
        cursor.xPos = playerCursor.x;
        if (shipSelected) selectedShip.x -= 32;
      }
      if (shipSelected && isMoving) {
        canBePlaced = isPlaceable(
          shipArrayCopy,
          playerBoard,
          cursor.onGrid.index,
          selectedShip,
          texture
        );
      }
    });

    this.input.keyboard.on('keydown-D', () => {
      let shipSize = 0;
      let shipRot = '';
      if (shipArrayCopy) {
        shipSize = shipArrayCopy.length * 32;
        shipRot = shipArrayCopy[0].rotation;
      }

      playerCursor.x += 32;
      if (
        playerCursor.x > boardStartX + (boardLength - 32) ||
        (playerCursor.x + shipSize > boardStartX + boardLength &&
          shipRot === 'horizontal')
      ) {
        cursorThud.play();
        playerCursor.x -= 32;
      } else {
        cursorMoveSound.play();
        cursor.onIndex += 1;
        const updatedPosition = playerBoard[cursor.onIndex];
        cursor.onGrid = updatedPosition;
        cursor.xPos = playerCursor.x;
        if (shipSelected) selectedShip.x += 32;
      }
      if (shipSelected) {
        canBePlaced = isPlaceable(
          shipArrayCopy,
          playerBoard,
          cursor.onGrid.index,
          selectedShip,
          texture
        );
      }
    });
  }

  update() {
    // computer's turn
    if (this.isPlayerTurn === false) {
      this.time.delayedCall(this.duration, this.computerShot, [], this);
      this.isPlayerTurn = true;
    }
  }

  // First time placement of ship by the program.
  // Places ship randomly on board, in a random position.
  placeShip(
    shipType,
    shipLength,
    boardSize,
    boardLength,
    boardStartX,
    playerBoardY,
    board,
    shipArray
  ) {
    let okToPlace = false;
    let index = 0;
    let shipOrientation = '';
    const shipRotation = Phaser.Math.Between(0, 3);
    if (shipRotation === 0 || shipRotation === 2) shipOrientation = 'horizontal';
    else {
      shipOrientation = 'vertical';
    }

    switch (shipOrientation) {
      case 'horizontal': {
        do {
          const tileStart = Phaser.Math.Between(0, board.length - 1);
          if (
            board[tileStart].xPos + (shipLength - 1) * 32 >
            boardLength + boardStartX - 32
          ) {
            okToPlace = false;
          } else if (
            this.checkShipCollision(
              boardSize,
              tileStart,
              shipLength,
              'horizontal',
              board
            )
          ) {
            okToPlace = false;
          } else {
            for (let i = 0; i < shipLength; i++) {
              shipArray[i] = board[tileStart + i];
              board[tileStart + i].ship = true;
              board[tileStart + i].shipType = shipType;
              board[tileStart + i].rotation = shipOrientation;
              board[tileStart + i].angle = shipRotation;
            }
            okToPlace = true;
          }
          index = tileStart;
        } while (okToPlace === false);

        const createHorizontalShip = this.add
          .sprite(board[index].xPos - 16, board[index].yPos - 16, shipType)
          .setScale(1.0)
          .setOrigin(0, 0);
        if (shipRotation === 2) createHorizontalShip.flipX = true;
        return createHorizontalShip;
      }
      case 'vertical': {
        do {
          const tileStart = Phaser.Math.Between(0, board.length - 1);
          if (
            board[tileStart].yPos + (shipLength - 1) * 32 >
            boardLength + playerBoardY - 32
          ) {
            okToPlace = false;
          } else if (
            this.checkShipCollision(
              boardSize,
              tileStart,
              shipLength,
              'vertical',
              board
            )
          ) {
            okToPlace = false;
          } else {
            for (let i = 0; i < shipLength; i++) {
              shipArray[i] = board[tileStart + i * boardSize];
              board[tileStart + i * boardSize].ship = true;
              board[tileStart + i * boardSize].shipType = shipType;
              board[tileStart + i * boardSize].rotation = shipOrientation;
              board[tileStart + i * boardSize].angle = shipRotation;
            }
            okToPlace = true;
          }
          index = tileStart;
        } while (okToPlace === false);

        const createVerticalShip = this.add
          .sprite(board[index].xPos + 16, board[index].yPos - 16, shipType)
          .setScale(1.0)
          .setOrigin(0, 0);
        createVerticalShip.angle += 90;
        if (shipRotation === 3) createVerticalShip.flipX = true;
        return createVerticalShip;
      }
      default:
        return undefined;
    }
  }

  // Checks if the ship overlaps with any other ship when the program places ships.
  checkShipCollision(boardSize, tileStart, shipLength, shipRotation, board) {
    if (shipRotation === 'horizontal') {
      const shipLocation = board.slice(tileStart, tileStart + shipLength);
      return shipLocation.some((element) => element.ship === true);
    }
    if (shipRotation === 'vertical') {
      const shipLocation = [];
      shipLocation.push(board[tileStart]);
      for (let i = 1; i < shipLength; i++) {
        shipLocation.push(board[tileStart + i * boardSize]);
      }
      return shipLocation.some((element) => element.ship === true);
    }
  }

  // Check if player's selected ship position is not overlapping another ship, or out of bounds.
  canPlace(shipArrayCopy, playerBoard, cursorIndex, shipSprite, texture) {
    if (shipArrayCopy[0].rotation === 'horizontal') {
      for (let i = 0; i < shipArrayCopy.length; i++) {
        if (playerBoard[cursorIndex + i].ship === true) {
          shipSprite.setTexture(`sunk-${texture}`);
          return false;
        }
      }
      shipSprite.setTexture(texture);
      return true;
    }
    if (shipArrayCopy[0].rotation === 'vertical') {
      for (let i = 0; i < shipArrayCopy.length; i++) {
        if (playerBoard[cursorIndex + i * boardSize].ship === true) {
          shipSprite.setTexture(`sunk-${texture}`);
          return false;
        }
      }
      shipSprite.setTexture(texture);
      return true;
    }
  }
  

  sceneChange(currentPlayer) {
    if (this.isPlayerTurn === true) {
      // player turn
      this.cameras.main.fadeOut(125, 0, 0, 0);
      this.isPlayerTurn = !this.isPlayerTurn;
      this.playerContainer.visible = true;

      this.computerContainer.visible = false;
      this.computerMarkers.visible = false;
      currentPlayer = 'computer';
      this.playerText.setText(`${currentPlayer}'s turn`);
      this.cameras.main.fadeIn(500, 0, 0, 0);
    } else if (this.isPlayerTurn === false) {
      // computer turn
      this.cameras.main.fadeOut(125, 0, 0, 0);
      this.isPlayerTurn = !this.isPlayerTurn;
      this.playerContainer.visible = false;

      this.computerContainer.visible = false;
      this.computerMarkers.visible = true;
      currentPlayer = this.pName;
      this.playerText.setText(`${currentPlayer}'s turn`);
      this.cameras.main.fadeIn(500, 0, 0, 0);
    }
  }

  computerShot() {
    let random;
    let shipArray;
    let shipTexture;
    let shipSprite;
    do {
      random = Phaser.Math.Between(0, this.playerBoardArray.length - 1);
    } while (this.playerBoardArray[random].hit === true);
    const currentShip = this.playerBoardArray[random].shipType;
    switch (currentShip) {
      case 'carrier':
        shipArray = this.playerCarrier;
        shipTexture = 'carrier';
        shipSprite = this.pCarrier;
        break;
      case 'battleship':
        shipArray = this.playerBattleship;
        shipTexture = 'battleship';
        shipSprite = this.pBattleship;
        break;
      case 'cruiser':
        shipArray = this.playerCruiser;
        shipTexture = 'cruiser';
        shipSprite = this.pCruiser;
        break;
      case 'submarine':
        shipArray = this.playerSubmarine;
        shipTexture = 'submarine';
        shipSprite = this.pSubmarine;
        break;
      case 'destroyer':
        shipArray = this.playerDestroyer;
        shipTexture = 'destroyer';
        shipSprite = this.pDestroyer;
        break;
      case '':
        break;
      default:
        console.log('error: no ship type detected in computerShot');
    }

    this.playerBoardArray[random].hit = true;
    const x = this.playerBoardArray[random].xPos;
    const y = this.playerBoardArray[random].yPos;
    if (this.playerBoardArray[random].ship === true) {
      // check if the ship is hit in every square.
      const notSunk = shipArray.some((element) => !element.hit === true);
      this.playerContainer.add(this.add.sprite(x, y, 'marker-hit').setScale(1.0));
      if (notSunk === false) {
        shipSprite.setTexture(`sunk-${shipTexture}`);
        for (let i = 0; i < shipArray.length; i++) shipArray[i].sunk = true;
      }
    } else if (this.playerBoardArray[random].ship === false) {
      this.playerContainer.add(this.add.sprite(x, y, 'marker-miss').setScale(1.0));
    }
    this.gameOver = this.isGameOver(); // check for gameover.
    if (this.gameOver) {
      this.scene.start('game-over', { winner: 'computer' });
    }

    this.time.delayedCall(this.duration, this.cScene, ['computer'], this);
  }

  cScene(currentPlayer) {
    this.cameras.main.fadeOut(125, 0, 0, 0);
    this.playerContainer.visible = false;

    this.computerContainer.visible = false;
    this.computerMarkers.visible = true;
    currentPlayer = this.pName;
    this.playerText.setText(`${currentPlayer}'s turn`);
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  isGameOver() {
    if (
      this.computerBattleship[0].sunk === true &&
      this.computerCarrier[0].sunk === true &&
      this.computerCruiser[0].sunk === true &&
      this.computerSubmarine[0].sunk === true &&
      this.computerDestroyer[0].sunk === true
    ) {
      console.log('player wins');
      return true;
    }
    if (
      this.playerBattleship[0].sunk === true &&
      this.playerCarrier[0].sunk === true &&
      this.playerCruiser[0].sunk === true &&
      this.playerSubmarine[0].sunk === true &&
      this.playerDestroyer[0].sunk === true
    ) {
      console.log('computer wins');
      return true;
    }
    return false;
  }
}
