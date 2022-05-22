import {getMusicDataFromServer, calculateRatio, calculateAvgAnswerTime} from '../src/utils/GameUtils';
import {getLobbyByLobbyId, getPlayerOfLobby, updateGameSettingsDB, updateLobbyStatusDB, insertPlayerToLobbyDB, deletePlayerFromLobbyDB, getGameHistoryOfPlayer, getPlaylistsFromDB} from '../src/firebase';
import React from 'react';
import axios from 'axios';
//require('../src/utils/GameUtils')


// NODE.JS SERVER TESTS
test('if 12 wrong answers came from server', async() => {
    let resp = await getMusicDataFromServer('37i9dQZF1DXcNf6sH1qnKU', '4');
    expect((resp.wrongAnswers).length).toBe(12);
});

test('if 4 tracks came from server', async() => {
    let resp = await getMusicDataFromServer('37i9dQZF1DXcNf6sH1qnKU', '4');
    expect((resp.tracks).length).toBe(4);
});

//TEST_LOBBY_1 : 777546911
//TEST_LOBBY_2 : 276134591
//TEST_LOBBY_3 : 443699025
//Tester_A : DYbsx9Jug9Zh31uAZSfD
//Tester_B : fCIf9JI71F8d2fs0gO8D
/********************************************************************************/

test('if game ratio is calculated correctly', async() => {
    const lobby = await getLobbyByLobbyId('443699025');
    console.log(lobby);
    const player = await getPlayerOfLobby('DYbsx9Jug9Zh31uAZSfD', '443699025');
    console.log(player);
    const retVal = calculateRatio(player, lobby);
    expect(retVal).toBe(40);
});

test('if game average answer time is calculated correctly', async() => {
    const lobby = await getLobbyByLobbyId('443699025');
    console.log(lobby);
    const player = await getPlayerOfLobby('DYbsx9Jug9Zh31uAZSfD', '443699025');
    console.log(player);
    const retVal = calculateAvgAnswerTime(player, lobby);
    expect(retVal).toBe("5.80");
});

// lobby : 777546911
/********************************************************************************/

test('if game settings of a lobby are updated correctly', async() => {
    await updateGameSettingsDB('777546911', '4', '15', '0DhuezImEW1MhNIP7Am5jh')
    const lobby = await getLobbyByLobbyId('777546911');
    expect(lobby.noRounds).toBe('4');
    expect(lobby.playbackTime).toBe('15');
    expect(lobby.playlistId).toBe('0DhuezImEW1MhNIP7Am5jh');
});


test('if lobby status is updated correctly', async() => {
    await updateLobbyStatusDB('777546911', true, 3, 'Game End');
    const lobby = await getLobbyByLobbyId('777546911');
    expect(lobby.roundEnded).toBe(true);
    expect(lobby.currentRound).toBe(3);
    expect(lobby.status).toBe('Game End');
});

// lobby : 276134591
/********************************************************************************/

test('if player is successfully inserted to lobby', async() => {
    // first check if a player with given id doesn't exist, 
    //then apply insert function and check whether its inserted successfully
    const emp = await getPlayerOfLobby('fCIf9JI71F8d2fs0gO8D', '276134591');
    console.log(emp);
    expect(emp).toBe(undefined);
    let newPlayer = {
        userId: 'fCIf9JI71F8d2fs0gO8D',
        userName: "TESTER_B",
        isHost: false,
        scores: [],
        answers: [],
        selectionDone: false,
        totalScore: 0,
        remainingTimes: [],
    };
    await insertPlayerToLobbyDB(newPlayer, '276134591');
    const resp = await getPlayerOfLobby('fCIf9JI71F8d2fs0gO8D', '276134591');
    expect(resp.userId).toBe('fCIf9JI71F8d2fs0gO8D');
});

test('if player is successfully deleted from lobby', async() => {
    // first check if a player with given id exists, 
    //then apply delete function and check whether its deleted successfully

    const resp = await getPlayerOfLobby('fCIf9JI71F8d2fs0gO8D', '276134591');
    expect(resp.userId).toBe('fCIf9JI71F8d2fs0gO8D');
    await deletePlayerFromLobbyDB('fCIf9JI71F8d2fs0gO8D', '276134591');
    const resp2 = await getPlayerOfLobby('fCIf9JI71F8d2fs0gO8D', '276134591');
    expect(resp2).toBe(undefined);
});

test('if game histories of a player are successfully returned', async() => {
    const retVal = await getGameHistoryOfPlayer('DYbsx9Jug9Zh31uAZSfD');
    expect(retVal.length).toBe(2);
});

test('if all game playlists are successfully stored and returned from db', async() => {
    const playlists = await getPlaylistsFromDB();
    expect(playlists.length).toBe(2);
});

/*
test('if prepare players to next round function is working correctly', async() => {
    prepareAllPlayersToNextRound();
});
*/