import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc, getDocs, collection } from "firebase/firestore"; 

import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, 
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

// function to sign in via Google
const signInWithGoogle = async() => {
    try {
        const res = await auth.signInWithPopup(googleProvider);
        const user = res.user;
        const query = await db
        .collection("users")
        .where("uid", "==", user.uid)
        .get();
        if (query.docs.length === 0) {
          await db.collection("users").add({
              uid: user.uid,
              name: user.displayName,
              gameHistory: [],
              authProvider: "google",
              email: user.email,
          });
        }
        const query2 = await db
          .collection("users")
          .where("uid", "==", user?.uid)
          .get();
        const data = await query2.docs[0].data();
        localStorage.setItem("userId", query2.docs[0].id);
        localStorage.setItem("userName", data.name);
    } catch (err) {
        console.log("api key: " + firebaseConfig.apiKey);
        console.error(err);
        alert(err.message);
    }
};

// function to sign in via email password
const signInWithEmailAndPassword = async (email, password) => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      const user = res.user; /*
      localStorage.setItem("userId", user.uid); */
      try {
        const query = await db
          .collection("users")
          .where("uid", "==", user?.uid)
          .get();
        const data = await query.docs[0].data();
        localStorage.setItem("userId", query.docs[0].id);
        localStorage.setItem("userName", data.name);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// function to register via email password
const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await db.collection("users").add({
        uid: user.uid,
        gameHistory: [],
        name,
        authProvider: "local",
        email,
      });
      try {
        const query = await db
          .collection("users")
          .where("uid", "==", user?.uid)
          .get();
        const data = await query.docs[0].data();
        localStorage.setItem("userId", query.docs[0].id);
        localStorage.setItem("userName", data.name);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    
};


// function that sends password reset email
const sendPasswordResetEmail = async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

// logout handler function
const logout = () => {
    auth.signOut();
    localStorage.setItem("userId", "");
    localStorage.setItem("userName", "");
};

// insert user to the lobby

const insertPlayerToLobbyDB = async (player,lobbyId) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  await updateDoc(lobbyRef,{
    players:arrayUnion(player)
  });
}

// remove user from the lobby

const deletePlayerFromLobbyDB = async (playerId,lobbyId) => {

  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  const lobbySnap = await getDoc(lobbyRef);
  const lobby =  lobbySnap.data();
  const playerToDelete = lobby.players.filter((player)=> player.userId === playerId)[0];

  await updateDoc(lobbyRef,{
    players:arrayRemove(playerToDelete)
  });

  if(playerToDelete.isHost){
    await makeAnotherPlayerHost(lobbyId);
  }

}

const makeAnotherPlayerHost = async(lobbyId) =>{
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  const lobbySnap = await getDoc(lobbyRef);
  const lobby =  lobbySnap.data();
  //let playerToMakeHost = lobby.players[0];

  let playersCopy = lobby.players;
  if(playersCopy.length !== 0){

    playersCopy[0].isHost = true;

    await updateDoc(lobbyRef,{
      players: [...playersCopy]
    });

  }

}

// update lobby game settings

const updateGameSettingsDB = async(lobbyId, noRounds, playbackTime,playlistId) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  const lobbySnap = await getDoc(lobbyRef);
  const lobby =  lobbySnap.data();

  let lobbyCopy = lobby;

  lobbyCopy.noRounds = noRounds;
  lobbyCopy.playbackTime = playbackTime;
  lobbyCopy.playlistId = playlistId;

  await updateDoc(lobbyRef,{
    playbackTime: lobbyCopy.playbackTime,
    noRounds: lobbyCopy.noRounds,
    playlistId: lobbyCopy.playlistId
  });
}

// update lobby musics and wrong answers
const updateLobbyMusicDB = async(lobbyId, tracks, wrongAnswers) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  await updateDoc(lobbyRef,{
    tracks: tracks,
    wrongAnswers: wrongAnswers
  });
  
}

const updateLobbyStatusDB = async(lobbyId, roundEnded, currentRound, status) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  await updateDoc(lobbyRef,{
    roundEnded: roundEnded,
    currentRound: currentRound,
    status: status 
  });

  await prepareAllPlayersToNextRound(lobbyId);
}

