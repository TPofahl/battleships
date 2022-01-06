import Phaser from 'phaser';

let gameStart = false;

export default class MainMenu extends Phaser.Scene{
  constructor(){
    super('main-menu')
  }

  preload() {
      this.load.html('nameform', 'assets/components/nameform.html');
  }

  create(){
    let userText = null;
    const width = this.scale.width;
    const height = this.scale.height;

    let element = this.add.dom(width * 0.5, height * 0.5).createFromCache('nameform');
    console.log('AAAAAAAAAAAAAAAAAA', element);

    element.addListener('click');
    element.on('click', function (event) {
        if (event.target.name === 'playButton') {
            let inputText = this.getChildByName('nameField');
            if (inputText.value !== '') {
                this.removeListener('click');
                start = true;
            }
        }
    });
  }

  update() {
    if (start === true) this.scene.start('game');
  }
}
