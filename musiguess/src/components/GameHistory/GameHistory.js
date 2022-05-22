import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db, getGameHistoryOfPlayer } from "../../firebase";
import "./GameHistory.css";
import { doc, collection, query, onSnapshot, setDoc } from "firebase/firestore";
import { calculateRatioGameHistory, calculateAvgAnswerTimeGameHistory, calculateTotalScoreGameHistory } from "../../utils/GameUtils";
import { auth } from "../../firebase";
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
        //const data = getGameHistoryOfPlayer(localStorage.getItem("userId"));
        const q = query(doc(db, `users/` + `${localStorage.getItem("userId")}`));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setPlayer(querySnapshot.data());
            console.log(player);
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
                            <p>Score</p>
                            <p>Ratio</p>
                            <p>Avg. Answer Time</p>
                        </div>
                        <div className="gameHistoryBody__table__body">
                            {player.gameHistory.map((game) => {
                                return (
                                    <div className="gameHistoryBody__table_body_row">
                                        <p>{game.currentDate}</p>
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