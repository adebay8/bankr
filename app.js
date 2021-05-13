const dotenv = require("dotenv");
const axios = require("axios");
const express = require("express");
dotenv.config();

// import routes
const userRoute = require("./users/routes");
const transactionRoute = require("./transactions/routes");

const server = express();

// middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get("/", (req, res, next) => {
  res.json({ success: true, message: "Welcome to the bankr api" });
});

server.post("/paystack_webhook", (req, res, next) => {
  console.log(req.body);
});

server.use("/user", userRoute);
server.use("/transaction", transactionRoute);

server.listen("5000", () => {
  console.log("server is listening on port 5000");
});
