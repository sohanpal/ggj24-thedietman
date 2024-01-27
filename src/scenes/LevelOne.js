import { Scene } from "phaser";

export class LevelOne extends Scene {
  cursors;
  player;

  constructor() {
    super("LevelOne");
  }

  create() {
    this.createAnims();

    this.add.image(512, 340, "scene_1");

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(500, 768, "ground").setScale(3).refreshBody();

    this.player = this.physics.add.sprite(100, 550, "dude");
    this.player.setCollideWorldBounds(true);

    this.explosion = this.add.sprite(0, 0, "boom").setVisible(true);

    //  This array contains all the enemy sprites which are currently active and moving
    this.active = [];

    //  Create a pool of 100 physics bodies.

    //  To achieve this, we need a dummy Game Object they can pull default values from.

    this.pool = [];

    const dummy = this.add.image();
    const { world } = this.physics;

    for (let i = 0; i < 100; i++) {
      const body = new Phaser.Physics.Arcade.Body(world, dummy);

      this.pool.push(body);
    }

    //  Every 250ms we'll release an enemy
    this.time.addEvent({
      delay: 250,
      callback: () => this.releaseEnemy(),
      loop: true,
    });

    // this.pizzas = this.physics.add.group({
    //   key: "pizza",
    //   quantity: 5,
    //   setXY: { x: 50, y: 10, stepX: 70, stepY: 0 },
    //   collideWorldBounds: true,
    //   velocityX: 0,
    //   velocityY: 0,
    //   Immovable: true,
    // });

    // this.physics.add.collider(this.pizzas, this.platforms, (pizza) => {
    //   pizza.destroy();
    // });

    // this.physics.add.collider(this.player, this.platforms);
    // this.physics.add.collider(this.pizzas, this.platforms);

    // const pizzasCollider = this.physics.add.overlap(
    //   this.player,
    //   this.pizzas,
    //   (player, pizza) => {
    //     this.explosion.copyPosition(pizza).play("explode");
    //     pizza.destroy();
    //   }
    // );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const { left, right } = this.cursors;

    if (left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }
    this.checkEnemyBounds();
  }

  createAnims() {
    this.anims.create({
      key: "explode",
      frames: "boom",
      frameRate: 20,
      showOnStart: true,
      hideOnComplete: true,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  checkEnemyBounds() {
    const { world } = this.physics;

    //  Check which enemies have left the screen
    for (let i = this.active.length - 1; i >= 0; i--) {
      const enemy = this.active[i];

      if (enemy.y > 700) {
        //  Recycle this body
        const { body } = enemy;

        //  Remove it from the internal world trees
        world.disableBody(body);

        //  Clear the gameObject references
        body.gameObject = undefined;

        //  Put it back into the pool
        this.pool.push(body);

        //  Nuke the sprite
        enemy.body = undefined;
        enemy.destroy();

        //  Remove it from the active array
        this.active.splice(i, 1);

        //  ^^^ technically, you wouldn't ever destroy the sprite, but instead
        //  put them back into their own pools for later re-use, otherwise there's no
        //  point recycling the physics bodies!
      }
    }
  }

  releaseEnemy() {
    const { pool } = this;

    const body = pool.pop();

    const x = Phaser.Math.Between(0, 800);
    const y = Phaser.Math.Between(-1200, 0);
    const frames = ["pizza", "bread", "chips", "bananas", "milk"];

    const enemy = this.add.image(x, y, Phaser.Utils.Array.GetRandom(frames));

    //  Link the sprite to the body
    enemy.body = body;
    body.gameObject = enemy;

    //  We need to do this to give the body the frame size of the sprite
    body.setSize();

    //  Now you could call 'setCircle' etc as required

    //  Insert the body back into the physics world
    this.physics.world.add(body);

    //  Give it some velocity
    body.setVelocity(0, Phaser.Math.Between(100, 200));

    //  Add to our active pool
    this.active.push(enemy);
  }
}
