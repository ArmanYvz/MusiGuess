import "./Lobbies.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import React from "react";
import { useNavigate } from "react-router";

const Lobbies = () => {
  const navigate = useNavigate();

  const handleBackHomeButton = () => {
    navigate("/home", { replace: true });
  };

  const LobbyRow = () =>{

  }

  const handleCreateNewLobby = () => { 
    navigate("/lobby", { replace: true });
  }

  return (
    <div className="lobbies">
      <div className="lobbiesHeader">
        <div className="lobbiesHeader__logoText">
          <p className="lobbiesHeader__logoText__top">Musi</p>
          <p className="lobbiesHeader__logoText__bottom">Guess</p>
        </div>
        <h1>Multiplayer Lobby List</h1>
        <button
          className="lobbiesHeader__backToHomeButton"
          onClick={handleBackHomeButton}
        >
          <KeyboardBackspaceIcon fontSize="large" />
        </button>
      </div>
      <div className="lobbiesBody">
        <div className="lobbiesBody__table">
          <div className="lobbiesBody__table__header">
            <p>Lobby Name</p>
            <p>Id </p>
            <p>Status</p>
            <p>Players</p>
          </div>
          <div className="lobbiesBody__table__body">
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 1</p>
              <p>10204</p>
              <p>Waiting</p>
              <p>2/4</p>
            </div>
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 2</p>
              <p>154</p>
              <p>Waiting</p>
              <p>1/6</p>
            </div>
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 2</p>
              <p>154</p>
              <p>Waiting</p>
              <p>1/6</p>
            </div>
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 2</p>
              <p>154</p>
              <p>Waiting</p>
              <p>1/6</p>
            </div>
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 2</p>
              <p>154</p>
              <p>Waiting</p>
              <p>1/6</p>
            </div>
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 2</p>
              <p>154</p>
              <p>Waiting</p>
              <p>1/6</p>
            </div>
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 2</p>
              <p>154</p>
              <p>Waiting</p>
              <p>1/6</p>
            </div>
            <div className="lobbiesBody__table_body_row">
              <p>Lobby 2</p>
              <p>154</p>
              <p>Waiting</p>
              <p>1/6</p>
            </div>
          </div>
        </div>
        <button className = "lobbiesBody__button" onClick= {handleCreateNewLobby}>Create New Lobby</button>
      </div>
    </div>
  );
};

export default Lobbies;
