import { globals } from "./globals.js";
import { Grid } from "./grid.js";
import { randomLevel, findLegalPaths } from "./levelGenerator.js";
import { Player } from "./player.js";
/**
 * Inits the global vars
 */
function init() {
  globals.BOARD_INSTANCE = document.querySelector(".game-board");
  alert("generating levels, this could take a minute!");
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

  calculateScore() {
    const spareLinks = this.player.visitedLinks.length - this.solution.length;
    this.score += globals.SCORE_FOR_BEST_PATH / (spareLinks + 1);

    const timeUsed = Date.now() - this.levelStartTime;
    if (timeUsed < globals.TIME_BEFORE_FALLOFF) {
      this.score += globals.SCORE_FOR_TIME;
    } else {
      this.score += Math.floor(
        globals.SCORE_FOR_TIME /
          Math.max(1, (timeUsed - globals.TIME_BEFORE_FALLOFF) / 1000)
      );
    }
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
          this.calculateScore();
          this.updateScore();
          this.newLevel(false);
        }
        break;
      }
    }
  }

  reset() {
    this.player.clear(this.grid);
    this.player.draw(this.grid);
    this.levelStartTime = Date.now();
  }

  newLevel(deduct) {
    if (deduct && globals.SHOULD_DEDUCT_FOR_NEW_LEVEL) {
      if (this.score >= globals.COST_FOR_NEW_LEVEL) {
        this.score -= globals.COST_FOR_NEW_LEVEL;
        this.updateScore();
      }
    }
    this.level = randomLevel(globals.BOARD_WIDTH, globals.BOARD_HEIGHT);
    this.path = this.level[0];
    this.solution = this.level[1];
    this.grid.clearPath();
    this.grid.setPath(this.path);
    this.player.clear(this.grid);
    this.player.draw(this.grid);
    this.levelStartTime = Date.now();
  }
}

window.onload = () => {
  init();
  const game = new Game();
  game.newLevel();

  document.querySelector(".next-level-button").addEventListener("click", () => {
    game.newLevel(true);
  });

  document.querySelector(".reset-button").addEventListener("click", () => {
    game.reset();
  });

  window.addEventListener("keypress", (event) => {
    game.onKeyPress(event);
  });
};
