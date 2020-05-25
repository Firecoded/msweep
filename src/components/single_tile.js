/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";

const viewStateClassMap = new Map(Object.entries({
    "c": "clicked",
    "f": "flagged",
    "m": "mine",
}))
viewStateClassMap.set(0, "unclicked");

const SingleTile = ({viewState, hiddenState, boardPosition, changeViewState, checkNearbyTiles, endGame, showMines}) => {
    const [endGameBomb, setEndGameBomb] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        if (e.type === 'click') {
            return handleLeftClick();
        } else if (e.type === 'contextmenu') {
            return handleRightClick();
        }
    }

    const handleLeftClick = () => {
        if (showMines) {
            return;
        }
        if (viewState === "f") {
            return;
        }
        if (hiddenState !== "m") {
            changeViewState(boardPosition[0], boardPosition[1], "c")
            if (hiddenState === 0) {
                checkNearbyTiles(boardPosition[0], boardPosition[1]);
            }
        }
        if (hiddenState === "m"){
            setEndGameBomb(true);
            endGame(boardPosition[0], boardPosition[1]);
        }
    }

    const handleRightClick = () => {
        if (showMines) {
            return;
        }
        if (viewState === 0) {
            return changeViewState(boardPosition[0], boardPosition[1], "f")
        } else if (viewState === "f") {
            return changeViewState(boardPosition[0], boardPosition[1], 0)
        }
    }

    const buildHiddenStateView = (hs) => {
        if (hiddenState === 0) {
            return <span className="zero"></span>
        }
        if (hiddenState === "m") {
            return <span className={`clicked ${endGameBomb ? "x-bomb" : ""}`}>&#128163;</span>
        }
        return <span className={`clicked${hs}`}>{hs}</span>
    }

    const viewStateClass = viewStateClassMap.get(viewState) || "unclicked";

    return (
        <div 
            className={`single-tile ${viewStateClass}`}
            onClick={handleClick}
            onContextMenu={handleClick}
        >
            {showMines && hiddenState === "m" ? buildHiddenStateView(hiddenState) : ""}
            {viewState === "c" ? buildHiddenStateView(hiddenState) : ""}
            {viewState === "f" ? <span>&#128681;</span> : ""}
        </div>
    )
}

export default SingleTile;