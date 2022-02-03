import Phaser from 'phaser';

let gameStart = false;
export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  init(data) {
    this.winner = data.winner; // from 'game' scene
  }

  preload() {
    this.load.html('playButton', 'assets/components/restartbutton.html');
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    const { width, height } = this.scale;
    gameStart = false;

    const element = this.add
      .dom(width * 0.5, height * 0.5 + 150)
      .createFromCache('playButton');

    element.addListener('click');

    element.on('click', function handle() {
      console.log(gameStart);
      this.removeListener('click');
      gameStart = true;
    });

    this.add
      .text(width * 0.5, height * 0.5, 'Game Over', {
        fontSize: 48,
      })
      .setOrigin(0.5);
    this.add.text(width * 0.5 - 39, height * 0.5 + 50, `${this.winner} wins`);
  }

  update() {
    if (gameStart === true) {
      this.scene.start('main-menu');
    }
  }
}
