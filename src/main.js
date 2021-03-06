import Phaser from 'phaser';
import Screen from './scenes/Screen';
import MainMenu from './scenes/MainMenu';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';

export default new Phaser.Game({
  // config
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#030832',
  scene: [Screen, MainMenu, Game, GameOver],
  parent: 'battleships',
  dom: {
    createContainer: true,
  },
});
