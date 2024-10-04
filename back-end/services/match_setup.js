const match = require('../objects/match');
const cacheAdd = require('../cache/add');
const constants = require('../objects/constants');

function hostMatch(userId, numRounds, gameMode, socketId) {
    var newMatch = match.createMatch(userId, numRounds, gameMode, socketId);
    var matchId = generateMatchId();
    cacheAdd.addPlayerToCache(socketId, matchId);
    cacheAdd.addMatchToCache(matchId, newMatch);
    return matchId;
}

function joinMatch(userId, matchId, matchData, socketId) {
    matchData.players.player2 = userId;
    matchData.sockets.player2 = socketId;
    matchData.status = constants.MATCH_STARTED;
    cacheAdd.addPlayerToCache(socketId, matchId);
    cacheAdd.addMatchToCache(matchId, matchData);
    return matchData;
}

function generateMatchId(){
    const numbers = "9876543210";
    var id = "";
    for(let i=0; i<6; i++){
        id += numbers.charAt(Math.random() * 10);
    }
    return id;
}

module.exports = {
    hostMatch,
    joinMatch
}