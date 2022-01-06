import Phaser from '../lib/phaser.js';

export default class MainMenu extends Phaser.Scene{
  constructor(){
    super('main-menu')
  }

  preload() {
      this.load.html('nameform', '../../assets/components/nameform.html');
  }

  create(){
      console.log('main menu');
    const width = this.scale.width;
    const height = this.scale.height;
    /*
    let text = this.add.text(width * 0.5, height * 0.5, 'Press space to start', {
    fontSize: 24
    }).setOrigin(0.5);
    */
    let element = this.add.dom(400,400).createFromCache('nameform');

    element.addListener('click');
    element.on('click', function (event) {
        if (event.target.name === 'playButton') {
            let inputText = this.getChildByName('nameField');
            if (inputText.value !== '') {
                this.removeListener('click');
                this.setVisible(false);
                this.scene.start('game');
            }
        }
    }, this);
    /*
    //this.cameras.main.fadeIn(1000, 0,0,0);
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('game');
    });
    */
  }
}
