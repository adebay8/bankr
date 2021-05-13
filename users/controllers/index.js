const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const models = require("../../database/models");
dotenv.config();

// create user helper function

/**
 * @param {string} username username of the user
 * @param {string} password password of the user
 */
async function createUser(req, res, next) {
  const { username, password } = req.body;

  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
  });
  const validation = schema.validate({
    username,
    password,
  });

  if (validation.error) {
    res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  const t = await models.sequelize.transaction();

  try {
    const existingUser = await models.users.findOne(
      { where: { username } },
      { transaction: t }
    );

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "Account already exists",
      });
    }

    const user = await models.users.create(
      {
        username,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      },
      { transaction: t }
    );

    await models.accounts.create(
      {
        user_id: user.id,
        balance: 5000000,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(200).json({
      success: true,
      message: "User account created",
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function getUser(req, res, next) {
  const { token } = req.body;
  const schema = joi.object({
    token: joi.string().required(),
  });
  const validation = schema.validate({
    token,
  });

  if (validation.error) {
    res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: "invalid token" });
    res.status(200).json({ success: true, user });
  });
}

async function loginUser(req, res, next) {
  const { username, password } = req.body;

  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
  });
  const validation = schema.validate({
    username,
    password,
  });

  if (validation.error) {
    res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  const t = await models.sequelize.transaction();

  try {
    const user = await models.users.findOne(
      { where: { username } },
      { transaction: t }
    );

    const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

    await t.commit();

    res.status(200).json({
      success: true,
      token,
      user,
      message: "user logged in successfully",
    });
  } catch (error) {
    await t.rollback();

    res.status(400).json({
      success: false,
      error: "Internal server error",
    });
  }
}

module.exports = { createUser, getUser, loginUser };
