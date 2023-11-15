import "./style.css";
import Phaser from "phaser";
const TILE_SIZE = 18;
const PLAYER_ANIMAS = {
  idle: "idle",
  walk: "walk",
  run: "run",
  attack: "attack",
};
class MainScene extends Phaser.Scene {
  constructor() {
    super("main-scene");
    this.player;
    this.map;
    this.cursors;
  }
  preload() {
    this.load.atlas("Robot", "Robot.png", "Robot.json");
    this.load.image("Marble", "tilesets/marble.png");
    this.load.image("Rock", "tilesets/rock.png");
    this.load.image("Sand", "tilesets/sand.png");
    this.load.image("Stone", "tilesets/stone.png");
    this.load.tilemapTiledJSON("map", "tilesets/map.json");
  }
  create() {
    const { height, width } = this.scale;
    this.map = this.make.tilemap({ key: "map" });
    const marbleTiles = this.map.addTilesetImage("marble", "Marble");
    const rockTiles = this.map.addTilesetImage("rock", "Rock");
    const sandTiles = this.map.addTilesetImage("sand", "Sand");
    const stoneTiles = this.map.addTilesetImage("stone", "Stone");
    this.map.createLayer("Tile Layer 9", [marbleTiles, rockTiles], 0, 0);
    this.map.createLayer("Tile Layer 10", [marbleTiles, rockTiles], 0, 0);
    const platformLayer = this.map.createLayer(
      "Platforms",
      [marbleTiles, rockTiles, sandTiles, stoneTiles],
      0,
      0
    );
    this.player = this.physics.add.sprite(width / 2, height / 2, "Robot");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.5)
    this.player.anims.create({
      key: "run",
      frames: this.player.anims.generateFrameNames("Robot", {
        start: 0,
        end: 2,
        prefix: "character_robot_run",
        suffix: ".png",
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.player.play("run");
    this.cursors = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
      run: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      down: Phaser.Input.Keyboard.KeyCodes.S,
    });
  }
  update() {
    if (this.cursors.left.isDown || this.cursors.leftArrow.isDown) {
      this.player.setVelocityX(-150);
    } else if (this.cursors.right.isDown || this.cursors.rightArrow.isDown) {
      this.player.setVelocityX(150);
    } else {
      this.player.setVelocityX(0);
    }
    if (
      (this.cursors.jump.isDown ||
        this.cursors.up.isDown ||
        this.cursors.upArrow.isDown) &&
      this.player.body.onFloor()
    ) {
      this.player.setVelocityY(-150);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(150);
    }
    let x = this.player.body.velocity.X;
    let y = this.player.body.velocity.Y;
    this.player.flipX = x <0;
  }
}
/**@type {Phaser.Types.Core.GameConfig}*/
const config = {
  type: Phaser.WEBGL,
  width: 40 * TILE_SIZE,
  height: 20 * TILE_SIZE,
  scene: [MainScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};
const game = new Phaser.Game(config);
