import { Scene } from 'phaser';

export class LevelOne extends Scene
{
    cursors;
    player;

    constructor ()
    {
        super('LevelOne');
    }

    create ()
    {   
        this.createAnims();

        this.add.image(600, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(3).refreshBody();

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setCollideWorldBounds(true);

        this.explosion = this.add.sprite(0, 0, 'boom').setVisible(true);

        this.bombs = this.physics.add.group({
            key: 'bomb',
            quantity: 5,
            setXY: { x: 50, y: 10, stepX: 70, stepY: 0 },
            collideWorldBounds: true,
            velocityX: 0,
            velocityY:0,
            Immovable:true
        });

        this.physics.add.collider(this.bombs, this.platforms, (bomb) => {
            setTimeout(() => {
                this.explosion.copyPosition(bomb).play('explode');
                bomb.destroy();
            }, 5000);
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        const bombsCollider = this.physics.add.overlap(this.player, this.bombs, (player, bomb) =>
        {
            this.explosion.copyPosition(bomb).play('explode');
            bomb.destroy();
        });

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update ()
    {
        const { left, right } = this.cursors;

        if (left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

    }

    createAnims ()
    {
        this.anims.create({
            key: 'explode',
            frames: 'boom',
            frameRate: 20,
            showOnStart: true,
            hideOnComplete: true
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

}
