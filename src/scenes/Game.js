import Phaser from 'phaser';

const boardSize = 6;

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
    this.gamePadActive = true;
    this.playerContainer = [];
    this.computerContainer = [];

    this.computerSunk = [];
    this.computerMarkers = [];
    this.playerSunk = [];
    this.playerMarkers = [];
    // how long a board is shown for after a shot, before scene fade.
    this.duration = 1500;
  }

  init(data) {
    this.pName = data.playerName; // from 'MainMenu' scene
    this.screenWidth = data.screenWidth;
    this.screenHeight = data.screenHeight;
    console.log('screen width: ', this.screenWidth);
    // this.tileSize = 64; // increments of 2 only.
    this.tileSize = Math.round((this.screenHeight * 0.6) / boardSize); // increments of 2 only.
    console.log('this.tile: ', this.tileSize * boardSize);
    this.spriteOffset = this.tileSize / 2;
  }

  preload() {
    // this.load.image('a-button', 'assets/button-a.png');
    // this.load.image('rotate-button', 'assets/button-rotate.png');
    // this.load.image('start-button', 'assets/button-start.png');

    this.load.audio('cursor-move', 'assets/sfx/cursor-move.wav');
    this.load.audio('cursor-bounds', 'assets/sfx/cursor-bounds.wav');

    this.load.svg('start-button', 'assets/button-start.svg', {
      width: 250,
      height: 250,
    });

    this.load.svg('fire-button', 'assets/button-fire.svg', {
      width: 250,
      height: 250,
    });

    this.load.svg('a-button', 'assets/button-a.svg', {
      width: 250,
      height: 150,
    });

    this.load.svg('rotate-button', 'assets/button-rotate.svg', {
      width: 250,
      height: 150,
    });

    this.load.svg('up-button', 'assets/button-up.svg', {
      width: 100,
      height: 100,
    });

    this.load.svg('down-button', 'assets/button-down.svg', {
      width: 100,
      height: 100,
    });

    this.load.svg('left-button', 'assets/button-left.svg', {
      width: 100,
      height: 100,
    });

    this.load.svg('right-button', 'assets/button-right.svg', {
      width: 100,
      height: 100,
    });

    this.load.svg('water', 'assets/water-tile.svg', {
      width: this.tileSize,
      height: this.tileSize,
    });
    this.load.svg('cursor-player', 'assets/cursor-player.svg', {
      width: this.tileSize,
      height: this.tileSize,
    });
    this.load.svg('cursor-active', 'assets/cursor-active.svg', {
      width: this.tileSize,
      height: this.tileSize,
    });
    this.load.svg('carrier', 'assets/carrier.svg', {
      width: this.tileSize * 5,
      height: this.tileSize,
    });
    this.load.svg('sunk-carrier', 'assets/sunk-carrier.svg', {
      width: this.tileSize * 5,
      height: this.tileSize,
    });
    this.load.svg('battleship', 'assets/battleship.svg', {
      width: this.tileSize * 4,
      height: this.tileSize,
    });
    this.load.svg('sunk-battleship', 'assets/sunk-battleship.svg', {
      width: this.tileSize * 4,
      height: this.tileSize,
    });
    this.load.svg('submarine', 'assets/submarine.svg', {
      width: this.tileSize * 3,
      height: this.tileSize,
    });
    this.load.svg('sunk-submarine', 'assets/sunk-submarine.svg', {
      width: this.tileSize * 3,
      height: this.tileSize,
    });
    this.load.svg('cruiser', 'assets/cruiser.svg', {
      width: this.tileSize * 3,
      height: this.tileSize,
    });
    this.load.svg('sunk-cruiser', 'assets/sunk-cruiser.svg', {
      width: this.tileSize * 3,
      height: this.tileSize,
    });
    this.load.svg('destroyer', 'assets/destroyer.svg', {
      width: this.tileSize * 2,
      height: this.tileSize,
    });
    this.load.svg('sunk-destroyer', 'assets/sunk-destroyer.svg', {
      width: this.tileSize * 2,
      height: this.tileSize,
    });
    this.load.svg('marker-hit', 'assets/marker-hit.svg', {
      width: this.tileSize,
      height: this.tileSize,
    });
    this.load.svg('marker-miss', 'assets/marker-miss.svg', {
      width: this.tileSize,
      height: this.tileSize,
    });
  }

  create() {
    const boardLength = boardSize * this.tileSize;
    // Find starting tile position, to center on screen.
    const boardStartX = Math.round(
      (this.screenWidth - this.tileSize * boardSize) / 2
    );
    console.log('boardStartX', boardStartX);
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
    let canBePlaced;
    let texture;
    this.isShot = false;
    // starting position of the gamepad images
    const gamePadStartY = playerBoardStartY + this.tileSize * boardSize + 20;
    const gamePadStartX = this.screenWidth / 2 - this.tileSize / 2;

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
      boardCenterX = boardLength / 2 + boardStartX - this.spriteOffset; // 16
      boardCenterY = boardLength / 2 + playerBoardStartY - this.spriteOffset; // 16
    }

    // game controller    //shift -350, +200
    const aButton = this.add
      .sprite(gamePadStartX + 280, gamePadStartY + 170, 'a-button')
      .setScale(1.0)
      .setInteractive();
    const fireButton = this.add
      .sprite(gamePadStartX + 280, gamePadStartY + 100, 'fire-button')
      .setScale(1.0)
      .setInteractive();
    fireButton.visible = false;
    const rotateButton = this.add
      .sprite(gamePadStartX + 280, gamePadStartY + 40, 'rotate-button')
      .setScale(1.0)
      .setInteractive();
    const startButton = this.add
      .sprite(gamePadStartX - 280, gamePadStartY + 100, 'start-button')
      .setScale(1.0)
      .setInteractive();
    const upButton = this.add
      .sprite(gamePadStartX, gamePadStartY, 'up-button')
      .setScale(1.0)
      .setInteractive(); // was 500, 345
    const downButton = this.add
      .sprite(gamePadStartX, gamePadStartY + 200, 'down-button')
      .setScale(1.0)
      .setInteractive();
    const leftButton = this.add
      .sprite(gamePadStartX - 100, gamePadStartY + 100, 'left-button')
      .setScale(1.0)
      .setInteractive();
    const rightButton = this.add
      .sprite(gamePadStartX + 100, gamePadStartY + 100, 'right-button')
      .setScale(1.0)
      .setInteractive();
    const playerCursor = this.add
      .sprite(boardCenterX, boardCenterY, 'cursor-player')
      .setScale(1.0);
    this.playerText = this.add
      .text(boardStartX, playerBoardStartY - 100, 'place your ships', {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
      .setScale(2.0)
      .setInteractive();
    let boardLetter = 'A';
    let pTileNumber = 0;
    // Create Computer game board
    for (let y = 0; y < boardLength; y += this.tileSize) {
      let boardNumber = 1;
      for (let x = 0; x < boardLength; x += this.tileSize) {
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
      computerBoardStartY += this.tileSize;
    }
    boardLetter = 'A';
    pTileNumber = 0;
    // create Player game board
    for (let y = 0; y < boardLength; y += this.tileSize) {
      let boardNumber = 1;
      for (let x = 0; x < boardLength; x += this.tileSize) {
        this.add.image(x + boardStartX, playerBoardStartY, 'water');
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
      playerBoardStartY += this.tileSize;
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
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerCarrier
    );
    const cBattleship = this.placeShip(
      'battleship',
      4,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerBattleship
    );
    const cCruiser = this.placeShip(
      'cruiser',
      3,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerCruiser
    );
    const cSubmarine = this.placeShip(
      'submarine',
      3,
      boardLength,
      boardStartX,
      computerBoardY,
      currentBoardArray,
      this.computerSubmarine
    );
    const cDestroyer = this.placeShip(
      'destroyer',
      2,
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
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerCarrier
    );
    const pBattleship = this.placeShip(
      'battleship',
      4,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerBattleship
    );
    const pCruiser = this.placeShip(
      'cruiser',
      3,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerCruiser
    );
    const pSubmarine = this.placeShip(
      'submarine',
      3,
      boardLength,
      boardStartX,
      playerBoardY,
      currentBoardArray,
      this.playerSubmarine
    );
    const pDestroyer = this.placeShip(
      'destroyer',
      2,
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

    const gamePad = this.add.layer();
    // group ships as layers to change visibility between transitions.
    this.playerContainer = this.add.layer();
    this.computerContainer = this.add.layer();
    this.computerSunk = this.add.layer();
    this.playerSunk = this.add.layer();
    this.computerMarkers = this.add.layer();
    this.playerMarkers = this.add.layer();

    gamePad.add([
      aButton,
      rotateButton,
      startButton,
      upButton,
      downButton,
      leftButton,
      rightButton,
    ]);
    this.playerContainer.add([
      pCarrier,
      pBattleship,
      pCruiser,
      pSubmarine,
      pDestroyer,
      playerCursor,
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
    startButton.on(
      'pointerdown',
      function handle() {
        if (this.isPlayerTurn) {
          console.log('cboard: ', this.computerBoardArray);
          console.log('pBoard: ', this.playerBoardArray);
          if (canStartGame === true) {
            // move player cursor to enemy board, start game
            this.playerContainer.remove(playerCursor);
            this.computerMarkers.add(playerCursor);
            console.log(this.computerContainer);
            startGame = true;
          }
          // show computer board with ships hidden
          if (startGame) {
            this.playerContainer.visible = false;
            this.computerContainer.visible = false; // true
            this.playerText.setText(`${this.pName}'s turn`);
            startButton.visible = false;
            aButton.visible = false;
            rotateButton.visible = false;
            fireButton.visible = true;
          }
        }
      },
      this
    );

    // Fire button
    fireButton.on(
      'pointerdown',
      () => {
        console.log('this.gamepadactive: ', this.gamePadActive);
        if (this.gamePadActive === false) return;
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
          if (checkShot.hit) {
            cursorThud.play();
            return;
          }
          // check if there is a ship in the selected spot, not hit.
          if (checkShot.hit === false && checkShot.ship === true) {
            this.computerMarkers.add(
              this.add.sprite(x, y, 'marker-hit').setScale(1.0)
            );
            computerBoard[cursor.onIndex].hit = true;
            // Check if all spaces on selected ship are hit.
            const notSunk = shipArray.some((element) => !element.hit === true);
            if (notSunk === false) {
              this.computerContainer.remove(shipSprite);
              shipSprite.setTexture(`sunk-${shipTexture}`);
              this.computerMarkers.add(shipSprite);
              for (let i = 0; i < shipArray.length; i++) shipArray[i].sunk = true;
            }
          } else if (checkShot.hit === false && checkShot.ship === false) {
            this.computerMarkers.add(
              this.add.sprite(x, y, 'marker-miss').setScale(1.0)
            );
            computerBoard[cursor.onIndex].hit = true;
          }
          gameOver = this.isGameOver(); // check for gameover.
        }
        if (gameOver) {
          // Clear board for next game
          this.computerBoardArray = [];
          this.playerBoardArray = [];
          this.scene.start('game-over', { winner: this.pName });
          return;
        }
        this.gamePadActive = false; // prevent player from moving when not their turn.
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

    aButton.on(
      'pointerdown',
      function handle() {
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
            playerCursor.x = shipId.x + this.spriteOffset;
            playerCursor.y = shipId.y + this.spriteOffset;
            for (let i = 0; i < shipArrayCopy.length; i++) {
              shipArrayCopy[i].index = shipStart.index + i;
            }
          } else {
            playerCursor.x = shipId.x - this.spriteOffset;
            playerCursor.y = shipId.y + this.spriteOffset;
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
      },
      this
    );

    // R: rotate
    rotateButton.on(
      'pointerdown',
      function handle() {
        let shipSize = 0;
        let shipBoundary = 0;
        let updatedPosition;
        if (shipArrayCopy) {
          shipSize = shipArrayCopy.length * this.tileSize;
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
              selectedShip.x += this.tileSize;
              selectedShip.y -= shipBoundary; // move ship image if going off board.
              playerCursor.y -= shipBoundary;
              if (shipBoundary) {
                cursor.onIndex -= boardSize * (shipBoundary / this.tileSize);
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
              selectedShip.x -= this.tileSize;
              selectedShip.x -= shipBoundary; // move ship image if going off board.
              playerCursor.x -= shipBoundary;
              cursor.onIndex -= shipBoundary / this.tileSize;
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
              selectedShip.x += this.tileSize;
              selectedShip.y -= shipBoundary; // move ship image if going off board.
              playerCursor.y -= shipBoundary;
              if (shipBoundary) {
                cursor.onIndex -= boardSize * (shipBoundary / this.tileSize);
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
              selectedShip.x -= this.tileSize;
              selectedShip.x -= shipBoundary; // move ship image if going off board.
              playerCursor.x -= shipBoundary;
              cursor.onIndex -= shipBoundary / this.tileSize;
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
          canBePlaced = this.constructor.canPlace(
            shipArrayCopy,
            playerBoard,
            cursor.onIndex,
            selectedShip,
            texture
          );
        }
      },
      this
    );
    this.input.keyboard.on(
      'keydown-F',
      () => {
        console.log(cursor);
        console.log('pBoard:', this.playerBoardArray);
        console.log('cBoard:', this.computerBoardArray);
      },
      this
    );
    // keyboard movement
    upButton.on(
      'pointerdown',
      function handle() {
        if (this.gamePadActive === false) return;
        playerCursor.y -= this.tileSize;
        if (playerCursor.y < playerBoardY) {
          cursorThud.play();
          playerCursor.y += this.tileSize;
        } else {
          cursorMoveSound.play();
          cursor.onIndex -= boardSize;
          const updatedPosition = playerBoard[cursor.onIndex];
          cursor.onGrid = updatedPosition;
          cursor.yPos = playerCursor.y;
          if (shipSelected) selectedShip.y -= this.tileSize;
        }
        if (shipSelected) {
          canBePlaced = this.constructor.canPlace(
            shipArrayCopy,
            playerBoard,
            cursor.onGrid.index,
            selectedShip,
            texture
          );
        }
      },
      this
    );

    downButton.on(
      'pointerdown',
      function handle() {
        if (this.gamePadActive === false) return;
        let isMoving = true;
        let shipSize = 0;
        let shipRot = '';
        if (shipArrayCopy) {
          shipSize = shipArrayCopy.length * this.tileSize;
          shipRot = shipArrayCopy[0].rotation;
        }
        playerCursor.y += this.tileSize;
        if (
          playerCursor.y > playerBoardY + (boardLength - this.tileSize) ||
          (playerCursor.y + shipSize > playerBoardStartY && shipRot === 'vertical')
        ) {
          cursorThud.play();
          playerCursor.y -= this.tileSize;
          isMoving = false;
        } else {
          cursorMoveSound.play();
          cursor.onIndex += boardSize;
          const updatedPosition = playerBoard[cursor.onIndex];
          cursor.onGrid = updatedPosition;
          cursor.yPos = playerCursor.y;
          if (shipSelected) selectedShip.y += this.tileSize;
        }
        if (shipSelected && isMoving) {
          canBePlaced = this.constructor.canPlace(
            shipArrayCopy,
            playerBoard,
            cursor.onGrid.index,
            selectedShip,
            texture
          );
        }
      },
      this
    );

    leftButton.on(
      'pointerdown',
      function handle() {
        if (this.gamePadActive === false) return;
        let isMoving = true;
        playerCursor.x -= this.tileSize;
        if (playerCursor.x < boardStartX) {
          cursorThud.play();
          playerCursor.x += this.tileSize;
          isMoving = false;
        } else {
          cursorMoveSound.play();
          cursor.onIndex -= 1;
          const updatedPosition = playerBoard[cursor.onIndex];
          cursor.onGrid = updatedPosition;
          cursor.xPos = playerCursor.x;
          if (shipSelected) selectedShip.x -= this.tileSize;
        }
        if (shipSelected && isMoving) {
          canBePlaced = this.constructor.canPlace(
            shipArrayCopy,
            playerBoard,
            cursor.onGrid.index,
            selectedShip,
            texture
          );
        }
      },
      this
    );

    rightButton.on(
      'pointerdown',
      function handle() {
        if (this.gamePadActive === false) return;
        let shipSize = 0;
        let shipRot = '';
        if (shipArrayCopy) {
          shipSize = shipArrayCopy.length * this.tileSize;
          shipRot = shipArrayCopy[0].rotation;
        }

        playerCursor.x += this.tileSize;
        if (
          playerCursor.x > boardStartX + (boardLength - this.tileSize) ||
          (playerCursor.x + shipSize > boardStartX + boardLength &&
            shipRot === 'horizontal')
        ) {
          cursorThud.play();
          playerCursor.x -= this.tileSize;
        } else {
          cursorMoveSound.play();
          cursor.onIndex += 1;
          const updatedPosition = playerBoard[cursor.onIndex];
          cursor.onGrid = updatedPosition;
          cursor.xPos = playerCursor.x;
          if (shipSelected) selectedShip.x += this.tileSize;
        }
        if (shipSelected) {
          canBePlaced = this.constructor.canPlace(
            shipArrayCopy,
            playerBoard,
            cursor.onGrid.index,
            selectedShip,
            texture
          );
        }
      },
      this
    );
  }

  update() {
    // computer's turn
    if (this.isPlayerTurn === false) {
      this.gamePadActive = false;
      this.time.delayedCall(this.duration, this.computerShot, [], this);
      this.isPlayerTurn = true;
    }
  }

  // First time placement of ship by the program.
  // Places ship randomly on board, in a random position.
  placeShip(
    shipType,
    shipLength,
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
            board[tileStart].xPos + (shipLength - 1) * this.tileSize >
            boardLength + boardStartX - this.tileSize
          ) {
            okToPlace = false;
          } else if (
            this.constructor.checkShipCollision(
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
          // xPos: -16, yPos: -16  when tilesize = 32...
          .sprite(
            board[index].xPos - this.spriteOffset,
            board[index].yPos - this.spriteOffset,
            shipType
          )
          .setOrigin(0, 0);
        if (shipRotation === 2) createHorizontalShip.flipX = true;
        return createHorizontalShip;
      }
      case 'vertical': {
        do {
          const tileStart = Phaser.Math.Between(0, board.length - 1);
          if (
            board[tileStart].yPos + (shipLength - 1) * this.tileSize >
            boardLength + playerBoardY - this.tileSize
          ) {
            okToPlace = false;
          } else if (
            this.constructor.checkShipCollision(
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
          .sprite(
            board[index].xPos + this.spriteOffset,
            board[index].yPos - this.spriteOffset,
            shipType
          )
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
  static checkShipCollision(tileStart, shipLength, shipRotation, board) {
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
    return undefined;
  }

  // Check if player's selected ship position is not overlapping another ship, or out of bounds.
  static canPlace(shipArrayCopy, playerBoard, cursorIndex, shipSprite, texture) {
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
    return undefined;
  }

  sceneChange(currentPlayer) {
    if (this.isPlayerTurn === true) {
      // player's turn
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.isPlayerTurn = !this.isPlayerTurn;
      this.playerContainer.visible = true;
      this.computerContainer.visible = false;
      this.computerMarkers.visible = false;
      currentPlayer = 'computer';
      this.playerText.setText(`${currentPlayer}'s turn`);
      this.cameras.main.fadeIn(500, 0, 0, 0);
    } else if (this.isPlayerTurn === false) {
      // computer's turn
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.isPlayerTurn = !this.isPlayerTurn;
      this.playerContainer.visible = false;

      this.computerContainer.visible = false;
      this.computerMarkers.visible = true;
      currentPlayer = this.pName; // Use name from MainMenu
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
      this.computerBoardArray = [];
      this.playerBoardArray = [];
      this.gamePadActive = true;
      this.scene.start('game-over', { winner: 'computer' });
    }
    this.time.delayedCall(this.duration, this.cScene, ['computer'], this);
  }

  cScene(currentPlayer) {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.playerContainer.visible = false;

    this.computerContainer.visible = false;
    this.computerMarkers.visible = true;
    currentPlayer = this.pName;
    this.playerText.setText(`${currentPlayer}'s turn`);
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
      console.log('i fired');
      this.gamePadActive = true;
    });
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
