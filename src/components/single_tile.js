/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";

const viewStateClassMap = new Map(Object.entries({
    "c": "clicked",
    "f": "flagged",
    "m": "mine",
}))
viewStateClassMap.set(0, "unclicked");

const SingleTile = ({viewState, hiddenState, boardPosition, changeViewState, checkNearbyTiles}) => {

    const handleClick = (e) => {
        e.preventDefault();
        if (e.type === 'click') {
            return handleLeftClick();
        } else if (e.type === 'contextmenu') {
            return handleRightClick();
        }
    }

    const handleLeftClick = () => {
        if (viewState === "f") {
            return;
        }
        if (hiddenState !== "m") {
            changeViewState(boardPosition[0], boardPosition[1], "c")
            if (hiddenState === 0) {
                checkNearbyTiles(boardPosition[0], boardPosition[1]);
            }
        }

    }

    const handleRightClick = () => {
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
        return <span className={`clicked${hs}`}>{hs}</span>
    }

    const viewStateClass = viewStateClassMap.get(viewState) || "unclicked";

    return (
        <div 
            className={`single-tile ${viewStateClass}`}
            onClick={handleClick}
            onContextMenu={handleClick}
        >
            {viewState === "c" ? buildHiddenStateView(hiddenState) : ""}
            {viewState === "f" ? <span>&#128681;</span> : ""}
        </div>
    )
}

export default SingleTile;