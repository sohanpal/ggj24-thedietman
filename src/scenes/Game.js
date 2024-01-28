import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }
  preload() {
    this.load.image("dead_bg", "assets/scene_1_dead.png");
  }

  create() {
    this.add.image(400, 300, "dead_bg");

    this.add
      .text(400, 250, "Creadits :\nand share it with us:\nsupport@phaser.io", {
        fontFamily: "Arial Black",
        fontSize: 14,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("Boot");
    });
  }
}
Restaurant Backgrounds:
https://lornn.itch.io/backgrounds-restaurants-and-cafes

Emojis:
https://kaboff.itch.io/128-emoji-pixel-art

Chubby Character:
https://opengameart.org/content/bob

Smoke Animations:
https://pimen.itch.io/smoke-vfx-1