import "./Lobbies.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import React from "react";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router";

//import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { Button, Modal, Form } from 'react-bootstrap';

import { db } from "../../firebase";

import CreateLobbyPopup from "../CreateLobbyPopup/CreateLobbyPopup";

//import 'bootstrap/dist/css/bootstrap.min.css';


//import { doc, setDoc, collection, query, where, getDocs, getDoc, onSnapshot, deleteDoc } from "firebase/firestore"; 
import { doc, collection, query, onSnapshot, setDoc } from "firebase/firestore"; 

//import 'bootstrap/dist/css/bootstrap.min.css';

const Lobbies = () => {
  var lobbyId = 0;
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

  const handleCreateNewLobby = () => { 
    // a pop-up will be opened. user will enter lobby name and toggle max players allowed. 
    // when he clicks create button, DB new lobby generation function will be triggered. then user will be redirected to lobby.  
    navigate("/lobby", { replace: true });
  }

  async function handlePopupCreateLobbyButton () {
    lobbyId = generateLobbyID();

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

    setPopupShow(false);
    setNewLobbyName("");
    setNewLobbyMaxPlayers(5);

  }

  const handleJoinExistingLobby = () => {
    // here will come the lobby join functionality. user will be added to lobby with given id
  }

  // below useEffect method will detect changes in lobby list 
  // current lobbies in db will kept fresh inside of an array
  useEffect(() => {
    const q = query(collection(db, "lobbies/"));
    var lobbiesFromDb = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      lobbiesFromDb = [];
      querySnapshot.forEach((lobby) => {
        lobbiesFromDb.push(lobby.data());
      });
      setLobbies(lobbiesFromDb);

      return () => {
        unsubscribe();
      }

    })
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
                  <div className="lobbiesBody__table_body_row">
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

        

        {/* <Modal show={popupShow} className = "modal" onHide={handlePopupClose}>
          <Modal.Header closeButton>
            <p></p>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <div className="popupNewLobbySettings">
              <h3>Lobby Name:</h3>
              <input type="text" className="newLobbyNameTextbox" value ={newLobbyName} onChange={(event) => {setNewLobbyName(event.target.value);}} onInput={(event) => setNewLobbyName(event.target.value)}></input>
              <h3>Max # of Players: {newLobbyMaxPlayers}</h3>
              <input type="range" class="form-range" id="newLobbyMaxPlayersRange" min="2" max="10" step="1" defaultValue={newLobbyMaxPlayers} onChange={ (event) => setNewLobbyMaxPlayers(event.target.value)} value={newLobbyMaxPlayers}></input>
          
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handlePopupClose}>
                Cancel
            </Button>
            <Button variant="success" disabled={newLobbyName === ""} onClick={handlePopupCreateLobbyButton}>
                Create New Lobby
            </Button>
          </Modal.Footer>

        </Modal> */}
    </div>



    </>

  );
};

export default Lobbies;
