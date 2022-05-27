class SceneMain extends Phaser.Scene {
  constructor() {
    super("SceneMain");
  }
  preload() {
    //load our images or sounds
    this.load.image("ball", "images/ball.png");
    this.load.image("block", "images/block.png");
    this.load.image("green", "images/green.png");
  }
  create() {
    this.power = 0;
    //define our objects
    //
    //
    //ball
    this.ball = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      0,
      "ball"
    );
    this.ball.setGravityY(200);
    //
    //
    //
    //ground
    //
    //
    let ground = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height * 0.95,
      "block"
    );
    ground.displayWidth = this.sys.game.config.width * 1.1;
    ground.setImmovable();
    //
    //
    //
    //set collider
    //
    //
    this.physics.add.collider(this.ball, ground);
    this.input.on("pointerdown", this.startJump, this);
    this.input.on("pointerup", this.endJump, this);
    this.aGrid = new AlignGrid({
      scene: this,
      rows: 11,
      cols: 11,
    });
    //  this.aGrid.showNumbers();
    this.meter = this.add.image(0, 0, "green");
    this.aGrid.placeAtIndex(100, this.meter);
    this.meter.setOrigin(1, 1);
    this.meter.scaleY = 0;
  }
  endJump() {
    this.timer.remove();
    this.ball.setVelocityY(-this.power * 100);
    this.power = 0;
    this.meter.scaleY = 0;
  }
  startJump() {
    this.timer = this.time.addEvent({
      delay: 100,
      callback: this.tick,
      callbackScope: this,
      loop: true,
    });
  }
  tick() {
    if (this.power < 5) {
      this.power += 0.5;
      this.meter.scaleY = this.power;
      console.log(this.power);
    }
  }
  update() {
    //constant running loop
  }
}
