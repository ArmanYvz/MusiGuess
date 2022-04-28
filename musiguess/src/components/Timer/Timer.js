import React from "react";
import { useState, useEffect } from "react";

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
        <>
        <button type="button" id = "timeButton" disabled >Time: {(Math.round(time * 100)/100).toFixed(2)} </button>
        </>
    )
}

export default Timer