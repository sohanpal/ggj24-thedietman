import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(400, 300, "background");
    this.add.image(400, 400, "start");
    this.startSound = this.sound.add("startSound");
    this.startSound.play();

    this.input.once("pointerdown", () => {
      this.startSound.stop();
      this.sound.add("go").play();
      this.scene.start("Preloader");
    });
  }
}
