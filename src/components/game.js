/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from 'react';

import { gameRef, buildGameBoard, directionRef, checkIfOffBoard, countFlags } from "../helpers/build_gameboard";
import SingleTile from "./single_tile";
import { NumberContainer } from "./number-container";
import "../styles/game.scss";

const START_DIFFICULTY = 0;
const GAME_DIFF_BTNS = [
    {
        title: "Beginner",
        id: 0,
    },{
        title: "Intermediate",
        id: 1,
    }, {
        title: "Expert",
        id: 2,
    }
]

class Game extends Component {
    constructor(props) {
        super(props)
        this.state={
            difficultyLevel: START_DIFFICULTY,
            userViewGameBoard: [],
            gameBoardWithMines: [],
            minesMinusFlags: gameRef[START_DIFFICULTY].mines,
            timerCount: 0,
            gameHasStarted: false,
            happyFace: true,
            showGameDiffDropdown: false,
            showMines: false,
        }
        this.gameParams = gameRef[this.state.difficultyLevel];
    }

    componentDidMount() {
        this.restartGame();
    }

    restartGame = () => {
        this.stopTimer();
        const newState = {
            userViewGameBoard: buildGameBoard(this.gameParams, false),
            gameBoardWithMines: buildGameBoard(this.gameParams, true),
            timerCount: 0,
            gameHasStarted: false,
            happyFace: true,
            showGameDiffDropdown: false,
            showMines: false,
            minesMinusFlags: gameRef[this.state.difficultyLevel].mines,
        }
        this.setState(() => newState);
    }

    setHappyFace = (happyFace) => {
        const newState = {happyFace};
        this.setState(() => newState);
    }

    setGameHasStarted = (gameHasStarted) => {
        const newState = {gameHasStarted};
        this.setState(() => newState);
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
        if (!this.state.gameHasStarted) {
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

    buildFaceEmoji = () => {
        const { happyFace } = this.state;
        return (
            <span onClick={this.restartGame} className="happy-face-container">
                {happyFace ? <span>&#128578;</span> : <span>&#128532;</span>}
            </span>
        )
    }

    toggleGameDiffDropdown = (showGameDiffDropdown) => {
        const newState = {showGameDiffDropdown};
        this.setState(() => newState);
    }

    setGameDifficulty = (difficultyLevel) => {
        this.toggleGameDiffDropdown();
        this.gameParams = gameRef[difficultyLevel];
        const newState = {difficultyLevel};
        this.setState(() => newState, this.restartGame);
    }

    buildGameDiffBtns = () => {
        const { difficultyLevel } = this.state;
        return GAME_DIFF_BTNS.map((gdb) => {
            const active = difficultyLevel === gdb.id;
            return (
                <div onClick={() => this.setGameDifficulty(gdb.id)} className="dropdown-item" key={gdb.title}>
                    {active ? <div className="checkmark">&#10004;</div> : <div className="non-active-checkmark"></div>}
                    <span>{gdb.title}</span>
                </div>
            )
        })
    }

    endGame = (y, x) => {
        console.log("END", y, x)
        this.stopTimer();
        const newState = {
            showMines: true,
            happyFace: false,
        };
        this.setState(() => newState);
    }

    render() {
        const { userViewGameBoard, gameBoardWithMines, minesMinusFlags, timerCount, showGameDiffDropdown, showMines } = this.state;
        return (
            <div className="game-container">
                <div className="game-diff-dropdown">
                    <button onClick={() => this.toggleGameDiffDropdown(!showGameDiffDropdown)} className="dropbtn">Game</button>
                    <div className={`dropdown-content ${showGameDiffDropdown ? "show" : ""}`}>
                        <div className="dropdown-item" onClick={this.restartGame}>
                        <div className="non-active-checkmark"></div>
                            <span>New Game</span>
                        </div>
                        <hr></hr>
                        {this.buildGameDiffBtns()}
                    </div>
                </div>
                <div className="game-header">
                    <div className="header-container">
                        <div className="header-elements-flex-container">
                            <NumberContainer number={minesMinusFlags}/>
                            {this.buildFaceEmoji()}
                            <NumberContainer number={timerCount}/>
                        </div>
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
                                                endGame={this.endGame}
                                                showMines={showMines}
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