const constants = require('../objects/constants');
const redis = require('../cache/redis');
const cacheAdd = require('../cache/add');
const cacheDelete = require('../cache/delete');

function startGame(io, matchId){
    redis.client.get("MATCH_" + matchId, (err, data) => {
        if(data){
            data = JSON.parse(data);
            let gameInfo = {
                hostName: data.players.player1,
                joineeName: data.players.player2,
                gameMode: data.gameMode
            };
            io.in(matchId).emit("START_GAME", gameInfo);
        }
    });
}

function playRound(io, socketId, card){
    redis.client.get("PLAYER_" + socketId, (err, matchId) => {
        if(matchId){
            redis.client.get("MATCH_" + matchId, (err, data) => {
                if(data){
                    data = JSON.parse(data);
                    let isHost = data.sockets.player1 === socketId;
                    if(isHost && data.moves.player2 === ""){
                        data.moves.player1 = card;
                    } else if(!isHost && data.moves.player1 === ""){
                        data.moves.player2 = card;
                    } else {
                        let winner = "", hostCard = "", joineeCard = "";
                        if(isHost){
                            winner = winnerPlayer(card, data.moves.player2);
                            hostCard = card;
                            joineeCard = data.moves.player2
                        } else {
                            winner = winnerPlayer(data.moves.player1, card);
                            hostCard = data.moves.player1
                            joineeCard = card;
                        }
                        if(winner === "Host"){
                            data.scores.player1 = data.scores.player1 + 1;
                            winner = data.players.player1;
                        } else if(winner === "Joinee"){
                            data.scores.player2 = data.scores.player2 + 1;
                            winner = data.players.player2;
                        }

                        data.currentRound = data.currentRound + 1;
                        data.moves.player1 = "";
                        data.moves.player2 = "";

                        let res = {
                            hostScore: data.scores.player1,
                            hostCard,
                            joineeScore: data.scores.player2,
                            joineeCard,
                            winner,
                            round: data.currentRound
                        }

                        io.in(matchId).emit("ROUND_OVER", res);
                        if(data.currentRound > data.numRounds){
                            declareWinnerByScore(io, matchId, res.hostScore, res.joineeScore);
                            cacheDelete.deletePlayerById(data.sockets.player1);
                            cacheDelete.deletePlayerById(data.sockets.player2);
                            cacheDelete.deleteMatchById(matchId);
                            return;
                        }
                    }
                    cacheAdd.addMatchToCache(matchId, data);
                }
            });
        }
    });
}

function declareWinnerByScore(io, matchId, hostScore, joineeScore) {
    let data = {
        winBy: "Score" 
    }
    console.log("Match Over:", matchId, "|| Score:", hostScore, "vs", joineeScore);
    io.in(matchId).emit("GAME_OVER", data);
}

function declareWinnerByDisconnect(io, socketId){
    redis.client.get("PLAYER_" + socketId, (err, matchId) => {
        if(matchId){
            cacheDelete.deletePlayerById(socketId);
            redis.client.get("MATCH_" + matchId, (err, data) => {
                if(data){
                    data = JSON.parse(data);
                    let res = {
                        winBy: "Abandon" 
                    }
                    let opponent = (data.sockets.player1 === socketId) ? data.sockets.player2 : data.sockets.player1;
                    //! Doesn't emit event
                    io.to(opponent).emit("GAME_OVER", res);
                    cacheDelete.deletePlayerById(opponent);
                    cacheDelete.deleteMatchById(matchId);
                    console.log("Match Over:", matchId, "|| Player abandoned !");
                }
            });
        }
    });
}

function winnerCard(card1, card2){
    if(card1 === card2){
        return "";
    } else if(card1 === constants.CARD_STONE && card2 === constants.CARD_PAPER){
        return constants.CARD_PAPER;
    } else if(card1 === constants.CARD_STONE && card2 === constants.CARD_SCISSOR){
        return constants.CARD_STONE;
    } else if(card1 === constants.CARD_PAPER && card2 === constants.CARD_SCISSOR){
        return constants.CARD_SCISSOR;
    } else if(card1 === constants.CARD_PAPER && card2 === constants.CARD_STONE){
        return constants.CARD_PAPER;
    } else if(card1 === constants.CARD_SCISSOR && card2 === constants.CARD_STONE){
        return constants.CARD_STONE;
    } else if(card1 === constants.CARD_SCISSOR && card2 === constants.CARD_PAPER){
        return constants.CARD_SCISSOR;
    }
}

function winnerPlayer(cardHost, cardJoinee){
    let card = winnerCard(cardHost,cardJoinee);
    if(card === ""){
        return "";
    } else if(card === cardHost){
        return "Host";
    } else {
        return "Joinee";
    }
}



module.exports = {
    startGame,
    playRound,
    declareWinnerByDisconnect
}