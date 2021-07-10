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
    uri: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
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
    uri: process.env.CLEARDB_DATABASE_URL,
    dialect: "mysql",
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};
