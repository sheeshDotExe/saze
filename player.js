import { globals } from "./globals.js";

export class Player {
  constructor(startCoord) {
    this.startCoord = startCoord;

    this.visitedLinks = [];
    this.visited = [this.startCoord];
    this.head = this.visited[this.visited.length - 1];

    this.moveCooldown = 0;
    this.lastMove = Date.now();
  }

  canMove() {
    if (Date.now() - this.lastMove >= this.moveCooldown) {
      return true;
    } else {
      this.moveCooldown -= Date.now() - this.lastMove;
      return false;
    }
  }

  move(direction) {
    for (const visited of this.visited) {
      if (
        this.head[0] + direction[0][0] == visited[0] &&
        this.head[1] + direction[0][1] == visited[1]
      ) {
        return;
      }
    }

    this.visited.push([
      this.head[0] + direction[0][0],
      this.head[1] + direction[0][1],
    ]);
    this.visitedLinks.push(direction[1]);
    this.head = this.visited[this.visited.length - 1];
    this.moveCooldown = globals.MOVE_COOLDOWN;
    this.lastMove = Date.now();
  }

  clear(display) {
    for (const coord of this.visited) {
      display.clearNode(coord);
    }

    for (const coord of this.visitedLinks) {
      display.hideLink(coord);
    }

    this.visitedLinks = [];
    this.visited = [this.startCoord];
    this.head = this.visited[this.visited.length - 1];
  }

  draw(display) {
    for (const coord of this.visited) {
      display.setNode(coord);
    }
    for (const coord of this.visitedLinks) {
      display.showLink(coord);
    }
  }
}
