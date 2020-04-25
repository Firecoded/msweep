import React, { Component } from 'react';

import { getRandomNumber } from "../helpers/random_number";

const gameRef = {
    beginner: {
        h: 9,
        w: 9,
        mines: 10,
    },
    intermediate: {
        h: 16,
        w: 16,
        mines: 40,
    },
    expert: {
        h: 16,
        w: 30,
        mines: 99
    }
}

const directionRef = {
    upLeft: {y: -1, x: -1},
    up: {y: 0, x: -1},
    upRight: {y: 1, x: -1},
    right: {y: 1, x: 0},
    downRight: {y: 1, x: 1},
    down: {y: 0, x: 1},
    downLeft: {y: -1, x: 1},
    left: {y: -1, x: 0},
}

class Game extends Component {
    constructor(props) {
        super(props)
        this.state={
            difficultyLevel: "expert",
            userViewGameBoard: [],
            gameBoardWithMines: [],
        }
        this.gameParams = gameRef[this.state.difficultyLevel];
    }

    componentDidMount() {
        const newState = {
            userViewGameBoard: this.buildGameBoard(this.gameParams, false),
            gameBoardWithMines: this.buildGameBoard(this.gameParams, true)
        }
        this.setState(() => newState)
    }

    buildGameBoard = ({h, w, mines}, addMines) => {
        const gameBoard = [];
        const availableSlots = [];
        for (let i = 0; i < w; i++) {
            gameBoard.push([]);
            for (let j = 0; j < h; j++) {
                gameBoard[i].push(" ")
                availableSlots.push([i, j]);
            }
        }
        if (addMines) {
            return this.addMines(availableSlots, gameBoard, mines)
        }
        return gameBoard;
    }

    addMines = (availableSlots, gameBoard, mines) => {
        while(mines) {
            const randNum = getRandomNumber(0, availableSlots.length -1);
            const y = availableSlots[randNum][0];
            const x = availableSlots[randNum][1];
            gameBoard[y][x] = "m";
            availableSlots.splice(randNum, 1);
            mines--;
        }
        return this.checkToAddNumbers(gameBoard);
    }

    checkToAddNumbers = (gameBoardWithMines) => {
        for (let y = 0; y < gameBoardWithMines.length; y++) {
            for (let x = 0; x < gameBoardWithMines[y].length; x++) {
                if (gameBoardWithMines[y][x] === "m") {
                    this.addNumbers(y, x, gameBoardWithMines);
                }
            }
        }
        return gameBoardWithMines;
    }

    addNumbers = (y, x, gameBoardWithMines) => {
        for (const key in directionRef) {
            const nextX = x + directionRef[key].x;
            const nextY = y + directionRef[key].y;
            if (this.checkIfOffBoard(nextY, nextX)) {
                continue;
            }
            // console.log(nextX, nextY, this.gameParams.w, this.gameParams.h)
            if (gameBoardWithMines[nextY][nextX] === "m") {
                continue;
            }
            if (gameBoardWithMines[nextY][nextX] === " ") {
                gameBoardWithMines[nextY][nextX] = 1;
                continue;
            }
            gameBoardWithMines[nextY][nextX] = gameBoardWithMines[nextY][nextX] + 1;
        }
    }

    checkIfOffBoard = (y, x) => {
        if (x >= this.gameParams.h || x < 0) return true;
        if (y >= this.gameParams.w || y < 0) return true;
        return null;
    }

    render() {
        console.log("STATE", this.state)
        return (
            <div className="game-container">                
            </div>
        );
    }
}

export default Game;