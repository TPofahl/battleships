import Phaser from './lib/phaser.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';

export default new Phaser.Game({//config
  type: Phaser.AUTO,
  width: 768,//768
  height: 736,
  scene: [Game, GameOver],
})
