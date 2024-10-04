const setupService = require("./match_setup");
const constants = require("../objects/constants");
const redis = require("../cache/redis");

function hostValidation(res, userId, numRounds, gameMode, socketId) {
  var matchId = setupService.hostMatch(userId, numRounds, gameMode, socketId);
  return res.json({
    type: constants.TYPE_SUCCESS,
    message: constants.SUCCESS_MATCH_HOSTED,
    data: { matchId },
  });
}

function joinValidation(res, userId, matchId, socketId) {
  redis.client.get("MATCH_" + matchId, (err, data) => {
    if (data) {
      var matchData = JSON.parse(data);
      if (matchData.players.player1 === userId) {
        return res.json({
          type: constants.TYPE_ERROR,
          message: constants.ERROR_USERNAME_TAKEN,
          data: null,
        });
      } else if (matchData.status == constants.MATCH_WAITING) {
        matchData = setupService.joinMatch(
          userId,
          matchId,
          matchData,
          socketId
        );
        return res.json({
          type: constants.TYPE_SUCCESS,
          message: constants.SUCCESS_MATCH_JOINED,
          data: matchData,
        });
      } else {
        return res.json({
          type: constants.TYPE_ERROR,
          message: constants.ERROR_MATCH_BEGUN,
          data: null,
        });
      }
    } else {
      return res.json({
        type: constants.TYPE_ERROR,
        message: constants.ERROR_INVALID_MATCH,
        data: null,
      });
    }
  });
}

module.exports = {
  hostValidation,
  joinValidation,
};
