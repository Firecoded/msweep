import React, { Component } from 'react';
import { NumberContainer } from './number-container';

export class Timer extends Component {
    constructor(props){
        super(props)
        this.state = {
            number: 0,
        }

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {debugger
        if (prevProps.timerState.start !== this.props.timerState.start && this.props.timerState.start === true) {debugger
            this.startTimer(true);
        }
        if (prevProps.timerState.stop !== this.props.timerState.stop && this.props.timerState.stop === true) {
            this.stopTimer();
            this.props.changeTimerState("stop", false);
        }
        if (prevProps.timerState.restart !== this.props.timerState.restart && this.props.timerState.restart === true) {
            this.restartTimer();
            this.props.changeTimerState("restart", false);
        } 
    }
    

    startTimer = (toggleStartState) => {
        this.interval = setInterval(() => {
            this.setState(({ number }) => ({
                number: number + 1
            }))
        }, 1000)
        if (toggleStartState) {
            this.props.changeTimerState("start", false);
        }
    }

    stopTimer = () => {
        clearInterval(this.interval);
    }

    restartTimer = () => {
        this.stopTimer()
        const newState = {number: 0};
        this.setState(() => newState, this.startTimer());
    }

    componentWillUnmount() {
        this.stopTimer();
    }


    render() {
        return (
            <NumberContainer number={this.state.number}/>
        );
    }
}
