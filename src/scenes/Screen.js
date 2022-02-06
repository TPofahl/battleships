import Phaser from 'phaser';

export default class Screen extends Phaser.Scene {
  constructor() {
    super('screen');
  }

  create() {
    const { width, height } = this.scale;
    this.scene.start('main-menu', { width, height });
  }
}
