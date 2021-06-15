const joi = require("joi");
const { createUser, getUser, loginUser } = require("../controllers");
const models = require("../../database/models");
const router = require("express").Router();

// passport strategy
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.get("/", (req, res, next) => {
  res.json({ message: "welcome to the user route" });
});

router.post("/me", getUser);

router.post("/create", createUser);

passport.use(
  new LocalStrategy(function (username, password, done) {
    models.users.findOne({ where: { username } }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Unknown user " + username });
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (!result) {
          return done(null, false, { message: "Incorrect password." });
        } else {
          return done(null, user);
        }
      });
    });
  })
);

router.post("/login", loginUser);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  models.users.findOne({ where: { id } }).then((err, user) => {
    done(err, user);
  });
});

router.get("/login/failed", (req, res) => {
  res.json({ msg: "Username or password invalid ", auth: false });
});

module.exports = router;
