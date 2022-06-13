import React from "react";
import { useState, useEffect } from "react";
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'

import "./Timer.css";

const Timer = ({pullTime, playbackTime}) => {
    const[time, setTime] = useState(playbackTime);

    pullTime(time);

    useEffect(() => {
        let interval;
        setTime(playbackTime);
        interval = setInterval(() => {
            setTime((x => x - 0.1));
        }, 100)

        return () => {
            clearInterval(interval);
        }
    }, [])

    return(
        <div className="timer-container">
        {/* <button type="button" id = "timeButton"  ></button> */}
        <p>Time Left</p>
        <CircularProgress value={Math.round((time/playbackTime)*100).toFixed(2)} size = "300px" thickness="5px" color = "rgba(234, 238, 19, 0.6)">
            <CircularProgressLabel><p>{(Math.round(time * 100)/100).toFixed(2)}</p> </CircularProgressLabel>
        </CircularProgress>
        </div>
    )
}

export default Timer