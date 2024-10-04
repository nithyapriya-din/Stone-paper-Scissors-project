const gameMethods = require('../services/game_methods');

function registerEvents(io) {
    io.on('connection', (socket) => {

        console.log("User connected:", socket.id);
        socket.emit('WELCOME_MSG', socket.id);

        socket.on('JOIN_ROOM', function (data) {
            console.log("Room Join:", data.matchId, "User:", data.userId);
            socket.join(data.matchId);
            if(!data.isHost){
                gameMethods.startGame(io, data.matchId);
            }
        });

        socket.on('ROUND_PLAY', function (data) {
            gameMethods.playRound(io, socket.id, data.card);
        });

        socket.on('disconnect', function() {
            console.log("User disconnected:", socket.id);
            gameMethods.declareWinnerByDisconnect(io, socket.id);
        });
    });
}

module.exports = {
    registerEvents
};