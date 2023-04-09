const express = require('express')
const app = express();
const http = require('http')
const fs = require('fs')
const demofile = require('demofile')
const path = require('path')
const unbzip2 = require('unbzip2-stream');
require('dotenv').config();
const Steam = require('steam')
const steamClient = new Steam.SteamClient()
const steamUser = new Steam.SteamUser(steamClient)
const steamGC = new Steam.SteamGameCoordinator(steamClient, 730)
const csgo = require('csgo')
const CSGO = new csgo.CSGOClient(steamUser, steamGC, true);
const demoFile = new demofile.DemoFile();

const download = function (url, dest) {
    const file = fs.createWriteStream(dest);
    http.get(url, resp => {
        resp.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Download finished');
            unzip();
        });
    }).on('error', err => {
        console.error(`Error downloading file: ${err.message}`);
    });
    ;
}

const unzip = function () {
    const readStream = fs.createReadStream(__dirname + '/demos/test.bz2');
    const writeStream = fs.createWriteStream(__dirname + '/demos/test.dem')
    readStream.pipe(unbzip2()).pipe(writeStream).on('finish', () => {
        console.log('extracted')
        try {
            demoFile.parseStream(fs.createReadStream(__dirname + '/demos/test.dem'));
        } catch (e) {
            console.log(e)
        }
    })
}

demoFile.gameEvents.on("round_start", e => {
    console.log(e)
})

demoFile.gameEvents.on("player_footstep", e => {

    if (e.player.name === 'Ante'){

        console.log(e.player.position);
    }
})

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
        CSGO.requestGame(match.matchId, match.outcomeId, parseInt(match.tokenId));
    })

    CSGO.on("matchList", async function (list) {

        // kom på ett sätt att skicka o spara path till demot bättre! :)


        const url = list.matches[0].roundstatsall[list.matches[0].roundstatsall.length - 1].map
        console.log(url)
        await download(url, __dirname + '/demos/test.bz2');
        const pathToFile = path.join(__dirname, '/demos/test.bz2');
    })


});

steamClient.on('error', (err) => {
    console.error('Error connecting to Steam:', err);
});

steamClient.connect(); // Connect to the Steam network

const match = new csgo.SharecodeDecoder('CSGO-Dkuzq-7P42T-qh4qA-rSsXH-NcHLH').decode();



app.get('/', (req, res) => {
    res.send(req.user);
});

// Start the server
app.listen(3001, () => {
    console.log('Server started on port 3000');
});
