const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    dialect: "mysql",
    define: {
      timestamps: true,
      underscored: true,
    },
    logQueryParameters: true,
    logging: (str) =>
      process.env.SHOW_SQL_LOGS
        ? console.log(`[SEQUELIZE DATABASE] ${str}`)
        : null,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    host: "us-cdbr-east-04.cleardb.com",
    username: "b5a6108d432cfc",
    password: "fbb20969",
    port: "3306",
    database: "heroku_6f5e1cfd5d51ba8",
    dialect: "mysql",
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};
