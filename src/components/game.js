import React, { Component } from 'react';

import { gameRef, buildGameBoard, directionRef, checkIfOffBoard } from "../helpers/build_gameboard";
import SingleTile from "./single_tile";
import "../styles/game.scss";

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
            userViewGameBoard: buildGameBoard(this.gameParams, false),
            gameBoardWithMines: buildGameBoard(this.gameParams, true)
        }
        this.setState(() => newState)
    }

    changeViewState = (y, x, value) => {
        this.setState((prevState) => {
            prevState.userViewGameBoard[y][x] = value;
            return {
                userViewGameBoard: prevState.userViewGameBoard
            }
        })
    }

    checkNearbyTiles = (startY, startX) => {
        const { gameBoardWithMines, userViewGameBoard } = this.state;
        const {h, w, mines} = this.gameParams;
        const viewsToChange = [];
        for (const key in directionRef) {
            const nextX = startX + directionRef[key].x;
            const nextY = startY + directionRef[key].y;
            if (checkIfOffBoard(nextY, nextX, {h, w, mines})) {
                continue;
            }
            if (gameBoardWithMines[nextY][nextX] === "m") {
                continue;
            }
            if (typeof gameBoardWithMines[nextY][nextX] === "number" && userViewGameBoard[nextY][nextX] === 0){
                viewsToChange.push([nextY, nextX])
            }
        }
        if (viewsToChange.length > 0) {
            let zerosToCheck = [];
            this.setState((prevState) => {
                for (const cord in viewsToChange) {
                    prevState.userViewGameBoard[cord[0]][cord[1]] = "c";
                    for (const key in directionRef) {
                        const nextX = startX + directionRef[key].x;
                        const nextY = startY + directionRef[key].y;
                        if (checkIfOffBoard(nextY, nextX, {h, w, mines})) {
                            continue;
                        }
                        if (gameBoardWithMines[nextY][nextX] === 0) {
                            zerosToCheck.push([nextY, nextX]);
                        }
                        if (typeof gameBoardWithMines[nextY][nextX] === "number" && userViewGameBoard[nextY][nextX] === 0) {
                            prevState.userViewGameBoard[nextY][nextX] = "c";
                        }
                    }
                }
                return {
                    userViewGameBoard: prevState.userViewGameBoard
                }
            }, () => {
                for (const ztc in zerosToCheck) {
                    const y = zerosToCheck[ztc][0];
                    const x = zerosToCheck[ztc][1];
                    this.checkNearbyTiles(y, x);
                }
            })
        }
    }

    render() {
        console.log("STATE", this.state)
        const { userViewGameBoard, gameBoardWithMines } = this.state;
        return (
            <div className="game-container">
                {userViewGameBoard.map((col, i) => {
                    return (
                        <div className="loop1" key={i}>
                            {col.map((r, j) => {
                                return (
                                    <div className="loop2" key={i + " " + j}>
                                        <SingleTile 
                                            viewState={userViewGameBoard[i][j]}
                                            hiddenState={gameBoardWithMines[i][j]}
                                            boardPosition={[i, j]}
                                            changeViewState={this.changeViewState}
                                            checkNearbyTiles={this.checkNearbyTiles}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default Game;