import Phaser from 'phaser';
import MainMenu from './scenes/MainMenu';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';

export default new Phaser.Game({
  // config
  type: Phaser.AUTO,
  width: window.innerWidth, // 768
  height: window.innerHeight, // 736
  scene: [MainMenu, Game, GameOver],
  parent: 'battleships',
  dom: {
    createContainer: true,
  },
});
