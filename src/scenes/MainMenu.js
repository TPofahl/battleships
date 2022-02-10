import Phaser from 'phaser';

let gameStart = false;
let gameBoard = 10;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('main-menu');
  }

  init(data) {
    this.width = data.width;
    this.height = data.height;
  }

  preload() {
    this.load.audio('cursor-move', 'assets/sfx/cursor-move.wav');
    // Desktop
    if (this.width > this.height) {
      this.load.svg('title', 'assets/title-battleships.svg', {
        width: this.width * 0.6,
        height: this.height,
      });
      this.load.svg('plus', 'assets/button-plus.svg', {
        width: this.width * 0.05,
        height: this.height * 0.05,
      });
      this.load.svg('minus', 'assets/button-minus.svg', {
        width: this.width * 0.05,
        height: this.height * 0.05,
      });
    } else {
      // Mobile
      this.load.svg('title', 'assets/title-battleships.svg', {
        width: this.width * 0.9,
        height: this.height,
      });
      this.load.svg('plus', 'assets/button-plus.svg', {
        width: this.width * 0.1,
        height: this.height * 0.1,
      });
      this.load.svg('minus', 'assets/button-minus.svg', {
        width: this.width * 0.1,
        height: this.height * 0.1,
      });
    }
    this.load.svg('play', 'assets/button-start-game.svg', {
      width: this.width * 0.3,
      height: this.height * 0.2,
    });

    this.load.html('icons', 'assets/components/icons.html');
  }

  create() {
    gameStart = false;
    const cursorMoveSound = this.sound.add('cursor-move', { volume: 0.2 });

    this.add.image(this.width * 0.5, this.height * 0.1, 'title');

    this.boardText = this.add
      .text(this.width * 0.5, this.height * 0.3, `${gameBoard} x ${gameBoard}`, {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
      .setOrigin(0.5)
      .setScale(3.0);

    const minusButton = this.add
      .sprite(this.width * 0.5 - 150, this.height * 0.3, 'minus')
      .setInteractive();
    const plusButton = this.add
      .sprite(this.width * 0.5 + 150, this.height * 0.3, 'plus')
      .setInteractive();

    const play = this.add
      .image(this.width * 0.5, this.height * 0.55, 'play')
      .setInteractive();

    // Add link icons
    this.add.dom(this.width * 0.5, this.height * 0.4).createFromCache('icons');

    minusButton.on(
      'pointerdown',
      () => {
        if (gameBoard > 7) {
          gameBoard -= 2;
          cursorMoveSound.play();
        }
        this.boardText.setText(`${gameBoard} x ${gameBoard}`);
      },
      this
    );

    plusButton.on(
      'pointerdown',
      () => {
        if (gameBoard < 11) {
          gameBoard += 2;
          cursorMoveSound.play();
        }
        this.boardText.setText(`${gameBoard} x ${gameBoard}`);
      },
      this
    );

    play.on(
      'pointerdown',
      () => {
        gameStart = true;
      },
      this
    );
  }

  update() {
    if (gameStart === true) {
      this.scene.start('game', {
        boardSize: gameBoard,
        playerName: 'player',
        screenWidth: this.width,
        screenHeight: this.height,
      });
    }
  }
}
