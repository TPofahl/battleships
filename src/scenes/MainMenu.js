import Phaser from 'phaser';

let gameStart = false;
let gameBoard = 6;
let userText = '';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('main-menu');
  }

  preload() {
    this.load.html('nameform', 'assets/components/nameform.html');
  }

  create() {
    const { width, height } = this.scale;
    gameStart = false;


    this.add
      .text(width * 0.5 - 120, height * 0.5 - 50, 'select board size', {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
      .setScale(2.0)

    const element = this.add
      .dom(width * 0.5, height * 0.5)
      .createFromCache('nameform');

    element.addListener('click');

    element.on('click', function handle(event) {
      if (event.target.name === 'playButton') {
        const selectedBoardSize = this.getChildByName('boardLength');
        const inputText = this.getChildByName('nameField');
        if (inputText.value !== '') {
          this.removeListener('click');
          gameBoard = selectedBoardSize.value;
          userText = inputText.value;
          gameStart = true;
        } else {inputText.placeholder = 'Name required to start'}
      }
    });
  }

  update() {
    if (gameStart === true) {
      this.scene.start('game', {
        boardSize: gameBoard,
        playerName: userText,
        screenWidth: this.scale.width,
        screenHeight: this.scale.height,
      });
    }
  }
}
