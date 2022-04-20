// a node.js server to handle requests to spotify api

const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const port = 5000;

const dotenv = require('dotenv');

dotenv.config();
console.log(`value is ${process.env.CLIENT_ID}`); // undefined

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const spotifyWebApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
})

var returnTrackCount = 0;

//var wrongAnswersCount = 0;

var arr;

var wrongAnswers;

// create a get route that sends a json response

// if a track has valid preview url, track will be added into response array. then returned tracks will be used in client side. 
app.get('/api/:playlistId/:noRounds', (req, res) => {
    returnTrackCount = 0;
    //wrongAnswersCount = 0;
    arr = [];
    wrongAnswers = [];
    // get token
    spotifyWebApi.clientCredentialsGrant()
        .then((token) => {
            // set the access token on the API object to use it in later calls
            // console.log("token: ", token.body['access_token'])
            spotifyWebApi.setAccessToken(token.body.access_token);
        }).then(() => {
            // get playlist
            spotifyWebApi.getPlaylist(req.params.playlistId, { 'market': 'TR' })
                .then((playlist) => {
                    arr = playlist.body.tracks.items;
                    shuffle(arr);
                    //console.log(arr);
                    //shuffle(playlist);   // first shuffle the returned playlist in order not to always get same return sequence 
                    const response = {
                        "playlistName": playlist.body.name,
                        "tracks": arr.map((item) => {

                            // if item.track has available preview url and we have less selected tracks than number of rounds,
                            // add the item.track to response array and increase count by one
                            if ((item.track.preview_url != null) && (returnTrackCount < parseInt(req.params.noRounds))) {
                                returnTrackCount++;
                                return {
                                    "trackName": item.track.name,
                                    /*"trackArtists": item.track.artists.map((artist) => {
                                        return {
                                            "artist": artist.name
                                        }
                                    }),*/
                                    "trackArtist": item.track.artists[0].name,
                                    "previewUrl": item.track.preview_url
                                }
                            }
                            else {      // if condition falls to else, it means we can return it as a "wrong" answer
                                if (wrongAnswers.length < req.params.noRounds * 3) {
                                    wrongAnswers.push(item.track.name);
                                    //wrongAnswersCount++;
                                }
                            }
                        }),
                        "wrongAnswers": wrongAnswers

                    }

                    res.json(response);
                })
        }).catch(error => res.json(error));
});

// source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})