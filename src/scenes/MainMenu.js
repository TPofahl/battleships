import Phaser from 'phaser';

let gameStart = false;
// let checkName = false;
const gameBoard = 6;
const userText = '';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('main-menu');
  }

  init(data) {
    this.width = data.width;
    this.height = data.height;
  }

  preload() {
    this.load.svg('title', 'assets/title-battleships.svg', {
      width: this.width * 0.8,
      height: this.height,
    });
    this.load.svg('play', 'assets/button-start-game.svg', {
      width: this.width * 0.4,
      height: this.height * 0.2,
    });
    this.load.svg('linkedin', 'assets/icon-linkedin.svg', {
      width: this.width * 0.15,
      height: this.height * 0.15,
    });
    this.load.svg('github', 'assets/icon-github.svg', {
      width: this.width * 0.15,
      height: this.height * 0.15,
    });
    this.load.svg('portfolio', 'assets/icon-portfolio.svg', {
      width: this.width * 0.15,
      height: this.height * 0.15,
    });

    this.load.html('nameform', 'assets/components/nameform.html');
  }

  create() {
    gameStart = false;
    // checkName = false;

    this.add.image(this.width * 0.5, this.height * 0.1, 'title');

    this.add
      .text(this.width * 0.5 - 210, this.height * 0.3 - 100, 'select board size', {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
      .setScale(2.0);

    const element = this.add
      .dom(this.width * 0.5, this.height * 0.3)
      .createFromCache('nameform');

    const play = this.add
      .image(this.width * 0.5, this.height * 0.5, 'play')
      .setInteractive();
    this.add
      .image(this.width * 0.25, this.height * 0.85, 'linkedin')
      .setInteractive();
    this.add.image(this.width * 0.5, this.height * 0.85, 'github').setInteractive();
    this.add
      .image(this.width * 0.75, this.height * 0.85, 'portfolio')
      .setInteractive();

    element.addListener('pointerdown');

    play.on(
      'pointerdown',
      () => {
        gameStart = true;
        // this.checkName = true;
        /*
        const selectedBoardSize = this.getChildByName('boardLength');
        const inputText = this.getChildByName('nameField');
        if (inputText.value !== '') {
          this.removeListener('click');
          gameBoard = selectedBoardSize.value;
          userText = inputText.value;
          gameStart = true;
        } else {
          inputText.placeholder = 'Name required to start';
        }
        */
      },
      this
    );
  }

  update() {
    /*
    if (checkName === true) {
    const selectedBoardSize = this.getChildByName('boardLength');
    const inputText = this.getChildByName('nameField');
    if (inputText.value !== '') {
      this.removeListener('pointerdown');
      gameBoard = selectedBoardSize.value;
      userText = inputText.value;
      gameStart = true;
    } else {
      inputText.placeholder = 'Name required to start';
    }
     checkName = false;
    }
    */
    if (gameStart === true) {
      this.scene.start('game', {
        boardSize: gameBoard,
        playerName: userText,
        screenWidth: this.width,
        screenHeight: this.height,
      });
    }
  }
}
