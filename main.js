import "./style.css";
import Phaser from "phaser";
class MainScene extends Phaser.Scene {
  constructor() {
    super("main-scene");
  }
  preload() {
    this.load.atlas("Robot", "Robot.png", "Robot.json");
  }
  create() {
    const { height, width } = this.scale;
    let player = this.add.sprite(width / 2, height / 2, "Robot");
    player.anims.create({
      key: "run",
      frames: player.anims.generateFrameNames("Robot", {
        start: 0,
        end: 2,
        prefix: "character_robot_run",
        suffix: ".png"
      }),
      frameRate: 12,
      repeat: -1,
    });
   // player.play("run")
  }
  create() {
    const { height, width } = this.scale;
    let player = this.add.sprite(width / 2, height / 2, "Robot");
    player.anims.create({
      key: "walk",
      frames: player.anims.generateFrameNames("Robot", {
        start: 0,
        end: 7,
        prefix: "character_robot_walk",
        suffix: ".png"
      }),
      frameRate: 12,
      repeat: -1,
    });
    player.play("walk")
  }
  create() {
    const { height, width } = this.scale;
    let player = this.add.sprite(width / 2, height / 2, "Robot");
    player.anims.create({
      key: "attack",
      frames: player.anims.generateFrameNames("Robot", {
        start: 0,
        end: 2,
        prefix: "character_robot_attack",
        suffix: ".png"
      }),
      frameRate: 1200,
      repeat: -1,
    });
    player.play("attack")
  }
  update() {}
}
/**@type {Phaser.Types.Core.GameConfig}*/
const config = {
  type: Phaser.WEBGL,
  width: 400,
  height: 400,
  scene: [MainScene],
};
const game = new Phaser.Game(config);