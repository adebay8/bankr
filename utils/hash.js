const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

exports.hashArguments = async (...parameters) => {
  const concatenatedRequest = parameters.join("");

  const hashRequest = crypto
    .createHmac("sha512", process.env.HASH_SECRET_KEY)
    .update(concatenatedRequest)
    .digest("hex");

  return hashRequest;
};
