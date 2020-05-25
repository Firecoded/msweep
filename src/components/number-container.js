import React from "react";

export const NumberContainer = (props) => {
    let currentNumber = props.number;
    if (currentNumber > 999) {
        currentNumber = 999;
    }
    const addZeros = () => {
        const stringNum = currentNumber.toString();
        if (stringNum.length === 1) {
            return "00";
        }
        if (stringNum.length === 2) {
            return "0";
        }
    }

    return (
        <div className="number-container">
            <span className="number-value">
                {addZeros()}{currentNumber}
            </span>
            <span className="number-value-mirrored">
                {888}
            </span>
        </div>
    )
}