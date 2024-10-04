const redis = require('./redis');

function deleteMatchById(matchId){
    redis.client.del("MATCH_" + matchId);
}

function deletePlayerById(userId){
    redis.client.del("PLAYER_" + userId);
}

module.exports = {
    deleteMatchById,
    deletePlayerById
}