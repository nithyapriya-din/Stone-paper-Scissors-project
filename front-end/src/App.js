import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useParams,
} from "react-router-dom";
import MainScreen from "./js/screens/mainScreen";
import PlayScreen from "./js/screens/playScreen";
import socketIOClient from "socket.io-client";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      socketId: "",
    };
    this.socket = null;
    this.gameInfo = null;
    this.userInfo = null;
  }

  componentDidMount() {
    this.socket = socketIOClient("/");
    this.registerListeners();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  registerListeners = () => {
    this.socket.on("WELCOME_MSG", (data) => {
      this.setState({
        socketId: data,
      });
    });

    this.socket.on("START_GAME", (data) => {
      this.gameInfo = data;
      this.setState({
        gameStarted: true,
      });
    });
  };

  joinMatch = (userId, matchId, isHost) => {
    let data = {
      userId,
      matchId,
      isHost,
      socketId: this.state.socketId,
    };
    this.userInfo = data;
    this.socket.emit("JOIN_ROOM", data);
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <MainScreen
              joinMatch={this.joinMatch}
              gameStarted={this.state.gameStarted}
              socketId={this.state.socketId}
            />
          </Route>
          <Route path="/play">
            <PlayScreen
              gameStarted={this.state.gameStarted}
              gameInfo={this.gameInfo}
              userInfo={this.userInfo}
              socket={this.socket}
            />
          </Route>
          <Route
            path="/join/:matchId"
            children={
              <Child
                joinMatch={this.joinMatch}
                gameStarted={this.state.gameStarted}
                socketId={this.state.socketId}
              />
            }
          />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    );
  }
}

function Child(props) {
  let { matchId } = useParams();

  return (
    <MainScreen
      matchId={matchId}
      joinMatch={props.joinMatch}
      gameStarted={props.gameStarted}
      socketId={props.socketId}
    />
  );
}
