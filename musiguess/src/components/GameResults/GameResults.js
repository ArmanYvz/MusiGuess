import React from 'react'
import './GameResults.css'


const GameResults = ({ lobby, currentPlayerHostCheck, lobbyId }) => {
    const calculateRatio = (player) => {
        let idx = 0;
        let correctCount = 0;
        player.answers.forEach((answer) => {
            if (answer === lobby.tracks[idx].trackName) {
                correctCount++;
            }
            idx++;
        })
        return (100 * Math.round(correctCount/lobby.noRounds * 100)/100);
    }

    const calculateAvgAnswerTime = (player) => {
        let totalAnswerTime = 0;
        player.remainingTimes.forEach((remaining) => {
            totalAnswerTime += parseInt(lobby.playbackTime - remaining);
        })
        return (Math.round(totalAnswerTime/lobby.noRounds * 100)/100).toFixed(2);
    }

    const Scoreboard = () => {
        let count = 0;
        return (
            lobby.players.map((player) => {
                count++;
                return (
                    <div className="gameResults__main__leftTable__rowContainer__row">
                        <p>{count}</p>
                        <p>{player.userName}</p>
                        <p>{player.totalScore}</p>
                        <p>{calculateRatio(player)}%</p>
                        <p>{calculateAvgAnswerTime(player)} sec</p>
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
                        <p>{count-1}</p>
                        <p>{track.trackName}</p>
                        <p>{track.trackArtist}</p>
                    </div>
                )
            })
        )
    }

    return (
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
                        <Scoreboard/>
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
                        <Tracks/>
                    </div>
                </div>
            </div>
            <div className="gameResults__footer">
                <div className="gameResults__footer__left">
                    <div className="gameResults__footer__left__logo">
                        <p className="gameResults__footer__left__logo__top noselect"> Musi</p>
                        <p className="gameResults__footer__left__logo__bottom noselect">Guess</p>
                    </div>
                    <button>Exit</button>
                </div>
                <div className="gameResults__footer__right">
                    <button className="gameResults__footer__right__buttonBack">Back to Lobby</button>
                    <button className="gameResults__footer__right__buttonRestart">Restart</button>
                </div>

            </div>
        </div>
    )
}

export default GameResults