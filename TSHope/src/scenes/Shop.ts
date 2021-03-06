import Phaser from "phaser";
import {
  isItClose,
  setPlayer,
  movePlayer,
  overworldExits,
  overworldObjs,
  createAnims,
  interact,
  displayInventory,
  updateText,
  dialogueArea,
} from "../../utils/helper";
import { debugDraw } from "../utils/debug";
import data from "../../public/tiles/craftsman.json";

const shopExits = [
  { x: 733, y: 533, name: "maze" },
  { x: 574, y: 72, name: "shop" },
  { x: 356, y: 449, name: "game" },
  { x: 416, y: 150, name: "dupedoor" },
  { x: 192, y: 150, name: "dupedoor" },
  { x: 687, y: 150, name: "dupedoor" },
];

const dialogue = [
  {
    x: 418,
    y: 159,
    properties: [
      {
        name: "message",
        value: `FINALLY! Whew! I'm finally out! Still no one in sight. Honestly, I'd rather not meet the guy who designed this place anyway. What a creepy memento I found in that dark tunnel back here. A skull... the gent must like gothic things!`,
      },
    ],
    hasAppeared: false,
    mazeExit: true,
  },
  {
    x: 194,
    y: 159,
    properties: [
      {
        name: "message",
        value:
          "FINALLY! Whew! I'm finally out! Still no one in sight. Honestly, I'd rather not meet the guy who designed this place anyway. What a creepy memento I found.",
      },
    ],
    hasAppeared: false,
    mazeExit: true,
  },
  {
    x: 684,
    y: 157,
    properties: [
      {
        name: "message",
        value:
          "FINALLY! Whew! I'm finally out! Still no one in sight. Honestly, I'd rather not meet the guy who designed this place anyway. What a creepy memento I found.",
      },
    ],
    hasAppeared: false,
    mazeExit: true,
  },
  {
    x: 350,
    y: 420,
    properties: [
      {
        name: "message",
        value:
          "Hello? Mr. Neighbor? Huh.. no one here. I should scope out the place.",
      },
    ],
    hasAppeared: false,
  },
];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("shop");
  }

  preload() {
    this.load.image("shop", "tiles/RPGW_HousesAndInt_v1.1/interiors.png");
    this.load.image(
      "props",
      "tiles/RPGW_HousesAndInt_v1.1/decorative_props.png"
    );
    this.load.image("decore", "tiles/RPGW_HousesAndInt_v1.1/furniture.png");

    //Load data (collisions, etc) for the map.
    this.load.tilemapTiledJSON("craftsman", "tiles/craftsman.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    window.scrollTo(400, 400);

    //Create tile sets.
    const map = this.make.tilemap({ key: "craftsman" });
    const crafthouseTileSet = map.addTilesetImage("crafthouse", "shop");
    const decorationsTileSet = map.addTilesetImage("decorations", "decore");
    const propsTileSet = map.addTilesetImage("props", "props");
    const shopTileSets = [crafthouseTileSet, decorationsTileSet, propsTileSet];

    //Building layers.
    map.createLayer("black", crafthouseTileSet);
    map.createLayer("ground", crafthouseTileSet);
    const wallsLayer = map.createLayer("walls", shopTileSets);
    const decoreLayer = map.createLayer("decore", shopTileSets);
    const decorationsLayer = map.createLayer("decorations", shopTileSets);

    this.spawn();
    setPlayer(this.player);
    createAnims(this.anims);

    //Adds collisions
    wallsLayer.setCollisionByProperty({ collides: true });
    decoreLayer.setCollisionByProperty({ collides: true });
    decorationsLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, decoreLayer);
    this.physics.add.collider(this.player, decorationsLayer);

    this.message = this.add.text(800, 750, "", {
      color: "#FFF5EE",
      fontFamily: "Tahoma",
      backgroundColor: "#708090",
      fontSize: "17px",
      align: "center",
      baselineX: 0,
      baselineY: 0,
      padding: 0,
      wordWrap: { width: 350 },
    });
    this.sound.add("item");

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      interact(
        0.03,
        this.message,
        this.player,
        data.layers[5].objects,
        this.sound.add("item")
      );
    }),
      // Hit shift to view Inventory.
      this.cursors.shift.on("down", () => {
        displayInventory(this.message, this.player);
      });
  }

  update(t: number, dt: number) {
    this.playDialogue();
    this.exits();

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }

  exits() {
    let nextToTarget = isItClose(0.03, this.player, shopExits);
    if (nextToTarget) {
      if (nextToTarget.name === "dupedoor") {
        this.sound.play("door");
        let doors = [
          [416, 173],
          [192, 173],
          [687, 173],
        ];
        let chanceDoor = doors[Math.floor(Math.random() * doors.length)];
        this.player.setPosition(chanceDoor[0], chanceDoor[1]);
        this.player.setFrame("shady_front_1");
        return;
      }
      localStorage.setItem("from", `shop`);
      this.scene.stop("shop");
      this.scene.start(nextToTarget.name);
    }
  }

  playDialogue() {
    const mazeSolved = dialogue[0];

    if (localStorage.Skull === `What's it thinking?`) {
      dialogueArea(81, 733, 100, 200, mazeSolved, this.player, this.message);
    }

    let dialogueSpot = isItClose(0.03, this.player, dialogue);
    if (dialogueSpot && !dialogueSpot.hasAppeared) {
      if (this.message.text) this.message.text = "";
      if (dialogueSpot.mazeExit) {
        if (localStorage["from"] !== "maze") {
          return;
        }
        updateText(this.player, dialogueSpot, this.message);
        localStorage.removeItem("from");
        dialogueSpot.hasAppeared = true;
      } else {
        updateText(this.player, dialogueSpot, this.message);
        dialogueSpot.hasAppeared = true;
      }
    }
  }

  spawn() {
    if (localStorage["from"] === "mazeWin") {
      localStorage.removeItem("from");
      let doors = [
        [416, 173],
        [192, 173],
        [687, 173],
      ];
      let chanceDoor = doors[Math.floor(Math.random() * doors.length)];
      this.player = this.physics.add.sprite(
        chanceDoor[0],
        chanceDoor[1],
        "player",
        "shady_front_1"
      );
      this.sound.play("fanfare");
    } else if (localStorage["from"] === "mazeFail") {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(
        644,
        533,
        "player",
        "shady_right_2"
      );
    } else {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(350, 420, "player", "shady_back_1");
    }
  }
}
