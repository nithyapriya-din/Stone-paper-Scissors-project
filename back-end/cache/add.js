const redis = require('./redis');

function addMatchToCache(matchId, matchObject){
    redis.client.set("MATCH_" + matchId, JSON.stringify(matchObject));
}

function addPlayerToCache(userId, matchId){
    redis.client.set("PLAYER_" + userId, matchId);
}

module.exports = {
    addMatchToCache,
    addPlayerToCache
}