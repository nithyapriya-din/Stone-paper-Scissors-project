const constants = require('./constants');

function createMatch(userId, numRounds, gameMode, socketId){
    return {
        players: {
            player1: userId,
            player2: null
        },
        scores: {
            player1: 0,
            player2: 0
        },
        sockets: {
            player1: socketId,
            player2: ""
        },
        moves: {
            player1: "",
            player2: ""
        },
        currentRound: 1,
        numRounds,
        gameMode,
        status: constants.MATCH_WAITING
    };
}

module.exports = {
    createMatch
}
