import React, { Component, Fragment } from 'react';

import { gameRef, buildGameBoard, directionRef, checkIfOffBoard, countFlags } from "../helpers/build_gameboard";
import SingleTile from "./single_tile";
import { NumberContainer } from "./number-container";
import { Timer } from "./timer";
import "../styles/game.scss";

class Game extends Component {
    constructor(props) {
        super(props)
        this.state={
            difficultyLevel: "expert",
            userViewGameBoard: [],
            gameBoardWithMines: [],
            minesMinusFlags: gameRef["expert"].mines,
            timerCount: 0,
            gameHasStarted: false,
        }
        this.gameParams = gameRef[this.state.difficultyLevel];
    }

    componentDidMount() {
        const newState = {
            userViewGameBoard: buildGameBoard(this.gameParams, false),
            gameBoardWithMines: buildGameBoard(this.gameParams, true)
        }
        this.setState(() => newState);
    }

    setGameHasStarted = (gameHasStarted) => {
        const newState = {gameHasStarted};
        this.setState((prevState) => newState);
    }

    startTimer = () => {
        this.interval = setInterval(() => {
            this.setState(({ timerCount }) => ({
                timerCount: timerCount + 1
            }))
        }, 1000)
    }

    stopTimer = () => {
        clearInterval(this.interval);
    }

    restartTimer = () => {
        this.stopTimer()
        const newState = {timerCount: 0};
        this.setState(() => newState, this.startTimer());
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    changeViewState = (y, x, value) => {
        if (!this.gameHasStarted) {
            this.setGameHasStarted(true);
            this.startTimer();
        }
        this.setState((prevState) => {
            prevState.userViewGameBoard[y][x] = value;
            if (value === "f" || value === 0) {
                prevState.minesMinusFlags = this.gameParams.mines - countFlags(prevState.userViewGameBoard);
            }
            return {
                userViewGameBoard: prevState.userViewGameBoard,
                minesMinusFlags: prevState.minesMinusFlags,
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
        const { userViewGameBoard, gameBoardWithMines, minesMinusFlags, timerCount } = this.state;
        return (
            <div className="game-container">
                <div className="game-header">
                    <div className="header-container">
                        <NumberContainer number={minesMinusFlags}/>
                        <NumberContainer number={timerCount}/>
                    </div>
                </div>
                <div className="gameboard-container">
                    {userViewGameBoard.map((col, i) => {
                        return (
                            <div className="loop1" key={i}>
                                {col.map((r, j) => {
                                    return (
                                        <div className="loop2" key={"c" + i + "r" + j}>
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
            </div>
        );
    }
}

export default Game;