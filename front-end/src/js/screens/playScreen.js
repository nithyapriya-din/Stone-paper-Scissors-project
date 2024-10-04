import React from "react";
import { withRouter } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import PlayingCard from "../components/playingCard";
import WaitingCard from "../components/waitingCard";
import CustomizedSnackbars from "../components/snackbar";
import ResultModal from "../components/result";

class PlayScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      round: 1,
      roundStatus: "MY_TURN",
      myScore: 0,
      opponentScore: 0,
      myName: "",
      opponentName: "",
      gameMode: "Standard",
      currentCard: "",
      socket: this.props.socket,
      gameOver: false,
    };
    this.snackbarOptions = {
      open: false,
      msg: "",
      severity: "",
    };
    this.prevCards = [];
    this.cardMap = {
      0: "Stone",
      1: "Paper",
      2: "Scissor",
      3: "MyTurn",
      4: "OpponentTurn",
    };
    this.opponentCard = "";
    this.socketRegistered = false;
    this.winReason = "Score";
  }

  static getDerivedStateFromProps(props, current_state) {
    if (!props.gameStarted) {
      props.history.push("/");
    }
    if (props.userInfo.isHost) {
      current_state.myName = props.gameInfo.hostName;
      current_state.opponentName = props.gameInfo.joineeName;
    } else {
      current_state.myName = props.gameInfo.joineeName;
      current_state.opponentName = props.gameInfo.hostName;
    }
    current_state.gameMode = props.gameInfo.gameMode;
    current_state.socket = props.socket;
    return current_state;
  }

  componentDidUpdate() {
    if (this.state.socket != null && !this.socketRegistered) {
      this.socketRegistered = true;
      this.registerListeners();
    }
  }

  registerListeners = () => {
    this.state.socket.on("ROUND_OVER", (data) => {
      let myScore = 0,
        opponentScore = 0;
      if (this.props.userInfo.isHost) {
        myScore = data.hostScore;
        opponentScore = data.joineeScore;
        this.opponentCard = data.joineeCard;
      } else {
        myScore = data.joineeScore;
        opponentScore = data.hostScore;
        this.opponentCard = data.hostCard;
      }
      if (data.winner === "") {
        this.snackbarOptions.msg = "It's a Draw !";
        this.snackbarOptions.severity = "warning";
      } else if (data.winner === this.state.myName) {
        this.snackbarOptions.msg = "You win this round !";
        this.snackbarOptions.severity = "success";
      } else {
        this.snackbarOptions.msg = "You lost this round !";
        this.snackbarOptions.severity = "error";
      }
      this.snackbarOptions.open = true;
      this.setState({
        roundStatus: "ROUND_RESULT",
      });
      setTimeout(
        () => this.resetRound(data.round, myScore, opponentScore),
        3000
      );
    });

    this.state.socket.on("GAME_OVER", (data) => {
      console.log(data);
      this.winReason = data.winBy;
      setTimeout(() => {
        this.setState({
          gameOver: true,
        });
      }, 3000);
    });
  };

  resetRound = (round, myScore, opponentScore) => {
    this.prevCards = [];
    this.setState({
      round,
      roundStatus: "MY_TURN",
      myScore,
      opponentScore,
      currentCard: "",
    });
  };

  handleCardClick = (option) => {
    if (this.state.roundStatus !== "MY_TURN" || this.state.gameOver) {
      return;
    }
    this.setState((prev_state) => ({
      currentCard: option,
      roundStatus: "OPPONENT_TURN",
    }));
    let data = {
      card: this.cardMap[this.prevCards[option]],
    };
    this.state.socket.emit("ROUND_PLAY", data);
  };

  generateCards = () => {
    if (this.state.roundStatus === "MY_TURN") {
      for (let i = 0; i < 3; i++) {
        this.prevCards.push(
          this.state.gameMode === "Standard" ? i : Math.floor(Math.random() * 3)
        );
      }
    }
    return (
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item md={4}>
          <PlayingCard
            type={this.cardMap[this.prevCards[0]]}
            onClick={() => this.handleCardClick(0)}
            active={this.state.currentCard === 0}
          />
        </Grid>
        <Grid item md={4}>
          <PlayingCard
            type={this.cardMap[this.prevCards[1]]}
            onClick={() => this.handleCardClick(1)}
            active={this.state.currentCard === 1}
          />
        </Grid>
        <Grid item md={4}>
          <PlayingCard
            type={this.cardMap[this.prevCards[2]]}
            onClick={() => this.handleCardClick(2)}
            active={this.state.currentCard === 2}
          />
        </Grid>
      </Grid>
    );
  };

  generateWaitCard = () => {
    if (this.state.roundStatus === "MY_TURN") {
      return <WaitingCard type={this.cardMap[3]} />;
    } else if (this.state.roundStatus === "OPPONENT_TURN") {
      return <WaitingCard type={this.cardMap[4]} />;
    } else {
      return <WaitingCard type={this.opponentCard} />;
    }
  };

  generateSnackbar = () => {
    if (this.snackbarOptions.open) {
      this.snackbarOptions.open = false;
      return (
        <CustomizedSnackbars
          open={true}
          msg={this.snackbarOptions.msg}
          severity={this.snackbarOptions.severity}
        />
      );
    } else return null;
  };

  generateResultModal = () => {
    if (!this.state.gameOver) {
      return null;
    }
    if(this.winReason === "Abandon"){
      return <ResultModal msg="You Win !" color="green" />;
    } else {

      let data = {
        myName: this.state.myName,
        myScore: this.state.myScore,
        opponentName: this.state.opponentName,
        opponentScore: this.state.opponentScore,
      };
      let msg = "Game Draw !";
      let color = "black";
      if (data.myScore > data.opponentScore) {
        msg = "You Win !";
        color = "green";
      } else if (data.myScore < data.opponentScore) {
        msg = "You Lose !";
        color = "red";
      }
      return <ResultModal msg={msg} data={data} color={color} />;
    }
  };

  generateRoundNumber = () => {
    if (this.state.gameOver) {
      return "Match Over";
    } else {
      return "Round " + this.state.round;
    }
  };

  render() {
    return (
      <div>
        <AppBar
          position="static"
          color="primary"
          style={{ textAlign: "center" }}
        >
          <Toolbar>
            <Grid container alignItems="center">
              <Grid item sm={2}>
                <Typography variant="h5">
                  <strong>{this.state.opponentScore}</strong>
                </Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography variant="h5">
                  <strong>{this.state.opponentName}</strong>
                </Typography>
              </Grid>
              <Grid item sm={2}>
                <Typography variant="h5">
                  <strong>v/s</strong>
                </Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography variant="h5">
                  <strong>{this.state.myName}</strong>
                </Typography>
              </Grid>
              <Grid item sm={2}>
                <Typography variant="h5">
                  <strong>{this.state.myScore}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h6">
              <strong>{this.generateRoundNumber()}</strong>
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="stretch"
          style={{
            minHeight: "100vh",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            textAlign: "center",
            paddingTop: "48px",
          }}
        >
          <Grid item md={5}>
            {this.generateWaitCard()}
            {this.generateSnackbar()}
            {this.generateResultModal()}
          </Grid>
          <Grid item md={6}>
            {this.generateCards()}
          </Grid>
          <Grid item md={1}></Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(PlayScreen);
