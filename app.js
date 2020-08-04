const express = require('express');
const socket = require('socket.io');
const app = express();
const Game = require('./game/game');

const port = process.env.PORT || 8081;
// const port = 8081;
const server = app.listen(port, () => {
    console.log('SERVER RUNNING');
});

let io = socket(server);
let player1Socket;
let player2Socket;
let createGameSessionFlag = false;

io.on('connection', (socket) => {
    if (!createGameSessionFlag) {
        createGameSessionFlag = !createGameSessionFlag;
        player1Socket = socket;

    } else {
        createGameSessionFlag = !createGameSessionFlag;
        player2Socket = socket;
        
        new Game(player1Socket, player2Socket);
    }
});