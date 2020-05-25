import { getRandomNumber } from "./random_number"

export const gameRef = [
    {
        h: 9,
        w: 9,
        mines: 10,
    },{
        h: 16,
        w: 16,
        mines: 40,
    },{
        h: 16,
        w: 30,
        mines: 99,
    }
]

export const directionRef = {
    upLeft: {y: -1, x: -1},
    up: {y: 0, x: -1},
    upRight: {y: 1, x: -1},
    right: {y: 1, x: 0},
    downRight: {y: 1, x: 1},
    down: {y: 0, x: 1},
    downLeft: {y: -1, x: 1},
    left: {y: -1, x: 0},
}

export const buildGameBoard = ({h, w, mines}, addMines) => {
    const gameBoard = [];
    const availableSlots = [];
    for (let i = 0; i < w; i++) {
        gameBoard.push([]);
        for (let j = 0; j < h; j++) {
            gameBoard[i].push(0)
            availableSlots.push([i, j]);
        }
    }
    if (addMines) {
        return addMinesToGameBoard(availableSlots, gameBoard, {h, w, mines})
    }
    return gameBoard;
}

export const countFlags = (gameBoard) => {
    let count = 0;
    for (let i=0; i < gameBoard.length; i++){
        for (let j=0; j < gameBoard[0].length; j++) {
            if (gameBoard[i][j] === "f") {
                count++
            }
        }
    }
    return count;
}

export const addMinesToGameBoard = (availableSlots, gameBoard, {h, w, mines}) => {
    while(mines) {
        const randNum = getRandomNumber(0, availableSlots.length -1);
        const y = availableSlots[randNum][0];
        const x = availableSlots[randNum][1];
        gameBoard[y][x] = "m";
        availableSlots.splice(randNum, 1);
        mines--;
    }

    for (let y = 0; y < gameBoard.length; y++) {
        for (let x = 0; x < gameBoard[y].length; x++) {
            if (gameBoard[y][x] === "m") {
                addNumbers(y, x, gameBoard, {h, w, mines});
            }
        }
    }
    return gameBoard;
}

export const addNumbers = (y, x, gameBoardWithMines, {h, w, mines}) => {
    for (const key in directionRef) {
        const nextX = x + directionRef[key].x;
        const nextY = y + directionRef[key].y;
        if (checkIfOffBoard(nextY, nextX, {h, w, mines})) {
            continue;
        }
        if (gameBoardWithMines[nextY][nextX] === "m") {
            continue;
        }
        gameBoardWithMines[nextY][nextX] = gameBoardWithMines[nextY][nextX] + 1;
    }
}

export const checkIfOffBoard = (y, x, {h, w, mines}) => {
    if (x >= h || x < 0) return true;
    if (y >= w || y < 0) return true;
    return null;
}
