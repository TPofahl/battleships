import Phaser from 'phaser';
import MainMenu from './scenes/MainMenu.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';

export default new Phaser.Game({//config
  type: Phaser.AUTO,
  width: 768,//768
  height: 736,
  scene: [MainMenu, Game, GameOver],
  parent: 'battleships',
  dom: {
    createContainer: true
  }
})
