export const paths = [];

function addCord(first, second) {
  return [first[0] + second[0], first[1] + second[1]];
}

function contains(list, item) {
  for (const element of list) {
    if (item[0] === element[0] && item[1] === element[1]) {
      return true;
    }
  }
  return false;
}

function getLegalMoves(coord, width, height, checked) {
  const moves = [];
  if (coord[0] > 0 && !contains(checked, [coord[0] - 1, coord[1]])) {
    moves.push([-1, 0]);
  }
  if (coord[0] < width - 1 && !contains(checked, [coord[0] + 1, coord[1]])) {
    moves.push([1, 0]);
  }
  if (coord[1] > 0 && !contains(checked, [coord[0], coord[1] - 1])) {
    moves.push([0, -1]);
  }
  if (coord[1] < height - 1 && !contains(checked, [coord[0], coord[1] + 1])) {
    moves.push([0, 1]);
  }
  return moves;
}

// walking algorithm using recursion
export function findLegalPaths(coord, width, height, checked) {
  if (checked.length === width * height) {
    return checked;
  }
  const legalMoves = getLegalMoves(coord, width, height, checked);

  if (legalMoves.length === 0) {
    return null;
  }

  for (const move of legalMoves) {
    const newChecked = [];
    for (const element of checked) {
      newChecked.push(element);
    }
    const newCoord = addCord(coord, move);
    newChecked.push(newCoord);
    const path = findLegalPaths(newCoord, width, height, newChecked);
    if (path) {
      paths.push(path);
    }
  }
  return 0;
}

export function randomPath() {
  if (paths.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * paths.length);
  return paths[index];
}

export function randomLevel(width, height) {
  const path = randomPath();
  const legalPaths = [];
  const links = getLinks(path);
  const finalPath = [];

  for (let y = 0; y < height * 2; y++) {
    for (let x = 1 - (y % 2); x < width * 2 - (1 - (y % 2)); x += 2) {
      const coord = [x, y];
      let shouldAdd = true;
      for (const link of links) {
        if (coord[0] === link[0] && coord[1] === link[1]) {
          shouldAdd = false;
        }
      }
      if (shouldAdd) {
        legalPaths.push(coord);
      }
    }
  }

  for (const link of links) {
    finalPath.push(link);
  }

  const shuffledPaths = legalPaths.sort(() => 0.5 - Math.random());

  for (const link of shuffledPaths.slice(
    0,
    Math.floor(shuffledPaths.length / 2)
  )) {
    finalPath.push(link);
  }

  return [finalPath, links];
}

function getLinks(path) {
  const links = [];
  for (let i = 0; i < path.length - 1; i++) {
    links.push(getRelativeLink(path[i], path[i + 1]));
  }
  return links;
}

function getRelativeLink(first, second) {
  const delta = [second[0] - first[0], second[1] - first[1]];
  if (delta[0] === 1) {
    return calibrate(first[0], first[1] * 2);
  } else if (delta[0] === -1) {
    return calibrate(first[0] - 1, first[1] * 2);
  }
  //
  else if (delta[1] === 1) {
    return calibrate(first[0], second[1] * 2 - 1);
  } else if (delta[1] === -1) {
    return calibrate(first[0], second[1] * 2 + 1);
  }
}

function calibrate(x, y) {
  if (y % 2 === 1) {
    // between y coords
    return [x * 2, y];
  } else {
    // between x coord
    return [x * 2 + 1, y];
  }
}
