const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

// router
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const usersRouter = require("./routers/users");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/api/v1", (req, res) =>
  res.send({ message: "Welcome to api point of sales!" })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/users", usersRouter);

app.use("*", (req, res) => res.send("Url not found!"));

app.listen(process.env.PORT || 4000, () => console.log(`success run`));
