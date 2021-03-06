# DICE GAME
To access the Don't Roll One game web application, visit https://dont-roll-one.herokuapp.com.  
(open multiple tabs of the same page to play against yourself to see how the application works)  

NOTE: Due to low traffic for this web application, the hosting servers for both front and back end unloads the application from its memory when idles for an extended period of time. If you are the first user of this application when the server has gone idle, it will take a few moments to access the page and another few moments to start a new game.

## BACK END
This repository contains the server and game logic for the Don't Roll One game web application.  
  
## FUNCTIONALITY
The server waits for incoming socket connections from players.  
For each pair of player connections, the server creates a new game session for these players.  
  
Upon the creation of a new game, the server sends a message of the default game state through the relevant player sockets.  
The server processes any incoming requests from the players and sends the updated game state through the relevant player sockets.  
  
A game session concludes when there is a winner or when a player disconnects from the session.  
When the session concludes, the server sends a message to the players announcing the winner/loser or a disconnection message before closing the sockets relevant to that game session.  
  
## FRAMEWORKS UTILIZED
NodeJS  
Socket.IO  
Express  
  
## DEPLOYMENT
Deployed on Heroku
