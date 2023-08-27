const { Sequelize } = require('sequelize');

// Passing parameters separately (other dialects)
const sequelize = new Sequelize('mdm-db', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// test connect to DB
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = connectDB;