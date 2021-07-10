const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class AuthController {
  static isAuthenticated(token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      return { id: decoded.id };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = AuthController;
