const { Sequelize } = require("sequelize");
require("dotenv").config();

// Passing parameters separately (other dialects)
const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// test connect to DB
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Database connection: OK, database name: " + process.env.DB_DATABASE_NAME
    );
    console.log("============================================================");
  } catch (error) {
    console.error("Database connection: Failed", error);
  }
};

module.exports = connectDB;
