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
      .text(
        400,
        310,
        "Credits :\nRestaurant Backgrounds:\nhttps://lornn.itch.io/backgrounds-restaurants-and-cafes\nEmojis:\nhttps://kaboff.itch.io/128-emoji-pixel-art\nChubby Character:\nhttps://opengameart.org/content/bob\nSmoke Animations:\nhttps://pimen.itch.io/smoke-vfx-1\nSounds:\nPixbay.com\nmixkit.co\n",
        {
          fontFamily: "Arial Black",
          fontSize: 14,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("Boot");
    });
  }
}
