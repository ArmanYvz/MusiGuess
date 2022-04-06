import React from "react";
import "./Game.css";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";

const Game = () => {
  const navigate = useNavigate();
  const handleExitGame = () => {
    navigate("/lobby", { replace: true });
  };

  return (
    <div className="game">
      <div className="game__main">
        <div className="game__main__left">
          <div className="game__main__left__questionContainer">
            <div className="game__main__left__questionContainer__question">
              <p className="noselect"> Round 1 of 5</p>
              <h1 className="noselect">Guess the Song !</h1>
            </div>
            <div className="game__main__left__questionContainer__answers">
              <div className="game__main__left__questionContainer__answers__answer">
                <p className="noselect">Hotel California</p>
              </div>

              <div className="game__main__left__questionContainer__answers__answer">
                <p className="noselect">Losing My Religion</p>
              </div>

              <div className="game__main__left__questionContainer__answers__answer">
                <p className="noselect">Stairway to Heaven</p>
              </div>

              <div className="game__main__left__questionContainer__answers__answer">
                <p className="noselect">Nothing Else Matters</p>
              </div>
            </div>
          </div>
        </div>
        <div className="game__main__right">
          <div className="game__main__right__leaderboardContainer">
            <div className="game__main__right__leaderboardContainer__roundScores">
              <p>Scores</p>
              <div className="game__main__right__leaderboardContainer__roundScores__table">
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Berat (3.5 sec)</p>
                  <p>+200</p>
                </div>
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Serdar (4.2 sec)</p>
                  <p>+150</p>
                </div>
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Anıl (5.1 sec)</p>
                  <p>+100</p>
                </div>
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Arman (6.1 sec)</p>
                  <p>+90</p>
                </div>
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Anıl (5.1 sec)</p>
                  <p>+100</p>
                </div>
              </div>
            </div>
            <div className="game__main__right__leaderboardContainer__overallScores">
              <p>Overall</p>
              <div className="game__main__right__leaderboardContainer__overallScores__table">
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Serdar</p>
                  <p>660</p>
                </div>
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Anıl</p>
                  <p>500</p>
                </div>
                <div className="game__main__right__leaderboardContainer__table__row">
                  <p>Berat</p>
                  <p>300</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="game__footer">
        <div className="game__footer__left">
          <div className="game__footer__left__logo">
            <p className="game__footer__left__logo__top noselect"> Musi</p>
            <p className="game__footer__left__logo__bottom noselect">Guess</p>
          </div>
        </div>
        <div className="game__footer__right">
          <button
            onClick={handleExitGame}
            className="game__footer__right__exitButton"
          >
            <CloseIcon />
          </button>
          <button className="game__footer__right__buttonNextRound">
            Next Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
