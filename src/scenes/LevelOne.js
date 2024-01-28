import { Scene } from "phaser";

export class LevelOne extends Scene {
  cursors;
  player;
  explosion;
  dude_dies;
  platforms;
  timedEvent;
  text;
  healthyPool = [];
  unhealthyPool = [];
  active = []; // Initialize active as an empty array
  score = 0;

  constructor() {
    super("LevelOne");
  }

  create() {
    this.createAnimations();
    this.createSoundEffects();
    this.createBackground();
    this.createPlatforms();
    this.createPlayer();
    this.createExplosion();
    this.createPool();

    //  Every 250ms we'll release an food
    this.time.addEvent({
      delay: 250,
      callback: () => this.releaseFood(),
      loop: true,
    });
    this.createTimer();
    this.handleFoodCollisions();

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.handlePlayerMovement();
    this.checkFoodBounds();
    this.updateTimer();
  }

  createAnimations() {
    this.anims.create({
      key: "eaten",
      frames: "boom",
      frameRate: 20,
      showOnStart: true,
      hideOnComplete: true,
    });

    this.createAnimationPerson("dude_s");
  }

  createAnimationPerson(dudeSize) {
    this.anims.remove("left");
    this.anims.remove("right");
    this.anims.remove("turn");

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(dudeSize, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: dudeSize, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(dudeSize, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  createTimer() {
    this.text = this.add.text(32, 32);

    this.timedEvent = this.time.addEvent({
      delay: 30000,
      callback: () => this.nextScene(),
      callbackScope: this,
      loop: true,
    });
  }
  updateTimer() {
    this.text.setText(
      `Timer: ${this.timedEvent.getRemainingSeconds().toFixed(1)} seconds`
    );
  }
  createSoundEffects() {
    this.walk = this.sound.add("walk", { volume: 0.1 });
    this.eating = this.sound.add("humm");
    this.burp = this.sound.add("burp");
  }

  createBackground() {
    this.add.image(512, 340, "scene_1");
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 575, "ground").setScale(3).refreshBody();
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 550, "dude_s");
    this.player.setCollideWorldBounds(true);
  }

  createExplosion() {
    this.explosion = this.add.sprite(0, 0, "boom").setVisible(false);
  }

  playWalkSound() {
    if (!this.walk.isPlaying) {
      this.walk.play();
    }
  }

  handlePlayerMovement() {
    const { left, right } = this.cursors;

    if (left.isDown) {
      this.player.setVelocityX(-300);
      this.player.anims.play("left", true);
      this.playWalkSound();
    } else if (right.isDown) {
      this.player.setVelocityX(300);
      this.player.anims.play("right", true);
      this.playWalkSound();
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }
  }

  checkFoodBounds() {
    const { world } = this.physics;
    for (let i = this.active.length - 1; i >= 0; i--) {
      const food = this.active[i];

      if (food && food.y > 700) {
        this.recycleFood(food);
      }
    }
  }

  createPool() {
    for (let i = 0; i < 10; i++) {
      this.healthyPool.push(
        this.physics.add
          .sprite(0, 0, "apple")
          .setActive(false)
          .setVisible(false)
      );
      this.unhealthyPool.push(
        this.physics.add
          .sprite(0, 0, "donut")
          .setActive(false)
          .setVisible(false)
      );
    }
  }

  releaseFood() {
    let pool, frames;
    if (Phaser.Math.Between(0, 10) === 0) {
      pool = this.healthyPool;
      frames = ["apple", "bananas", "watermelon"];
    } else {
      pool = this.unhealthyPool;
      frames = ["donut", "pizza", "chips"];
    }

    const food = pool.find((f) => !f.active);
    if (food) {
      food.setTexture(Phaser.Utils.Array.GetRandom(frames));
      food.setPosition(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(-1200, 0)
      );
      food
        .setActive(true)
        .setVisible(true)
        .setVelocity(0, Phaser.Math.Between(100, 200));

      this.active.push(food);
    }
  }

  handleFoodCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.healthyPool,
      this.collectHealthyFood,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.unhealthyPool,
      this.collectUnhealthyFood,
      null,
      this
    );
    console.log(this.score);
  }

  collectHealthyFood(player, food) {
    console.log("Collected healthy food");
    this.explosion.copyPosition(food).play("eaten");
    if (!this.eating.isPlaying) {
      this.score--;
      this.eating.play();
      this.handleDudeSize();
    }
    this.recycleFood(food);
  }

  collectUnhealthyFood(player, food) {
    console.log("Collected unhealthy food");
    this.explosion.copyPosition(food).play("eaten");
    if (!this.burp.isPlaying) {
      this.score++;
      this.burp.play();
      this.handleDudeSize();
    }
    this.recycleFood(food);
  }

  handleDudeSize() {
    console.log(this.score);
    if (this.score < 3) {
      this.createAnimationPerson("dude_s");
    } else if (this.score > 2 && this.score < 4) {
      this.createAnimationPerson("dude_m");
    } else if ((this.score = 4)) {
      this.createAnimationPerson("dude_l");
    } else if ((this.score = 5)) {
      this.nextScene();
    }
  }

  recycleFood(food) {
    food.setActive(false).setVisible(false);
    this.active.splice(this.active.indexOf(food), 1);
  }

  nextScene() {
    this.scene.start("GameOver");
  }
}
