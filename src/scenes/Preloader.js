import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");
    this.load.image("logo", "logo.png");
    this.load.image("scene_1", "scene_1.png");
    this.load.image("pizza", "Pizza.png");
    this.load.image("bread", "Bread.png");
    this.load.image("chips", "chips.png");
    this.load.image("apple", "apple.png");
    this.load.image("donut", "donut.png");
    this.load.image("watermelon", "watermelon.png");
    this.load.image("bananas", "Bananas.png");
    this.load.image("milk", "Milk.png");
    this.load.image("ground", "platform.png");
    this.load.spritesheet("boom", "pizza_ex.png", {
      frameWidth: 64,
      frameHeight: 64,
      endFrame: 23,
    });

    this.load.spritesheet("dude", "dude_m.png", {
      frameWidth: 128,
      frameHeight: 192,
    });
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("LevelOne");
  }
}
