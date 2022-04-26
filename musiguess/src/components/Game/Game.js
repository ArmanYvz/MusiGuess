import React from "react";
import "./Game.css";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { db, updatePlayerAnswer, updateLobbyStatusDB, checkIfPlayerAnswered } from "../../firebase";

const Game = ({lobby, currentPlayerHostCheck, lobbyId}) => {
  const navigate = useNavigate();

  const[userSelectionDone, setUserSelectionDone] = useState(false);
  //const[shuffledAnswers, setShuffledAnswers] = useState([]);
  var shuffledAnswers = [];
  const prevAnswers = useRef();
  const selectionText = useRef();

  const handleExitGame = () => {
    navigate("/lobbies", { replace: true });
  };

  const handleNextRound = () => {
    console.log("next round click");
    setUserSelectionDone(false);
    updateLobbyStatusDB(lobbyId, false, lobby.status);
  }

  const handleEndGame = () => {
    console.log("end game click");
    // game end logic will be coded here
  }

  const handleAnswerClick = (text) => {
    stopSound(lobby.currentRound-1);  // stop sound after we made a choice
    selectionText.current = text; //store selection value in a variable because it somehow preempties during re-renders
    updatePlayerAnswer(localStorage.getItem("userId"), lobbyId, text); //we can also insert remainingTime to here after implement
    setUserSelectionDone(true);
  }

  const QuestionAnswers = () =>{
    const answers = [];

    Object.keys(lobby.wrongAnswers[lobby.currentRound-1]).forEach((key)=>{
      answers.push(lobby.wrongAnswers[lobby.currentRound-1][key])
    })

    answers.push(lobby.tracks[lobby.currentRound-1].trackName)

    if (!userSelectionDone) {   // if we never made a selection, render answers as enabled so we can choose during round.
      shuffledAnswers = shuffle(answers);
      prevAnswers.current = shuffledAnswers;
      return(
        shuffledAnswers.map((answer)=>{
          return(
          <div className="game__main__left__questionContainer__answers__answer">
            <p className="noselect" disabled={false} onClick={(e) => handleAnswerClick(e.target.innerText)}>{answer}</p>
          </div>)
        })
      )
    }
    else {    // else it means we already made a selection, so render answers as disabled
      return(
        prevAnswers.current.map((answer)=>{
          if (answer === selectionText.current) {   //if answer was our latest selection, render it as yellow background
            return(
              <div style={{backgroundColor: "yellow"}} className="game__main__left__questionContainer__answers__answer">
                <p className="noselect" disabled={true}>{answer}</p>
              </div>)
          }
          else {    // else it isn't our selection, so render it normally
            return(
              <div className="game__main__left__questionContainer__answers__answer">
                <p className="noselect" disabled={true}>{answer}</p>
              </div>)
          }
          
        })
      )
    }
    
    
  }

  const RoundScores = () => {
    return(
      lobby.players.map((player) => {
        return(
          <div className="game__main__right__leaderboardContainer__table__row">
            <p>{player.userName} {lobby.playbackTime-player.remainingTime[lobby.currentRound-1]} sec</p>
            <p>+{player.scores[lobby.currentRound-1]}</p> 
          </div>
        )
      })
    )
  }

  const OverallScores = () => {
    return(
      lobby.players.map((player) => {
        return(
          <div className="game__main__right__leaderboardContainer__table__row">
            <p>+{player.totalScore}</p> 
          </div>
        )
      })
    )
  }

  // state to store audios of every round
  const [audioArray,setAudioArray] = useState();

  useEffect(()=>{
    let i = 0;
    const audioData = lobby.tracks.map((track)=>{
      i++;
      return {audio: new Audio("https://p.scdn.co/mp3-preview/" + lobby.tracks[i-1].previewUrl), isPlaying: false}
    })

    setAudioArray(audioData);
  },[])


  const playSound = (audioIdx) =>{
    setAudioArray((arr) =>
      arr.map((sound, i) => {
        if (i === audioIdx) {
          sound.audio.play();
          return { ...sound, play: true };
        }
        sound.audio.pause();
        return { ...sound, play: false };
      })
    );
  }

  const stopSound = (audioIdx) => {
    setAudioArray((arr) =>
      arr.map((sound, i) => {
        if (i === audioIdx) {
          sound.audio.pause();
          return { ...sound, play: false };
        }
        return { ...sound, play: false };
      })
    );
  };


  const {roundEnded} = lobby;

  useEffect(()=>{
    console.log(audioArray);
    if(roundEnded){
      stopSound(lobby.currentRound-1);
    }
    else{
      playSound(lobby.currentRound-1);
    }

  },[roundEnded])



  // source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

  return (
    <div className="game">
      <div className="game__main">
        <div className="game__main__left">
          <div className="game__main__left__questionContainer">
            <div className="game__main__left__questionContainer__question">
              <p className="noselect"> Round {lobby.currentRound} of {lobby.noRounds}</p>
              <h1 className="noselect">Guess the Song !</h1>
            </div>
            <div className="game__main__left__questionContainer__answers">
              <QuestionAnswers/>
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
          { lobby.currentRound == lobby.noRounds ?
            <button className="game__footer__right__buttonEndGame" disabled={!currentPlayerHostCheck} onClick={() => handleEndGame}>
              End Game
            </button>
            :
            <button className="game__footer__right__buttonNextRound" disabled={!currentPlayerHostCheck} onClick={() => handleNextRound}>
              Next Round
            </button>
            
          } 
          
        </div>
      </div>
    </div>
  );
};

export default Game;
