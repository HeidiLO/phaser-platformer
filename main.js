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
    let player = this.physics.add.sprite(width / 2, height / 2, "Robot");
    player.setCollideWorldBounds(true);
    player.anims.create({
      key: "run",
      frames: player.anims.generateFrameNames("Robot", {
        start: 0,
        end: 2,
        prefix: "character_robot_run",
        suffix: ".png",
      }),
      frameRate: 12,
      repeat: -1,
    });
    player.play("run");
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
    })
  };
  update() {}
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
