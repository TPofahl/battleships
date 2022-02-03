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

    this.add.dom(width * 0.5, height * 0.5 - 100).createFromCache('sizeslider');

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
        }
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
