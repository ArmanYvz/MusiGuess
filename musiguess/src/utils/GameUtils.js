import React from 'react'
import axios from 'axios';

export async function getMusicDataFromServer(playlistId, noRounds) {
    let returnArr = [];
    try {
        await axios.get(`https://musiguess.herokuapp.com/api/${playlistId}/${noRounds}`)
        .then(res => {
            const data = res.data;
            returnArr.tracks = data.tracks;
            returnArr.wrongAnswers = data.wrongAnswers;
        })
        return returnArr;
    }
    catch(error) {
        console.log(error);
    }
}

export function calculateRatio(player, lobby) {
    let idx = 0;
    let correctCount = 0;
    player.answers.forEach((answer) => {
        if (answer === lobby.tracks[idx].trackName) {
            correctCount++;
        }
        idx++;
    })
    return (100 * Math.round(correctCount/lobby.noRounds * 100)/100);
}

export function calculateRatioGameHistory(gameHistory) {
    let idx = 0;
    let correctCount = 0;
    gameHistory.answers.forEach((answer) => {
        if (answer === gameHistory.tracks[idx].trackName) {
            correctCount++;
        }
        idx++;
    })

    return (100 * Math.round(correctCount/gameHistory.tracks.length * 100)/100);
}

export function calculateAvgAnswerTimeGameHistory(gameHistory) {
    let totalAnswerTime = 0;
    gameHistory.remainingTimes.forEach((remaining) => {
        totalAnswerTime += parseInt(gameHistory.playbackTime - remaining);
    })
    return (Math.round(totalAnswerTime/gameHistory.noRounds * 100)/100).toFixed(2);
}

export function calculateTotalScoreGameHistory(gameHistory) {
    let totalScore = 0;
    gameHistory.scores.forEach((score) => {
        totalScore += score;
    })

    return (Math.round(totalScore * 100)/100).toFixed(2);
}

export function calculateAvgAnswerTime(player, lobby) {
    let totalAnswerTime = 0;
    player.remainingTimes.forEach((remaining) => {
        totalAnswerTime += parseInt(lobby.playbackTime - remaining);
    })
    return (Math.round(totalAnswerTime/lobby.noRounds * 100)/100).toFixed(2);
}