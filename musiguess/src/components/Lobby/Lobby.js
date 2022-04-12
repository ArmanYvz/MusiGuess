import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "./Lobby.css";
import { useNavigate, useParams, useLocation } from "react-router";
import { insertUserToLobbyDB, deleteUserFromLobbyDB } from "../../firebase";
import {useEffect, useState} from 'react';
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import useLobby from "../../Hooks/useLobby";
const Lobby = () => {
  const navigate = useNavigate();
  const {lobbyId} = useParams();
  const {state} = useLocation();

  const {isFetchingLobby,lobby} = useLobby({lobbyId});

  // if(isFetchingLobby) return <div>Loading...</div>;

  // declare the user ?? should user be a state?
  const isStateExists = state ? true : false;
  const isHostValue = isStateExists ? state.isHost : false
  let user = {userId: localStorage.getItem("userId"), userName: localStorage.getItem("userName"), isHost: isHostValue};


  // join lobby on page load, delete user when component unmounts
  useEffect(()=>{

    if(!isFetchingLobby && lobby){
      console.log("adding user...");
      insertUserToLobbyDB(user,lobbyId);

      return () =>{
        console.log("deleting user...");
        deleteUserFromLobbyDB(user,lobbyId);
      }
    }

  },[isFetchingLobby])

  
  // this removes user if user closes browser directly
  useEffect(() => {
      window.onbeforeunload = function() {
          console.log("deleting user...");
          deleteUserFromLobbyDB(user,lobbyId);
        };

    return () => {
        window.onbeforeunload = null;
    };

  }, []);


  const handleBackToLobby = () => {
    navigate("/lobbies", { replace: true });
  };

  const handleStartGame = () => {
    navigate("/game", { replace: true });
  }

  //lobby players render
  const LobbyPlayers = () =>{
    return(
      <div className="lobby__main__right__players box">
        {lobby.players.map((player)=>{
          return(
            <div key = {player.userId} className="lobby__main__right__players__player">
              <p>{player.userName} {player.isHost ? "(Host)" : ""}</p>
            </div>
          )
         })}
      </div>
    )

  }


  return (
      <>
      {isFetchingLobby ? <h1>Loading...</h1> :
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
              <LobbyPlayers/>
            </div>
          </div>
          <div className="lobby__footer">
            <button onClick = {handleStartGame} className="lobby__footer__button--yellow">Start</button>
            <button onClick={handleBackToLobby} className="lobby__footer__button">
              <KeyboardBackspaceIcon fontSize="large" />
            </button>
            <h2>Lobby ID : {lobbyId}</h2>
          </div>
        </div>}
      </>

  );
};

export default Lobby;
