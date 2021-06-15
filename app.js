const dotenv = require("dotenv");
const axios = require("axios");
const express = require("express");
const passport = require("passport");
const cors = require("cors");
dotenv.config();

// import routes
const userRoute = require("./users/routes");
const transactionRoute = require("./transactions/routes");

const server = express();
const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || "development";
const origin =
  environment === "development"
    ? "http://localhost:3000"
    : "https://bankr.netlify.app";

// middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(
  cors({
    origin,
    optionsSuccessStatus: 200,
  })
);

// passport middleware
server.use(passport.initialize());
server.use(passport.session());

server.get("/", (req, res, next) => {
  res.json({ success: true, message: "Welcome to the bankr api v2" });
});

server.post("/paystack_webhook", (req, res, next) => {
  console.log(req.body);
});

server.use("/user", userRoute);
server.use("/transaction", transactionRoute);

server.listen(port, () => {
  console.log("server is listening on port 5000");
});