const updateGameHistoryOfPlayer = async(playerId, playbackTime, noRounds, tracks, answers, scores, remainingTimes, currentDate) => {
  const userRef = doc(db, "users", `${playerId}`);

  let userSnap = await getDoc(userRef);
  let user =  userSnap.data();
  if (user !== undefined) {
    let gameHistoryCopy = user.gameHistory;
    let newGame = {};
    newGame.playbackTime = playbackTime;
    newGame.noRounds = noRounds;
    newGame.tracks = tracks;
    newGame.answers = answers;
    newGame.scores = scores;
    newGame.remainingTimes = remainingTimes;
    newGame.currentDate = currentDate;
    await updateDoc(userRef, {
      gameHistory: [...gameHistoryCopy, newGame]
    })
  }
}

const getGameHistoryOfPlayer = async(playerId) => {
  const userRef = doc(db, "users", `${playerId}`);

  let userSnap = await getDoc(userRef);
  let user =  userSnap.data();
  if (user !== undefined) {
    return user.gameHistory;
  }
}

const updatePlaylistTopScores = async(playlistId, playerId) => {

}

const updatePlayerRoundData = async(playerId, lobbyId, answer, score, remainingTime) => {
  let lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  let lobbySnap = await getDoc(lobbyRef);
  let lobby =  lobbySnap.data();

  let playersCopy = lobby.players;

  playersCopy.forEach((player) => {
    if (player.userId === playerId) {
      player.selectionDone = true;
      player.totalScore = player.totalScore + score;
      player.scores = [...player.scores, score];
      player.remainingTimes = [...player.remainingTimes, remainingTime];
      player.answers = [...player.answers, answer];
    }
  })

  await updateDoc(lobbyRef,{
    players: [...playersCopy]
  });

  lobbySnap = await getDoc(lobbyRef);
  lobby =  lobbySnap.data();

  playersCopy = lobby.players;

  let retVal = true;

  playersCopy.forEach((player) => {
    //console.log(player.selectionDone);
    if (!player.selectionDone) {
      retVal = false;
    }
  })
  console.log(retVal);

  return retVal;

}

const prepareAllPlayersToNextRound = async(lobbyId) => {
  let lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  let lobbySnap = await getDoc(lobbyRef);
  let lobby =  lobbySnap.data();

  let playersCopy = lobby.players;

  playersCopy.forEach((player) => {
    player.selectionDone = false
  })

  await updateDoc(lobbyRef,{
    players: [...playersCopy]
  });
}

const checkIfAllPlayersAnswered = async(lobbyId) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  const lobbySnap = await getDoc(lobbyRef);
  const lobby =  lobbySnap.data();

  let playersCopy = lobby.players;

  playersCopy.forEach((player) => {
    
    // if (player.selectionDone) {
    //   return true;
    // }
    console.log(player);
  })
}

const checkIfPlayerAnswered = async(playerId, lobbyId) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);

  const lobbySnap = await getDoc(lobbyRef);
  const lobby =  lobbySnap.data();

  let playersCopy = lobby.players;

  playersCopy.forEach((player) => {
    if (player.userId === playerId && player.selectionDone) {
      return true;
    }
  })

  return false;
}


// delete a lobby
const deleteLobbyFromDB = async (lobbyId) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);
  await deleteDoc(lobbyRef);
}

// get player count in a lobby
const getPlayerCountFromDB = async(lobbyId) => {
  const lobbyRef = doc(db, "lobbies", `${lobbyId}`);
  const lobbySnap = await getDoc(lobbyRef);
  const lobby =  lobbySnap.data();
  return lobby.players.length;
}

//get playlists

const getPlaylistsFromDB = async() => {

  const playlistsSnapshot = await getDocs(collection(db, "playlists"));

  let playlists = [];

  playlistsSnapshot.forEach((doc) => {
    playlists.push(doc.data());
  });

  return playlists;
}


export {
    auth,
    db,
    signInWithGoogle,
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordResetEmail,
    insertPlayerToLobbyDB,
    deletePlayerFromLobbyDB,
    deleteLobbyFromDB,
    getPlayerCountFromDB,
    updateGameSettingsDB,
    updateLobbyMusicDB,
    updateLobbyStatusDB,
    updatePlayerRoundData,
    getGameHistoryOfPlayer,
    checkIfAllPlayersAnswered,
    checkIfPlayerAnswered,
    updateGameHistoryOfPlayer,
    getPlaylistsFromDB,
    logout,
};