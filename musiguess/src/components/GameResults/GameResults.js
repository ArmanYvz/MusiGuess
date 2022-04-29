import React from 'react'
import './GameResults.css'
import { calculateRatio, calculateAvgAnswerTime } from '../../utils/GameUtils'
import { auth } from "../../firebase";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";

const GameResults = ({ lobby, currentPlayerHostCheck, lobbyId }) => {
    //const navigate = useNavigate();
    //const [user, loading, error] = useAuthState(auth);

    // useEffect(() => {
    //     if (loading) return;
    //     if (!user) return navigate("/", { replace: true });
    // }, [user, loading])

    /* const handleExitButton = () => {
        navigate("/home", { replace: true });
    } */
    
    const Scoreboard = () => {
        let count = 0;
        return (
            lobby.players.map((player) => {
                count++;
                return (
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>{count}</p>
                        <p>{player.userName}</p>
                        <p>{Math.round((player.totalScore * 100) / 100).toFixed(0)}</p>
                        <p>{calculateRatio(player, lobby)}%</p>
                        <p>{calculateAvgAnswerTime(player, lobby)} sec</p>
                    </div>
                )
            })
        )
    }

    const Tracks = () => {
        let count = 0;
        return (
            lobby.tracks.map((track) => {
                count++;
                return (
                    <div className="gameResults__main__rightTable__rowContainer__row">
                        <p>{count}</p>
                        <p>{track.trackName}</p>
                        <p>{track.trackArtist}</p>
                    </div>
                )
            })
        )
    }

    return (
        <>
        {
        <div className="gameResults">
            <div className="gameResults__main">
                <div className="gameResults__main__leftTable">
                    <h1>Scoreboard</h1>
                    <div className="gameResults__main__leftTable__header">
                        <p>#</p>
                        <p>Name</p>
                        <p>Score</p>
                        <p>Ratio</p>
                        <p>Avg. Answer Time</p>
                    </div>
                    <div className="gameResults__main__leftTable__rowContainer">
                        <Scoreboard />
                    </div>
                </div>
                <div className="gameResults__main__rightTable">
                    <h1>Tracks</h1>
                    <div className="gameResults__main__rightTable__header">
                        <p>Round #</p>
                        <p>Name</p>
                        <p>Artist</p>
                    </div>
                    <div className="gameResults__main__rightTable__rowContainer">
                        <Tracks />
                    </div>
                </div>
            </div>
            <div className="gameResults__footer">
                <div className="gameResults__footer__left">
                    <div className="gameResults__footer__left__logo">
                        <p className="gameResults__footer__left__logo__top noselect"> Musi</p>
                        <p className="gameResults__footer__left__logo__bottom noselect">Guess</p>
                    </div>
                </div>
                <div className="gameResults__footer__right">
                    {/* <button className="gameResults__footer__right__buttonBack">Back to Lobbies</button> */}
                    <button href="/home" className="gameResults__footer__right__exit">Exit</button>
                </div>

            </div>
        </div>
        }
        </>
        
    )
}

export default GameResults