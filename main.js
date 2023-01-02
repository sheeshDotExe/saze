import { globals } from "./globals.js";
import { Grid } from "./grid.js";
import { randomLevel, findLegalPaths } from "./levelGenerator.js";
import { Player } from "./player.js";
/**
 * Inits the global vars
 */
function init() {
  globals.BOARD_INSTANCE = document.querySelector(".game-board");
  findLegalPaths(
    globals.START_COORDINATE,
    globals.BOARD_WIDTH,
    globals.BOARD_HEIGHT,
    [globals.START_COORDINATE]
  );
}

class Game {
  constructor() {
    this.grid = new Grid(
      globals.BOARD_WIDTH,
      globals.BOARD_HEIGHT,
      globals.BOARD_INSTANCE
    );
    this.player = new Player(globals.START_COORDINATE);
    this.score = 0;
    this.scoreDisplay = document.querySelector(".score");
    this.updateScore();
  }

  updateScore() {
    this.scoreDisplay.innerHTML = "Score: " + this.score;
  }

  onKeyPress(event) {
    if (!this.player.canMove()) {
      return;
    }
    const key = event.key.toLowerCase();
    const legalMoves = this.grid.getLegalMoves(this.player.head);
    for (const move in legalMoves) {
      if (key === move) {
        this.player.move(legalMoves[move]);
        this.player.draw(this.grid);

        if (this.player.visited.length === this.grid.width * this.grid.height) {
          this.score++;
          this.updateScore();
          this.newLevel();
        }
        break;
      }
    }
  }

  newLevel() {
    this.path = randomLevel(globals.BOARD_WIDTH, globals.BOARD_HEIGHT);
    this.grid.clearPath();
    this.grid.setPath(this.path);
    this.player.clear(this.grid);
    this.player.draw(this.grid);
  }
}

window.onload = () => {
  init();
  const game = new Game();
  game.newLevel();

  window.addEventListener("keypress", (event) => {
    game.onKeyPress(event);
  });
  /*
  const id = setInterval(() => {
    game.newPath();
  }, 1000);
  */
};
