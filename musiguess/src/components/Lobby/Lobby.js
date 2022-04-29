import React, { useLayoutEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "./Lobby.css";
import { useNavigate, useParams, useLocation, usePrompt} from "react-router";

import { insertPlayerToLobbyDB, deletePlayerFromLobbyDB, deleteLobbyFromDB, getPlayerCountFromDB, getPlaylistsFromDB, updateGameSettingsDB, updateLobbyMusicDB, updateLobbyStatusDB} from "../../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Game from "../Game/Game";
import GameResults from "../GameResults/GameResults";
// import useLobby from "../../hooks/useLobby";

const Lobby = () => {
  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
      if (loading) return;
      if (!user) return navigate("/", { replace: true });
  }, [user, loading])
  //get the lobby id from url
  const { lobbyId } = useParams();

  //a state to get extra info like should user be the host or not
  const { state } = useLocation();

  //a state to get the lobby data
  // const { isFetchingLobby, lobby, setLobby } = useLobby({ lobbyId });

  const [isFetchingLobby,setIsFetchingLobby] = useState(true);
  const [lobby,setLobby] = useState();

  const {maxPlayers,players} = isFetchingLobby ? -1 : lobby;

  // const currentPlayer = isFetchingLobby ? null : lobby.players.filter((player)=>player.uid === localStorage.getItem("userId"))[0];

  // const [currentPlayer,setCurrentPlayer] = useState();

  const [playlists,setPlaylists] = useState([]);
  
  //var gameStartClicked = false;

  useEffect(()=>{
      const lobbyDocRef = doc(db, "lobbies", `${lobbyId}`);

      const unsubscribe = onSnapshot(lobbyDocRef, (doc) => {
          if(doc.data()){
              setLobby(doc.data());
              setIsFetchingLobby(false);
          }
          else{
              console.log("There is no lobby with this id");
              alert("There is no lobby with this id");
              navigate("/lobbies", { replace: true });
          }

      })

      return () => {
          unsubscribe();
      }

  },[]);

  // useEffect( async()=>{
  //   const lobbyDocRef = doc(db, "lobbies", `${lobbyId}`);
  //   console.log("db update gidiyoo")
  //   await updateDoc(lobbyDocRef, {
  //       ...lobby
  //   });
  // },[lobby]);

  // const [newPlayer,setNewPlayer] = useState({
  //   userId: localStorage.getItem("userId"),
  //   userName: localStorage.getItem("userName"),
  //   isHost: false,
  //   scores: [],
  //   answers: [],
  //   remainingTimes: [],
  // });

  let newPlayer = {
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    isHost: false,
    scores: [],
    answers: [],
    selectionDone: false,
    totalScore: 0,
    remainingTimes: [],
  };


  // make the user host if he came from lobbies with create user button
  // useEffect(() => {
  //   if (state && state.isHost) {
  //     // setPlayer((prevUser) => {
  //     //   return { ...prevUser, isHost: true };
  //     // });
  //     setNewPlayer((prev)=>{
  //       return {...prev, isHost: true};
  //     })
  //   }
  // }, []);

  // useEffect(() => {
  //     if(!isFetchingLobby){
  //       // console.log(lobby.players.length)
  //       if (lobby.players.length === 0) {
  //         // console.log("bura çalıştı");
  //         // setNewPlayer((prev)=>{
  //         //   return {...prev, isHost: true};
  //         // })
  //         newPlayer.isHost = true;
  //       }
  //       else{
          
  //       }
  //     }

  // }, [isFetchingLobby]);

  useEffect(()=>{
    if(!isFetchingLobby){
      // console.log(lobby.players.length)
      let nobodyIsHost = true;

      lobby.players.forEach((player)=>{
        if(player.isHost === true){
          nobodyIsHost = false;
        }
      })

      if(nobodyIsHost){
        newPlayer.isHost = true;
      }

    }
  },[isFetchingLobby])

  // join lobby on page load, delete user when component unmounts
  useEffect(() => {
    if (!isFetchingLobby) {
      // console.log("adding user...");
      // console.log(newPlayer);
      if(players.length +1 > maxPlayers){
        alert("Lobby is full");
        navigate("/lobbies", { replace: true });
      }
      else{
        insertPlayerToLobbyDB(newPlayer, lobbyId);
      }

      return () => {
        console.log("deleting user...");
        // delete user  if there is nobody left in the lobby delete lobby
        deletePlayerFromLobbyDB(localStorage.getItem("userId"), lobbyId)

      };
    }
  }, [isFetchingLobby]);




  // this removes user if user closes browser directly
  useEffect(() => {
    window.onbeforeunload = function () {
      //console.log("aa");
      // if gameStartClicked true it means game will start, controlled unload happened
      // so don't call deletePlayerFromLobbyDB(), player needs to stay in DB.
      //if (!gameStartClicked) {   
        deletePlayerFromLobbyDB(localStorage.getItem("userId"), lobbyId);
      //}
      //gameStartClicked = false;
    };
    return  () => {
      window.onbeforeunload = null;
    };
    
  }, []);


  useEffect(()=>{
    const playlistsFromDB = getPlaylistsFromDB();
    playlistsFromDB.then(playlists => {
      setPlaylists(playlists);
    })
    // setPlaylists(playlistsFromDB);
  },[])

  const handleDropdownChange = (event) => {
    const newPlaylistId = event.target.value;
    // updateDB
    updateGameSettingsDB(lobbyId,lobby.noRounds,lobby.playbackTime,newPlaylistId);

  }

  const handleBackToLobby = () => {
    navigate("/lobbies", { replace: true });
  };

  const handleStartGame = async() => {
    //gameStartClicked = true;
    try {
      getMusicDataFromServer().then(data => {
        data.tracks.forEach(d => {
          let trimmed = d.previewUrl.toString().split('view/');
          d.previewUrl = trimmed[1].split('?cid=')[0];
        })

        const newArr = [];
        while(data.wrongAnswers.length) {  
          const arr = data.wrongAnswers.splice(0,3);
          const obj = Object.assign({}, arr);
          newArr.push(obj);
        }
        data.wrongAnswers = newArr;
        updateLobbyMusicDB(lobbyId, data.tracks, data.wrongAnswers);
        updateLobbyStatusDB(lobbyId, false, 1, "In Game");
      });
    } catch(err) {
      alert(err);
    }
    
    //navigate("/game", { replace: true });
  };

  const getMusicDataFromServer = async() => {
    try {
      const response = await fetch(`https://musiguess.herokuapp.com/api/${lobby.playlistId}/${lobby.noRounds}`);
      //console.log(response.json());
      let returnArr = [];
      await response.json().then(data => {
        //returnArr.playlistName = data.playlistName;
        returnArr.tracks = data.tracks;
        returnArr.wrongAnswers = data.wrongAnswers;
      })
      return returnArr;
    }
    catch(error) {
      console.log(error);
    }
  }

  const PlaylistDropdown = () =>{
    return(
      <select disabled = {!currentPlayerHostCheck()} defaultValue={lobby.playlistId} id="playlistDropdown" onChange = {handleDropdownChange} className="lobby__main__left__settings__top__box">
        {playlists.length !== 0 ? playlists.map((playlist)=>{
            return(
              <option key ={playlist.playlistId} value= {playlist.playlistId} >{playlist.playlistName}</option>
            )
          }):  <option>No Playlists</option>}
      </select>
    )
  }

  //lobby players render
  const LobbyPlayers = () => {
    return (
      <div className="lobby__main__right__players box">
        {lobby.players.map((player) => {
          return (
            <div
              key={player.userId}
              className="lobby__main__right__players__player"
            >
              <p>
                {player.userName} {player.isHost ? "(Host)" : ""}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const currentPlayerHostCheck = () => {

    const playerToCheck = lobby.players.filter((player)=> player.userId === localStorage.getItem("userId"))[0];
    //console.log(playerToCheck);

    try {
      if (!isFetchingLobby) {
        //console.log("buradayim");
        const hostStatus = playerToCheck.isHost;
        return hostStatus;
      }
      
    }
    catch (err) {
      // console.log(err);
    }

  }


  return (
    <>
      {isFetchingLobby ? 
        <h1>Loading...</h1>
        : 
        <>
          { lobby.status === "Waiting" &&
            <div className="lobby">
              <div className="lobby__main">
                <div className="lobby__main__left">
                  <h1>Game Settings</h1>
                  <div className="lobby__main__left__settings box">
                    <div className="lobby__main__left__settings__top">
                      <p>Playlist</p>
                      <PlaylistDropdown/>
                      
                    </div>
                    <div className="lobby__main__left__settings__bottom">
                      <div className="lobby__main__left__settings__bottom__left">
                        <p>Playback Time: {lobby.playbackTime}</p>
                        <div className="lobby__main__left__settings__bottom__left__box">
                          <input value = {lobby.playbackTime} disabled = {!currentPlayerHostCheck()} onChange = {(e)=>updateGameSettingsDB(lobbyId, lobby.noRounds, parseInt(e.target.value),lobby.playlistId)} type="range"  min="10" max="30" step="5" />
                        </div>
                      </div>
                      <div className="lobby__main__left__settings__bottom__right">
                        <p>Number of Rounds: {lobby.noRounds}</p>
                        <div className="lobby__main__left__settings__bottom__right__box">
                          <input value = {lobby.noRounds} disabled = {!currentPlayerHostCheck()} onChange = {(e)=>updateGameSettingsDB(lobbyId, parseInt(e.target.value), lobby.playbackTime,lobby.playlistId)} type="range"  min="1" max="10" step="1" />
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
                  <LobbyPlayers />
                </div>
              </div>
              <div className="lobby__footer">
                <button
                  disabled={!currentPlayerHostCheck()}
                  onClick={handleStartGame}
                  className="lobby__footer__button--yellow"
                >
                  Start
                </button>
                <button
                  onClick={handleBackToLobby}
                  className="lobby__footer__button"
                >
                  <KeyboardBackspaceIcon fontSize="large" />
                </button>
                <h2>Lobby Id : {lobbyId}</h2>
              </div>
            </div>
          }

          { lobby.status === "In Game" &&
            <Game 
            lobby = {lobby} 
            currentPlayerHostCheck = {currentPlayerHostCheck}
            lobbyId = {lobbyId}
            />
          }
          { lobby.status === "Game End" &&
            <GameResults
            lobby = {lobby}
            currentPlayerHostCheck = {currentPlayerHostCheck}
            lobbyId = {lobbyId}
            />

          }
        </>
        
      }
    </>
  );
};

export default Lobby;
