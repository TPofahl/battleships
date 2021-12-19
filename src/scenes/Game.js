import Phaser from '../lib/phaser.js';

const boardSize = 10;

export default class Game extends Phaser.Scene{

  constructor(){
    super('game')
  }

  init(){

  }

  preload(){
    this.load.image('water', 'assets/water-tile.png');
    this.load.image('a-button', 'assets/button-a.png');
    this.load.image('b-button', 'assets/button-b.png');
    this.load.image('up-button', 'assets/button-up.png');
    this.load.image('down-button', 'assets/button-down.png');
    this.load.image('left-button', 'assets/button-left.png');
    this.load.image('right-button', 'assets/button-right.png');
  }


  create(){
    let boardLength = boardSize * 32;//game uses 32x32 tiles
    let BoardStartX = 112;
    let playerBoardStartY = 400;
    let computerBoardStartY = 48;

    //game controller
    this.add.image(580, 350, 'a-button').setScale(1.2);
    this.add.image(580, 400, 'b-button').setScale(1.2);
    this.add.image(500, 345, 'up-button').setScale(1.2);
    this.add.image(500, 405, 'down-button').setScale(1.2);
    this.add.image(470, 375, 'left-button').setScale(1.2);
    this.add.image(530, 375, 'right-button').setScale(1.2);

    //Create game board for computer
    for (let y = 0; y < boardLength; y = y + 32) {
      for (let x = 0; x < boardLength; x = x + 32) {
        this.add.image(x + BoardStartX, computerBoardStartY, 'water').setScale(1.0);
      }
      computerBoardStartY = computerBoardStartY + 32;
    }
    //crete game board for player
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
