import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ResultModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="Result Modal"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography variant="h1" style={{ color: props.color }}>
              {props.msg}
            </Typography>
            <br />
            <Grid
              container
              justify="center"
              alignItems="center"
              spacing={2}
              style={{ textAlign: "center" }}
            >
              <Grid item sm={6}>
                <Typography variant="h3" color="primary">
                  {props.data.opponentName}
                </Typography>
                <Typography variant="h3">{props.data.opponentScore}</Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="h3" color="primary">
                  {props.data.myName}
                </Typography>
                <Typography variant="h3">{props.data.myScore}</Typography>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
