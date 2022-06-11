import React from "react";
import "./Game.css";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import {
  db,
  updatePlayerRoundData,
  updateLobbyStatusDB,
  updateGameHistoryOfPlayer,
  checkIfPlayerAnswered,
  checkIfAllPlayersAnswered,
} from "../../firebase";
import Timer from "../Timer/Timer";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Game = ({ lobby, currentPlayerHostCheck, lobbyId }) => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/", { replace: true });
  }, [user, loading]);
  var time = 0;

  const [isTimerActive, setIsTimerActive] = useState(false);

  const [userSelectionDone, setUserSelectionDone] = useState(false);
  //const[roundStarts,setRoundStarts] = useState(false);
  //const[shuffledAnswers, setShuffledAnswers] = useState([]);
  var shuffledAnswers = [];
  const prevAnswers = useRef();
  const didRoundStart = useRef();
  const selectionText = useRef();

  useEffect(() => {
    setUserSelectionDone(false);
    didRoundStart.current = false;
    setIsTimerActive(true);
    const answers = [];

    Object.keys(lobby.wrongAnswers[lobby.currentRound - 1]).forEach((key) => {
      answers.push(lobby.wrongAnswers[lobby.currentRound - 1][key]);
    });

    answers.push(lobby.tracks[lobby.currentRound - 1].trackName);
    if (!didRoundStart.current) {
      //console.log("burdayim");
      shuffledAnswers = shuffle(answers);
      prevAnswers.current = shuffledAnswers; // save those answers in a variable - we'll need them after component re-renders
    }
    didRoundStart.current = true;
    // console.log(didRoundStart.current);
  }, [lobby.currentRound]);

  /*useEffect(() => {
    window.onbeforeunload = function () {
      stopSound(lobby.currentRound-1);
    };
    return () => {
      window.onbeforeunload = null;
    };
    
  }, []);*/

  const handleExitGame = () => {
    navigate("/lobbies", { replace: true });
  };

  const handleNextRound = () => {
    // console.log("next round click");
    setUserSelectionDone(false);
    updateLobbyStatusDB(lobbyId, false, lobby.currentRound + 1, lobby.status);
  };

  const handleEndGame = async () => {
    // console.log("end game click");
    // console.log(lobby.tracks);
    let currentDate = new Date().toLocaleString() + "";
    await lobby.players.forEach((player) => {
      updateGameHistoryOfPlayer(
        player.userId,
        lobby.playbackTime,
        lobby.noRounds,
        lobby.tracks,
        player.answers,
        player.scores,
        player.remainingTimes,
        currentDate
      );
    });
    updateLobbyStatusDB(lobbyId, false, lobby.currentRound, "Game End");
  };

  const calculateScore = (remainingTime, answerText) => {
    let score;
    if (answerText === lobby.tracks[lobby.currentRound - 1].trackName) {
      // true selection, score multiplied by remaining time
      score = 100 * (remainingTime / lobby.playbackTime);
    } else {
      // false selection
      score = 0;
    }
    return score;
  };

  const pull_data = async (data) => {
    time = (Math.round(data * 100) / 100).toFixed(2);
    //console.log(time);
    if (time < 0.01) {
      // it means round ended and we still didn't make a selection
      stopSound(lobby.currentRound - 1);
      setIsTimerActive(false);
      let resp = await updatePlayerRoundData(
        localStorage.getItem("userId"),
        lobbyId,
        "NaN",
        0,
        0
      );
      if (resp) {
        updateLobbyStatusDB(lobbyId, true, lobby.currentRound, lobby.status);
      }
    }
  };

  const handleAnswerClick = async (text) => {
    console.log(text);
    setIsTimerActive(false);
    setUserSelectionDone(true);
    stopSound(lobby.currentRound - 1); // stop sound after we made a choice
    selectionText.current = text; //store selection value in a variable because it somehow preempties during re-renders
    let s = calculateScore(time, text);
    let resp = await updatePlayerRoundData(
      localStorage.getItem("userId"),
      lobbyId,
      text,
      s,
      time
    );
    if (resp) {
      updateLobbyStatusDB(lobbyId, true, lobby.currentRound, lobby.status);
    }
  };

  const QuestionAnswers = () => {
    //console.log(shuffledAnswers);
    if (!userSelectionDone) {
      // if we never made a selection, render answers as enabled so we can choose during round
      if (shuffledAnswers.length > 0) {
        return shuffledAnswers.map((answer, idx) => {
          return (
            <div
              className="game__main__left__questionContainer__answers__answer"
              onClick={(e) => handleAnswerClick(e.target.innerText)}
              key={idx}
            >
              <p className="noselect" disabled={false}>
                {answer}
              </p>
            </div>
          );
        });
      } else {
        if (didRoundStart.current) {
          return prevAnswers.current.map((answer, idx) => {
            return (
              <div
                className="game__main__left__questionContainer__answers__answer"
                key={idx}
                onClick={(e) => handleAnswerClick(e.target.innerText)}
              >
                <p className="noselect" disabled={false}>
                  {answer}
                </p>
              </div>
            );
          });
        } else {
          return <p className="noselect">loading...</p>;
        }
      }
    } else {
      // else it means we already made a selection, so render answers as disabled
      return prevAnswers.current.map((answer, idx) => {
        if (answer === selectionText.current) {
          //if answer was our latest selection, render it as yellow background
          return (
            <div
              style={{ backgroundColor: "yellow" }}
              className="game__main__left__questionContainer__answers__answer"
              key={idx}
            >
              <p className="noselect" disabled={true}>
                {answer}
              </p>
            </div>
          );
        } else {
          // else it isn't our selection, so render it normally
          return (
            <div
              className="game__main__left__questionContainer__answers__answer"
              key={idx}
            >
              <p className="noselect" disabled={true}>
                {answer}
              </p>
            </div>
          );
        }
      });
    }
  };

  const RoundScores = () => {
    const playersSorted = lobby.players.sort(
      (a, b) =>
        b.scores[lobby.currentRound - 1] - a.scores[lobby.currentRound - 1]
    );
    // console.log(playersSorted);
    return playersSorted.map((player) => {
      return (
        <div
          className="game__main__right__leaderboardContainer__table__row"
          key={player.userId}
        >
          <p>
            {player.userName} (+
            {(
              lobby.playbackTime -
              (
                Math.round(
                  player.remainingTimes[lobby.currentRound - 1] * 100
                ) / 100
              ).toFixed(2)
            ).toFixed(2)}{" "}
            sec)
          </p>
          <p>
            +
            {(
              Math.round(player.scores[lobby.currentRound - 1] * 100) / 100
            ).toFixed(2)}
          </p>
        </div>
      );
    });
  };

  const OverallScores = () => {
    const playersSorted = lobby.players.sort(
      (a, b) => b.totalScore - a.totalScore
    );
    return playersSorted.map((player) => {
      return (
        <div
          className="game__main__right__leaderboardContainer__table__row"
          key={player.userId}
        >
          <p>{player.userName}</p>
          <p>{(Math.round(player.totalScore * 100) / 100).toFixed(2)}</p>
        </div>
      );
    });
  };

  // state to store audios of every round
  const [audioArray, setAudioArray] = useState();
  const [audioVolume, setAudioVolume] = useState(0.5);

  useEffect(() => {
    if (audioArray) {
      audioArray.forEach((track) => {
        track.audio.volume = audioVolume;
      });
    }
  }, [audioVolume]);

  useEffect(() => {
    let i = 0;
    const audioData = lobby.tracks.map((track) => {
      i++;
      return {
        audio: new Audio(
          "https://p.scdn.co/mp3-preview/" + lobby.tracks[i - 1].previewUrl
        ),
        isPlaying: false,
      };
    });

    audioData.forEach((track) => {
      track.audio.volume = audioVolume;
    });

    setAudioArray(audioData);
  }, []);

  const playSound = (audioIdx) => {
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
  };

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

  const { roundEnded } = lobby;

  useEffect(() => {
    //console.log(audioArray);
    if (roundEnded) {
      stopSound(lobby.currentRound - 1);
    } else {
      playSound(lobby.currentRound - 1);
    }
  }, [roundEnded]);

  // source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  return (
    <div className="game">
      <div className="game__main">
        <div className="game__main__left">
          <div className="game__main__left__questionContainer">
            <div className="game__main__left__questionContainer__question">
              <p className="noselect">
                {" "}
                Round {lobby.currentRound} of {lobby.noRounds}
              </p>
              <h1 className="noselect">Guess the Song !</h1>
            </div>
            <div className="game__main__left__questionContainer__answers">
              <QuestionAnswers />
            </div>
            <div className="game__main__left__questionContainer__volumeSlider">
              <VolumeUpIcon />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioVolume}
                onChange={(e) => setAudioVolume(e.target.value)}
              />
              <p>{audioVolume * 100} %</p>
            </div>
          </div>
        </div>
        <div className="game__main__right">
          <div className="game__main__right__leaderboardContainer">
            {lobby.roundEnded && (
              <div className="game__main__right__leaderboardContainer__roundScores">
                <p>Scores</p>
                <div className="game__main__right__leaderboardContainer__roundScores__table">
                  <RoundScores />
                </div>
              </div>
            )}
            {lobby.roundEnded && (
              <div className="game__main__right__leaderboardContainer__overallScores">
                <p>Overall</p>
                <div className="game__main__right__leaderboardContainer__overallScores__table">
                  <OverallScores />
                </div>
              </div>
            )}

          {isTimerActive && (
            <Timer pullTime={pull_data} playbackTime={lobby.playbackTime} />
          )}

          

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
          {lobby.currentRound !== lobby.noRounds && lobby.roundEnded ? (
            <button
              className="game__footer__right__buttonNextRound"
              hidden={!currentPlayerHostCheck()}
              onClick={() => handleNextRound()}
            >
              Next Round
            </button>
          ) : lobby.roundEnded ? (
            <button
              className="game__footer__right__buttonEndGame"
              hidden={!currentPlayerHostCheck()}
              onClick={() => handleEndGame()}
            >
              End Game
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
