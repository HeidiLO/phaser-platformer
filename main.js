import "./style.css";
import Phaser from "phaser";
const TILE_SIZE = 18;
const WIDTH = 40 * TILE_SIZE;
const HEIGHT = 20 * TILE_SIZE;
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
    this.coins;
    this.jumpNoise;
    this.coinNoise;
    this.noise;
  }
  preload() {
    this.load.atlas("Robot", "Robot.png", "Robot.json");
    this.load.image("Marble", "tilesets/marble.png");
    this.load.image("Rock", "tilesets/rock.png");
    this.load.image("Sand", "tilesets/sand.png");
    this.load.image("Stone", "tilesets/stone.png");
    this.load.tilemapTiledJSON("map", "tilesets/map.json");
    this.load.image("coin", "coin.png");
    this.load.audio("coin-noise", "coin.mp3");
    this.load.audio("jump-noise", "jump.wav");
    this.load.audio("noise", "background-music.mp3");
    this.load.image("spike", "spikeBall.png");
    this.load.audio("dead", "die.mp3");
    this.load.audio("music", "music.mp3");
  }
  create() {
    let playerSpawn = {
      x: WIDTH /2,
      y: HEIGHT/2,
    };
    let spikeSpawn = {
      x: WIDTH /3,
      y: HEIGHT /3,
    }
    this.physics.world.setBounds(0,0,WIDTH, HEIGHT);
    this.coinNoise = this.sound.add("coin-noise", {
      volume: 0.5
    });
    this.jumpNoise = this.sound.add("jump-noise",{
      volume: 0.5
    });
    this.dead = this.sound.add("dead",{
      volume: 2,
    })
    this.noise = this.sound.add("noise",{
      loop: true,
      volume: 0.5
    });
    this.music = this.sound.add("music",{
      loop: true,
      volume: 0.75
    });
    this.noise.play();
    this.music.play();
    const { height, width } = this.scale;
    this.map = this.make.tilemap({ key: "map" });
    const objectLayer = this.map.getObjectLayer("objects");
    objectLayer.objects.forEach((o)=>{
      const{x = 0, y = 0, name, width = 0, height = 0} = o;
      switch(name){
        case"player-spawn":
        playerSpawn.x = x+width/2;
        playerSpawn.y = y + height/2
      }
    })
    objectLayer.objects.forEach((o)=>{
      const{x = 0, y = 0, name, width = 0, height = 0} = o;
      switch(name){
        case"enemy-spawn":
        spikeSpawn.x = x+width/4;
        spikeSpawn.y = y + height/4;
      }
    })
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
    platformLayer.setCollisionByProperty({collides:true});
    this.coins = this.physics.add.group({
      key: "coin",
      quantity: 12,
      setXY: {x: 18 * 4, y: 0, stepX: 18*3},
      setScale: {x: 0.20, y: 0.20},
    });
    this.coins.children.iterate((coin)=>{
      coin
        .setCircle(40)
        .setCollideWorldBounds(true)
        .setBounce(Phaser.Math.FloatBetween(0.4, 0.8))
        .setVelocityX(Phaser.Math.FloatBetween(-10,10));
    })
    this.physics.add.collider(this.coins, platformLayer);
    this.physics.add.collider(this.coins, this.coins);
    this.player = this.physics.add.sprite(playerSpawn.x, playerSpawn.y, "Robot",);
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      undefined,
      this
    )
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platformLayer);
    this.player.setBounce(0.5)
    this.player.setScale(0.4)
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
    this.spike = this.physics.add.group({
      key: "spike",
      quantity: 4,
      setXY: {x: 18 * 4, y: 0, stepX: 18*3},
      setScale: {x: 0.15, y: 0.15},
    });
    this.spike.children.iterate((coin)=>{
      coin
        .setCircle(40)
        .setCollideWorldBounds(true)
        .setBounce(Phaser.Math.FloatBetween(0.2, 0.5))
        .setVelocityX(Phaser.Math.FloatBetween(-5,5));
    })
    this.physics.add.collider(this.spike, platformLayer);
    this.physics.add.overlap(
      this.player,
      this.spike,
      this.die,
      undefined,
      this
    )
    this.physics.add.collider(this.coins, this.spike);
    this.physics.add.collider(this.spike, this.spike);
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
      downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
      loud: Phaser.Input.Keyboard.KeyCodes.M,
      quite: Phaser.Input.Keyboard.KeyCodes.L,
    });
    this.cameras.main.setBounds(0,0, WIDTH,HEIGHT);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 7;
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
      this.jumpNoise.play();
      this.player.setVelocityY(-175);
    } else if (this.cursors.down.isDown || this.cursors.downArrow.isDown) {
      this.player.setVelocityY(150);
    }
    if (this.cursors.run.isDown && this.cursors.leftArrow.isDown || this.cursors.run.isDown && this.cursors.left.isDown){
      this.player.setVelocityX(-300)
    }
    if (this.cursors.run.isDown && this.cursors.rightArrow.isDown ||this.cursors.run.isDown && this.cursors.right.isDown ){
      this.player.setVelocityX(300)
    }
    if (this.cursors.run.isDown && this.cursors.upArrow.isDown && this.player.body.onFloor()||this.cursors.run.isDown && this.cursors.up.isDown && this.player.body.onFloor()){
      this.player.setVelocityY(-300)
    }
    let x = this.player.body.velocity.X;
    let y = this.player.body.velocity.Y;
    this.player.flipX = x <0;
    if(this.cursors.loud.isDown){
      this.noise = this.sound.add("noise",{
        loop: true,
        volume: 2.5
      });
       }
    if(this.cursors.quite.isDown){
      this.noise = this.sound.add("noise",{
        loop: true,
        volume: 0.5
      });
    }
  }
 collectCoin(player, coin){
    this.coinNoise.play();
   coin.disableBody(true, true);
  }
  die(player, spike){
    this.dead.play();
   player.disableBody(true, true);
  }
}
/**@type {Phaser.Types.Core.GameConfig}*/
const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [MainScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};
const game = new Phaser.Game(config);
