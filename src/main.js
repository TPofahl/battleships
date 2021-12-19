import Phaser from './lib/phaser.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';

export default new Phaser.Game({//config
  type: Phaser.AUTO,
  width: 768,
  height: 736,
  scene: [Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      debug: false//show collision boxes
    }
  }
})
