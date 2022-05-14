import {getMusicDataFromServer} from '../src/utils/GameUtils';
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

/*
test('calculateRatio', () => {

});

test('calculateAvgAnswerTimeGameHistory', () => {

});

test('calculateTotalScoreGameHistory', () => {

});

test('calculateRatioGameHistory', () => {

});

test('calculateAvgAnswerTime', () => {

});

test('loginDB', () => {

});

test('registerDB', () => {

});*/