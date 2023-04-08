const express = require('express')
const app = express();
const http = require('http')
const fs = require('fs')
require('dotenv').config();

var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    steamUser = new Steam.SteamUser(steamClient),
    steamGC = new Steam.SteamGameCoordinator(steamClient, 730),
    csgo = require('csgo'),
    CSGO = new csgo.CSGOClient(steamUser, steamGC, true);

const download = function (url, dest) {
    const file = fs.createWriteStream(dest);
    http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
        })
    })
}


const match = new csgo.SharecodeDecoder("CSGO-bsqib-odkHy-WbcMN-dACJi-ViZtH").decode();
console.log(match);


steamClient.connect(); // Connect to the Steam network

steamClient.on('connected', () => {
    console.log('Connected to Steam network');
    steamUser.logOn({
        account_name: process.env.CS_USERNAME,
        password: process.env.CS_PASSWORD
    });
});

steamClient.on('logOnResponse', (logonResp) => {
    if (logonResp.eresult === Steam.EResult.OK) {
        console.log('Logged in to Steam');
    }
    CSGO.launch();

    CSGO.on("ready", function () {
        console.log('cs ready')
        CSGO.requestGame('3609666415944007803', '3609669186197913934', 33211);
    })

    CSGO.on("matchList", function (list) {
        const url = list.matches[0].roundstatsall[list.matches[0].roundstatsall.length - 1].map
        download(url, __dirname + '/demos/test')
    })


});

steamClient.on('error', (err) => {
    console.error('Error connecting to Steam:', err);
});


app.get('/', (req, res) => {
    res.send(req.user);
});

// Start the server
app.listen(3001, () => {
    console.log('Server started on port 3000');
});
