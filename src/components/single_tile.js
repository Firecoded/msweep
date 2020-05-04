import React from "react";

const SingleTile = ({viewState, hiddenState, boardPosition, changeViewState, checkNearbyTiles}) => {
    const getViewState = () => {
        let viewStateClass;
        switch(viewState) {
            case 0:
                viewStateClass = "unclicked";
                break;
            case "c": 
                viewStateClass = "clicked";
                break;
            case "f":
                viewStateClass = "flagged";
                break;
            case "m":
                viewStateClass = "mine";
                break;
            default:
        }
        return viewStateClass;
    }

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

    return (
        <div 
            className={`single-tile ${getViewState()}`}
            onClick={handleClick}
            onContextMenu={handleClick}
        >
            {viewState === "c" ? hiddenState : ""}
        </div>
    )
}

export default SingleTile;