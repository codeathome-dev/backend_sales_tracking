const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

// router
const authRuter = require("./routers/auth");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/v1", (req, res) =>
  res.send({ message: "Welcome to api point of sales!" })
);

app.use("/api/v1/auth", authRuter);

app.use("*", (req, res) => res.send("Url not found!"));

const port = 8000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
