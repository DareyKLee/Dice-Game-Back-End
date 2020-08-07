const express = require('express');
const socket = require('socket.io');
const app = express();
const Game = require('./game/game');

const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
    console.log(`SERVER RUNNING ${port}`);
});

let io = socket(server);
let player1Socket;
let player2Socket;
let createGameSessionFlag = false;

io.on('connection', (socket) => {
    if (!createGameSessionFlag) {
        createGameSessionFlag = !createGameSessionFlag;
        player1Socket = socket;

        console.log('PLAYER 1 CONNECTED');
        
        player1Socket.on('disconnect', function() {
            createGameSessionFlag = !createGameSessionFlag;
            
            console.log('PLAYER 1 DISCONNECTED');
        });

    } else {
        createGameSessionFlag = !createGameSessionFlag;
        player2Socket = socket;
        
        player1Socket.removeAllListeners('disconnect');

        console.log('PLAYER 2 CONNECTED');

        new Game(player1Socket, player2Socket);

        console.log('GAME CREATED');
    }
});