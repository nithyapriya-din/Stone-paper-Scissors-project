const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const props = require("./props");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ws = require("./events/websocket");
const port = props.PORT_SERVER;

app.use(bodyParser.json());

if (props.ENVIRONMENT === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.use(function (req, res, next) {
  next();
});
app.use("/", require("./routes/rest").router);
ws.registerEvents(io);

http.listen(port, () => {
  console.log(
    `StonePaperScissor: Backend up at http://localhost:${port}`
  );
});
