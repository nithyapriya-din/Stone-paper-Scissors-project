import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";

export default class JoinForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      joinCode: this.props.matchId,
      isHost: this.props.isHost,
      errorText: "",
    };
  }

  static getDerivedStateFromProps(props, current_state) {
    return {
      ...current_state,
      errorText: props.errorText,
      isHost: props.isHost,
    };
  }

  handleChange = (e) => {
    let key = e.target.name;
    let val = e.target.value;
    if (key === "userName") {
      val = val.replace(/[^a-zA-Z0-9 #@!_]/g, "_");
    }
    this.setState({
      [key]: val,
    });
  };

  render() {
    if (!this.state.isHost) {
      return (
        <div>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item lg={6}>
                <TextField
                  {...addError(this.state.errorText, 0)}
                  fullWidth
                  autoFocus
                  value={this.state.userName}
                  onChange={this.handleChange}
                  id="joinIdInput"
                  name="userName"
                  label="Username"
                  inputProps={{ maxLength: 25 }}
                  variant="outlined"
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  {...addError(this.state.errorText, 1)}
                  fullWidth
                  value={this.state.joinCode}
                  onChange={this.handleChange}
                  id="joinCodeInput"
                  name="joinCode"
                  label="Match Id"
                  inputProps={{ maxLength: 6 }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.props.submit(this.state)}
                >
                  Join Game
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Alert severity="info">Waiting for another player to join</Alert>
          <br />
          <Typography variant="h5" component={"span"}>
            Match Id: &nbsp;
          </Typography>
          <Typography variant="h5" component={"span"} className="colorPrimary">
            <strong>{this.state.joinCode}</strong>
          </Typography>
        </div>
      );
    }
  }
}

function addError(errorText, index) {
  if (errorText === "This user already exists !" && index === 0) {
    return { error: true, helperText: errorText };
  } else if (errorText === "This user already exists !" && index === 1) {
    return null;
  } else if (errorText === "" || index === 0) {
    return null;
  } else {
    return { error: true, helperText: errorText };
  }
}
