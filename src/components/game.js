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
            const randNum = getRandomNumber(0, availableSlots.length);
            const x = availableSlots[randNum][0];
            const y = availableSlots[randNum][1];
            gameBoard[x][y] = "m";
            availableSlots.splice(randNum, 1);
            mines--;
        }
        return gameBoard;
    }
    



    render() {
        console.log("STATE", this.state)
        const { gameBoardWithMines, userViewGameBoard } =this.state;
        return (
            <div class="game-container">

                
            </div>
        );
    }
}

export default Game;