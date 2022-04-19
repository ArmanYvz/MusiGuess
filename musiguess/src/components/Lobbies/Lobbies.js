import "./Lobbies.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import React from "react";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router";

import { db } from "../../firebase";

import CreateLobbyPopup from "../CreateLobbyPopup/CreateLobbyPopup";

//import { doc, setDoc, collection, query, where, getDocs, getDoc, onSnapshot, deleteDoc } from "firebase/firestore"; 
import { doc, collection, query, onSnapshot, setDoc } from "firebase/firestore"; 

const Lobbies = () => {
  const navigate = useNavigate();

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

  function generateLobbyID() {
    return Math.floor(100000000 + Math.random() * 900000000); 
  }

  async function handlePopupCreateLobbyButton () {
    let lobbyId = generateLobbyID();

    try{
      await setDoc(doc(db, "lobbies", `${lobbyId}`), {
        currentRound: 0,
        isActive: true,
        isGameStarted: false,
        lobbyID: lobbyId,
        maxPlayers: newLobbyMaxPlayers,
        name: newLobbyName,
        noRounds: 5,
        players: [],
        tracks: [],
        status: "Waiting",
        playbackTime: 15,
        playlistID: "",
        roundEnded: "",
        wrongAnswers: [],
  
      });
    }catch(error){
      console.log("Something went wrong while creating lobby: ", error);
      return;
    }

    // setPopupShow(false);
    // setNewLobbyName("");
    // setNewLobbyMaxPlayers(5);
    navigate(`/lobbies/${lobbyId}`,{state:{ isHost:true}});

  }

  const handleJoinExistingLobby = () => {
    // here will come the lobby join functionality. user will be added to lobby with given id
    navigate(`/lobbies/${joinLobbyId}`);
  }

  // below useEffect method will detect changes in lobby list 
  // current lobbies in db will kept fresh inside of an array
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
                  <div key = {lobby.lobbyID} onClick = {()=> navigate(`/lobbies/${lobby.lobbyID}`)} className="lobbiesBody__table_body_row">
                    <p>{lobby.name}</p>
                    <p>{lobby.lobbyID}</p>
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
