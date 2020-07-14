const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/v1", (req, res) =>
  res.send({ message: "Welcome to api point of sales!" })
);

const port = 8000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
