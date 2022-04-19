import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import band from "../../assets/band.png";
import backgroundShape from "../../assets/backgroundShape.png";
import { logout } from "../../firebase";

const Home = () => {
  const navigate = useNavigate();

  const playButtonHandle = () => {
    navigate("/lobbies", { replace: true });
  };

  return (
    <div className="home">
      <div className="header">
        <div className="header__left">
          <p className="header__left__topText noselect">Musi</p>
          <p className="header__left__bottomText noselect">Guess</p>
        </div>
        <div className="header__right">
          <Link to="/" className="header__right__link">
            CONTACT
          </Link>
          <hr />
          <h1 to="/" className="header__right__link noselect">
            WELCOME <span>{localStorage.getItem("userName").toUpperCase()}</span> !
          </h1>
        </div>
      </div>
      <div className="main">
        <div className="main__left">
          <h1>
            <span>
              Can you guess
              <br />
            </span>{" "}
            the music?
          </h1>
          <h2>Multiplayer, turn based music guessing game.</h2>
          <div className="main__left_buttonContainer">
            <button onClick={playButtonHandle}>Play Now</button>
            <button id="showGameHistoryBtn">Show Game History</button>
          </div>
        </div>
        <div className="main__right">
          <img src={band} alt="band" />
          <img
            id="main__right__background"
            src={backgroundShape}
            alt="backgroundShape"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
