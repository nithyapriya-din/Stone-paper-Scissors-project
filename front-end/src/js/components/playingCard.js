import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Stone from "../../images/stone.png";
import Paper from "../../images/paper.png";
import Scissor from "../../images/scissor.png";
import Typography from "@material-ui/core/Typography";

function PlayingCard(props) {
  let border = props.active
    ? {
        height: "250px",
        maxWidth: "220px",
        position: "relative",
        backgroundColor: "#3f51b5",
        cursor: "pointer",
        border: "5px solid black",
      }
    : {
        height: "250px",
        maxWidth: "220px",
        position: "relative",
        backgroundColor: "#3f51b5",
        cursor: "pointer",
      };
  return (
    <Card style={border} onClick={props.onClick}>
      <CardContent style={{ position: "absolute", top: "10%" }}>
        <img
          src={getImage(props.type)}
          style={{ maxWidth: "100%" }}
          alt="Stone Paper Scissor Choice"
        />
        <br />
      </CardContent>
      <Typography
        variant="h6"
        style={{
          color: "white",
          position: "absolute",
          bottom: "8px",
          left: "35%",
        }}
      >
        {props.type}
      </Typography>
    </Card>
  );
}

function getImage(img) {
  if (img === "Stone") {
    return Stone;
  } else if (img === "Paper") {
    return Paper;
  } else if (img === "Scissor") {
    return Scissor;
  } else {
    return "";
  }
}

export default PlayingCard;
