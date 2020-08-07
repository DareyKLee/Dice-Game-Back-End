class Game {
    constructor(player1Socket, player2Socket) {
        this.dice = 1000;
        this.pot = 0;
        this.bet = 10;
        this.player1Gold = 1000;
        this.player2Gold = 1000;
        this.activePlayer = 1;

        this.player1Socket = player1Socket;
        this.player2Socket = player2Socket;

        this.setSocketFunctions(this.player1Socket, this.player2Socket);
        this.setSocketFunctions(this.player2Socket, this.player1Socket);

        this.sendGameStateToSockets();
    }

    setSocketFunctions(playerSocket, opponentSocket) {
        playerSocket.on('message', (message) => {
            switch(message) {
                case 'ROLL':
                    this.roll();
                    break;
                case 'FOLD':
                    this.fold();
                    break;
            }
        });

        playerSocket.on('disconnect', function() {
            opponentSocket.send('OPPONENT DISCONNECTED');
            opponentSocket.disconnect();
        })
    }

    sendGameStateToSockets() {
        this.player1Socket.send(this.player1GameStateToJSON());
        this.player2Socket.send(this.player2GameStateToJSON());
    }

    disconnectSockets() {
        this.player1Socket.disconnect();
        this.player2Socket.disconnect();
    }

    /**********************************************************************************************/

    roll() {
        this.placeBet();

        this.dice = Math.ceil(Math.random() * this.dice);

        this.checkRoll();
        this.switchActivePlayer();
        this.calculateNewBet();
        this.checkLoser();
    }

    fold() {
        if (this.activePlayer === 1) {
            this.sendRoundMessages(this.player2Socket, this.player1Socket);
        } else {
            this.sendRoundMessages(this.player1Socket, this.player2Socket);
        }

        this.payOut();
    }

    player1GameStateToJSON() {
        return {
            'dice': this.dice,
            'pot': this.pot,
            'bet': this.bet,
            'playerGold': this.player1Gold,
            'opponentGold': this.player2Gold,
            'playerTurn': this.activePlayer === 1
        }
    }

    player2GameStateToJSON() {
        return {
            'dice': this.dice,
            'pot': this.pot,
            'bet': this.bet,
            'playerGold': this.player2Gold,
            'opponentGold': this.player1Gold,
            'playerTurn': this.activePlayer === 2
        }
    }

    sendRoundMessages(winnerPlayerSocket, loserPlayerSocket) {
        winnerPlayerSocket.send('WON ROUND');
        loserPlayerSocket.send('LOST ROUND');
    }

    sendGameMessages(winnerPlayerSocket, loserPlayerSocket) {
        winnerPlayerSocket.send('WON GAME');
        loserPlayerSocket.send('LOST GAME');

        this.disconnectSockets();
    }

    /**********************************************************************************************/

    checkLoser() {
        if (this.activePlayer === 1) {
            if (this.player1Gold < this.bet) {
                //PLAYER 1 LOSES
                this.sendGameMessages(this.player2Socket, this.player1Socket);
            }
        } else {
            if (this.player2Gold < this.bet) {
                //PLAYER 2 LOSES
                this.sendGameMessages(this.player1Socket, this.player2Socket);
            }
        }
    }

    calculateNewBet() {
        this.bet = Math.ceil(Math.pow(10, 1 + ((1000 - this.dice)) / 1000));
        this.sendGameStateToSockets();
    }

    placeBet() {
        this.activePlayer === 1 ? this.player1Gold -= this.bet : this.player2Gold -= this.bet;
        this.pot += this.bet;
    }

    checkRoll() {
        if (this.dice === 1) {
            this.sendGameStateToSockets();

            if (this.activePlayer === 1) {
                this.sendRoundMessages(this.player2Socket, this.player1Socket);
            } else {
                this.sendRoundMessages(this.player1Socket, this.player2Socket);
            }

            this.payOut();
        }
    }

    payOut() {
        this.activePlayer === 1 ? this.player2Gold += this.pot : this.player1Gold += this.pot;
        this.newMatch();
        this.sendGameStateToSockets();
    }

    newMatch() {
        this.dice = 1000;
        this.pot = 0;
        this.bet = 10;
    }

    switchActivePlayer() {
        this.activePlayer === 1 ? this.activePlayer = 2 : this.activePlayer = 1;
    }
}

module.exports = Game;