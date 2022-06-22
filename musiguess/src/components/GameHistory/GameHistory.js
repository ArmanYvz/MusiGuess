import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db, getGameHistoryOfPlayer } from "../../firebase";
import "./GameHistory.css";
import { doc, collection, query, onSnapshot, setDoc } from "firebase/firestore";
import { calculateRatioGameHistory, calculateAvgAnswerTimeGameHistory, calculateTotalScoreGameHistory } from "../../utils/GameUtils";
import { auth, getPlaylistName } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const GameHistory = () => {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);

    const [player, setPlayer] = useState();

    const handleBackHomeButton = () => {
        navigate("/home", { replace: true });
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/", { replace: true });
        const q = query(doc(db, `users/` + `${localStorage.getItem("userId")}`));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setPlayer(querySnapshot.data());
        })

        return () => {
            unsubscribe();
        }

    }, [user, loading]);

    return (
        <>  {player !== undefined &&
            <div className="gameHistory">
                <div className="gameHistoryHeader">
                    <div className="gameHistoryHeader__logoText">
                        <p className="gameHistoryHeader__logoText__top">Musi</p>
                        <p className="gameHistoryHeader__logoText__bottom">Guess</p>
                    </div>
                    <h1>Game History of {player.name}</h1>
                    <button
                        className="gameHistoryHeader__backToHomeButton"
                        onClick={handleBackHomeButton}
                    >
                        <KeyboardBackspaceIcon fontSize="large" />
                    </button>
                </div>
                <div className="gameHistoryBody">
                    <div className="gameHistoryBody__table">
                        <div className="gameHistoryBody__table__header">
                            <p>Date</p>
                            <p>Playlist</p>
                            <p>No Rounds</p>
                            <p>Score</p>
                            <p>Ratio</p>
                            <p>Avg. Answer Time</p>
                        </div>
                        <div className="gameHistoryBody__table__body">
                            {player.gameHistory.map((game,idx) => {
                                return (
                                    <div className="gameHistoryBody__table_body_row" key = {idx}>
                                        <p>{game.currentDate}</p>
                                        <p>{game.playlistName}</p>
                                        <p>{game.noRounds}</p>
                                        <p>{calculateTotalScoreGameHistory(game)}</p>
                                        <p>{calculateRatioGameHistory(game)}%</p>
                                        <p>{calculateAvgAnswerTimeGameHistory(game)} sec</p>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </div>
            </div>
        }

        </>



    )
}
export default GameHistory