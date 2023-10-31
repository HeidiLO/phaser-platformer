import './style.css'
import Phaser from 'phaser'
class MainScene extends Phaser.Scene{
  constructor(){
    super ("main-scene")
  }
  preload(){
    this.load.atlas("Robot", "Robot.png", "Robot.json");
  }
  create(){
    const {height, width} = this.scale;
    let player = this.add.sprite(width/2, height/2, "Robot")
  }
  update(){}
}
/**@type {Phaser.Types.Core.GameConfig}*/
const config = {
  type: Phaser.WEBGL,
  width: 400,
  height: 400,
  scene: [MainScene]
};
const game = new Phaser.Game(config)