import "./Lobbies.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import React from "react";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router";

import { auth, db } from "../../firebase";

import CreateLobbyPopup from "../CreateLobbyPopup/CreateLobbyPopup";

import { doc, collection, query, onSnapshot, setDoc } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";

const Lobbies = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
      if (loading) return;
      if (!user) return navigate("/", { replace: true });
  }, [user, loading])

  const [lobbies, setLobbies] = useState([]);
  const [joinLobbyId, setJoinLobbyId] = useState("");

  const [popupShow, setPopupShow] = useState(false);

  const [newLobbyName, setNewLobbyName] = useState("");
  const [newLobbyMaxPlayers, setNewLobbyMaxPlayers] = useState(5);

  const handlePopupClose = () => setPopupShow(false)
  
  const handlePopupShow = () => setPopupShow(true);

  const handleBackHomeButton = () => {
    navigate("/home", { replace: true });
  };

  function handlePopupCreateLobbyButton () {
    let lobbyId = Math.floor(100000000 + Math.random() * 900000000); 
    try{
      setDoc(doc(db, "lobbies", `${lobbyId}`), {
        currentRound: 1,
        isActive: true,
        isGameStarted: false,
        lobbyId: lobbyId,
        maxPlayers: newLobbyMaxPlayers,
        name: newLobbyName,
        noRounds: 5,
        players: [],
        tracks: [],
        status: "Waiting",
        playbackTime: 15,
        playlistId: "37i9dQZF1DXcNf6sH1qnKU",
        roundEnded: "",
        wrongAnswers: [],
  
      });
    }catch(error){
      console.log("Something went wrong while creating lobby: ", error);
      return;
    }
    navigate(`/lobbies/${lobbyId}`,{state:{ isHost:true}});
  }

  const handleJoinExistingLobby = () => {
    navigate(`/lobbies/${joinLobbyId}`);
  }

  useEffect(() => {
    const q = query(collection(db, "lobbies/"));
    let lobbiesFromDb = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      lobbiesFromDb = [];
      querySnapshot.forEach((lobby) => {
        lobbiesFromDb.push(lobby.data());
      });
      setLobbies(lobbiesFromDb);
    })

    return () => {
      unsubscribe();
    }

  }, []);

  const handleTableRowClick = (playerLength,maxPlayers,lobbyId,status) =>{
    if((playerLength < maxPlayers) && (status === "Waiting")){
      navigate(`/lobbies/${lobbyId}`);
    }
    else{
      if(!(playerLength < maxPlayers)) {
        alert("This lobby is full");
      }
      else if(!(status === "Waiting")) {
        alert("This lobby is busy right now");
      }
    }
  }

  return (
    <>
      {
      popupShow &&
        <CreateLobbyPopup
          handlePopupCreateLobbyButton = {handlePopupCreateLobbyButton}
          newLobbyName={newLobbyName}
          handlePopupClose = {handlePopupClose}
          setNewLobbyName = {setNewLobbyName}
          newLobbyMaxPlayers = {newLobbyMaxPlayers}
          setNewLobbyMaxPlayers = {setNewLobbyMaxPlayers}
        />
        }
      <div className="lobbies" style={popupShow ? {"filter": "blur(16px)"} : {"filter":"none"}}>
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
              {lobbies.map((lobby) => {
                return(
                  <div key = {lobby.lobbyId} onClick = {()=> handleTableRowClick(lobby.players.length,lobby.maxPlayers,lobby.lobbyId,lobby.status)} className="lobbiesBody__table_body_row">
                    <p>{lobby.name}</p>
                    <p>{lobby.lobbyId}</p>
                    <p>{lobby.status}</p>
                    <p>{lobby.players.length}/{lobby.maxPlayers}</p>
                  </div>
                )
              })}
              
            </div>
          </div>
          <div className="lobbiesButtons">
            <button className = "lobbiesBody__create_button" onClick= {handlePopupShow}>Create New Lobby</button>
            <div className="lobbiesJoinButton">
              <input type="text" className="joinLobbyTextbox" value ={joinLobbyId} onChange={(event) => {setJoinLobbyId(event.target.value);}} onInput={(event) => setJoinLobbyId(event.target.value)}></input>
              <button disabled={joinLobbyId === ""} className = "lobbiesBody__join_button" onClick= {handleJoinExistingLobby}>Join Lobby with ID</button>
            </div>
            
          </div>
          
        </div>
      </div>



    </>

  );
};

export default Lobbies;
