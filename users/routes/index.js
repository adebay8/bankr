const joi = require("joi");
const { createUser, getUser, loginUser } = require("../controllers");
const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json({ message: "welcome to the user route" });
});

router.post("/me", getUser);

router.post("/create", createUser);

router.post("/login", loginUser);

module.exports = router;
