import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "./Lobby.css";
import { useNavigate } from "react-router";

const Lobby = () => {
  const navigate = useNavigate();
  const handleBackToLobby = () => {
    navigate("/lobbies", { replace: true });
  };

  const handleStartGame = () => {
    navigate("/game", { replace: true });
  }

  return (
    <div className="lobby">
      <div className="lobby__main">
        <div className="lobby__main__left">
          <h1>Game Settings</h1>
          <div className="lobby__main__left__settings box">
            <div className="lobby__main__left__settings__top">
              <p>Playlist</p>
              <div className="lobby__main__left__settings__top__box">
                <p>Best of Metallica</p>
              </div>
            </div>
            <div className="lobby__main__left__settings__bottom">
              <div className="lobby__main__left__settings__bottom__left">
                <p>Playback Time</p>
                <div className="lobby__main__left__settings__bottom__left__box">
                  <p>15 Seconds</p>
                </div>
              </div>
              <div className="lobby__main__left__settings__bottom__right">
                <p>Number of Rounds</p>
                <div className="lobby__main__left__settings__bottom__right__box">
                  <p>3</p>
                </div>
              </div>
            </div>
            <div className="lobby__main__left__settings__footer">
              <div className="lobby__main__left__settings__footer__logo">
                <p className="lobby__main__left__settings__footer__logo__top noselect">
                  Musi
                </p>
                <p className="lobby__main__left__settings__footer__logo__bottom noselect">
                  Guess
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lobby__main__right">
          <h1>Players</h1>
          <div className="lobby__main__right__players box">
            <div className="lobby__main__right__players__player">
              <p>Player 1 Host</p>
            </div>
            <div className="lobby__main__right__players__player">
              <p>Player 2</p>
            </div>
            <div className="lobby__main__right__players__player">
              <p>Playerrrr 3 hehe </p>
            </div>
            <div className="lobby__main__right__players__player">
              <p>Playerrrr 3 hehe </p>
            </div>
            <div className="lobby__main__right__players__player">
              <p>Playerrrr 3 hehe </p>
            </div>
            <div className="lobby__main__right__players__player">
              <p>Playerrrr 3 hehe </p>
            </div>
          </div>
        </div>
      </div>
      <div className="lobby__footer">
        <button onClick = {handleStartGame} className="lobby__footer__button--yellow">Start</button>
        <button onClick={handleBackToLobby} className="lobby__footer__button">
          <KeyboardBackspaceIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
};

export default Lobby;
