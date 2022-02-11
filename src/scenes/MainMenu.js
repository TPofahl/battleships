import Phaser from 'phaser';

let gameStart = false;
let gameBoard = 10;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('main-menu');
    this.icons = '';
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
    let upClick = true;
    let downClick = true;
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
    this.icons = this.add
      .dom(this.width * 0.5, this.height * 0.4)
      .createFromCache('icons');

    minusButton.on(
      'pointerdown',
      () => {
        // Desktop
        if (this.width > this.height) {
          if (gameBoard > 7) {
            gameBoard -= 2;
            cursorMoveSound.play();
          }
          // Mobile
        } else if (downClick) {
          downClick = false;
          if (gameBoard > 7) {
            gameBoard -= 2;
            cursorMoveSound.play();
          }
        } else {
          downClick = true;
        }
        this.boardText.setText(`${gameBoard} x ${gameBoard}`);
      },
      this
    );

    plusButton.on(
      'pointerdown',
      () => {
        // Desktop
        if (this.width > this.height) {
          if (gameBoard < 11) {
            gameBoard += 2;
            cursorMoveSound.play();
          }
          // Mobile
        } else if (upClick) {
          upClick = false;
          if (gameBoard < 11) {
            gameBoard += 2;
            cursorMoveSound.play();
          }
        } else {
          upClick = true;
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
      // Remove dom elements.
      // ios has issues with pointer events in scenes, after a scene with dom elements
      this.icons.removeElement('icons');

      this.scene.start('game', {
        boardSize: gameBoard,
        playerName: 'player',
        screenWidth: this.width,
        screenHeight: this.height,
      });
    }
  }
}
