require("dotenv").config();
module.exports = {
  development: {
    dialect: "mysql",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_DATABASE_PORT,
    logging: false,
    query: {
      raw: true,
    },
    timezone: "+07:00",
  },
  test: {
    dialect: "mysql",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_DATABASE_PORT,
  },
  production: {
    dialect: "mysql",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_DATABASE_PORT,
  },
};
