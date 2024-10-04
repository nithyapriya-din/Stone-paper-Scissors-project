import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import HostForm from "./host";
import JoinForm from "./join";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      style={{ backgroundColor: "whitesmoke" }}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default class FullWidthTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchId: this.props.matchId,
      isHost: this.props.isHost,
      index: this.props.matchId !== "" || this.props.isHost ? 1 : 0,
      hostError: this.props.hostError,
      joinError: this.props.joinError,
    };
  }

  static getDerivedStateFromProps(props, current_state) {
    return {
      matchId: props.matchId,
      isHost: props.isHost,
      index: props.matchId !== "" || props.isHost ? 1 : current_state.index,
      hostError: props.hostError || "",
      joinError: props.joinError || "",
    };
  }

  handleChange = (e, newValue) => {
    this.setState((previousState) => ({
      matchId: previousState.matchId,
      isHost: previousState.isHost,
      index: newValue,
    }));
  };

  render() {
    return (
      <div
        style={{
          border: "2px solid #888888",
          borderRadius: "24px",
          padding: "16px",
          boxShadow: "5px 10px #888888",
        }}
      >
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.index}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Host Game" {...a11yProps(0)} />
            <Tab label="Join Game" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <TabPanel value={this.state.index} index={0}>
          <HostForm
            submit={this.props.submitHost}
            errorText={this.state.hostError}
          />
        </TabPanel>
        <TabPanel value={this.state.index} index={1}>
          <JoinForm
            matchId={this.state.matchId}
            submit={this.props.submitJoin}
            isHost={this.state.isHost}
            errorText={this.state.joinError}
          />
        </TabPanel>
      </div>
    );
  }
}
