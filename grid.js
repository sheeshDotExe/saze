export class Grid {
  constructor(width, height, container) {
    this.width = width;
    this.height = height;
    this.points = [];

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("div");
      row.className = "row";
      this.points.push([]);

      let length = this.points.length - 1;
      for (let x = 0; x < this.width; x++) {
        const column = document.createElement("div");
        column.className = "col";
        row.appendChild(column);
        this.points[length].push(column);

        if (x < this.width - 1) {
          const colConnection = document.createElement("div");
          colConnection.className = "colCon";
          colConnection.classList.add("connectionInactive");
          row.appendChild(colConnection);
          this.points[length].push(colConnection);
        }
      }

      const rowConnection = document.createElement("div");
      rowConnection.className = "rowCon";
      this.points.push([]);

      length = this.points.length - 1;

      for (let x = 0; x < this.width; x++) {
        const column = document.createElement("div");
        column.className = "colRowCon";
        column.classList.add("connectionInactive");
        rowConnection.appendChild(column);
        this.points[length].push(column);

        if (x < this.width - 1) {
          const colConnection = document.createElement("div");
          colConnection.className = "empty";
          rowConnection.appendChild(colConnection);
          this.points[length].push(colConnection);
        }
      }

      container.appendChild(row);
      if (y < this.height - 1) {
        container.appendChild(rowConnection);
      }
    }
  }

  getLegalMoves(coord) {
    const node = this.getNodeSpace(coord);
    const x = node[0];
    const y = node[1];
    const moves = {};
    if (
      x + 1 < this.width * 2 - 1 &&
      this.points[y][x + 1].classList.contains("connectionActive")
    ) {
      moves["d"] = [
        [1, 0],
        [x + 1, y],
      ];
    }
    if (
      x - 1 >= 0 &&
      this.points[y][x - 1].classList.contains("connectionActive")
    ) {
      moves["a"] = [
        [-1, 0],
        [x - 1, y],
      ];
    }
    if (
      y + 1 < this.height * 2 - 1 &&
      this.points[y + 1][x].classList.contains("connectionActive")
    ) {
      moves["s"] = [
        [0, 1],
        [x, y + 1],
      ];
    }
    if (
      y - 1 >= 0 &&
      this.points[y - 1][x].classList.contains("connectionActive")
    ) {
      moves["w"] = [
        [0, -1],
        [x, y - 1],
      ];
    }

    return moves;
  }

  setPath(coords) {
    for (const coord of coords) {
      this.points[coord[1]][coord[0]].classList.remove("connectionInactive");
      this.points[coord[1]][coord[0]].classList.add("connectionActive");
    }
  }

  getNodeSpace(coord) {
    const x = coord[0];
    const y = coord[1];
    if (y % 2 === 0) {
      // between y coords
      return [x * 2, y * 2];
    } else {
      // between x coord
      return [x * 2, y * 2];
    }
  }

  showLink(coord) {
    this.points[coord[1]][coord[0]].classList.add("linkActive");
  }

  hideLink(coord) {
    this.points[coord[1]][coord[0]].classList.remove("linkActive");
  }

  setNode(coord) {
    const newCoord = this.getNodeSpace(coord);
    const x = newCoord[0];
    const y = newCoord[1];
    this.points[y][x].classList.add("nodeActive");
    this.points[y][x].classList.add("nodeActive");
  }

  clearNode(coord) {
    const newCoord = this.getNodeSpace(coord);
    const x = newCoord[0];
    const y = newCoord[1];
    this.points[y][x].classList.remove("nodeActive");
    this.points[y][x].classList.remove("nodeActive");
  }

  clearPath() {
    for (const row of this.points) {
      for (const element of row) {
        if (!element.classList.contains("col")) {
          element.classList.remove("connectionActive");
          element.classList.add("connectionInactive");
        }
      }
    }
  }
}
