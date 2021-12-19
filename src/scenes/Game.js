import Phaser from '../lib/phaser.js';
import Carrot from '../game/carrot.js';
    const boardSize = 10;
export default class Game extends Phaser.Scene{

  constructor(){
    super('game')
  }

  init(){

  }

  preload(){
    this.load.image('water', 'assets/water-tile.png');
  }


  create(){
    let boardLength = boardSize * 32;
    let BoardStartX = 112;
    let playerBoardStartY = 400;
    let computerBoardStartY = 48;

    //console.log(boardLength);
    for (let y = 0; y < boardLength; y = y + 32) {
      for (let x = 0; x < boardLength; x = x + 32) {
        this.add.image(x + BoardStartX, computerBoardStartY, 'water').setScale(1.0);
      }
      computerBoardStartY = computerBoardStartY + 32;
    }

    for (let y = 0; y < boardLength; y = y + 32) {
      for (let x = 0; x < boardLength; x = x + 32) {
        this.add.image(x + BoardStartX, playerBoardStartY, 'water').setScale(1.0);
      }
      playerBoardStartY = playerBoardStartY + 32;
    }
  }


  update(){

  }

}
