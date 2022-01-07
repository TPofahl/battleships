import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  init(data) {
    this.winner = data.winner;
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    const { width, height } = this.scale;

    this.add
      .text(width * 0.5, height * 0.5, 'Game Over', {
        fontSize: 48,
      })
      .setOrigin(0.5);
    this.add.text(400, 400, `${this.winner} wins`);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('game');
    });
  }
}
