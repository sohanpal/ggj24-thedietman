import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  preload() {
    this.load.image("dead_bg", "assets/scene_1_dead.png");
    this.load.audio("negative_beeps", "assets/sounds/negative_beeps.mp3");
    this.load.audio("sad", "assets/sounds/sad.mp3");
  }

  create() {
    this.add.image(400, 300, "dead_bg");
    this.sound.add("negative_beeps").play();
    this.sound.add("sad").play();
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
