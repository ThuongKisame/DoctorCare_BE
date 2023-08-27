const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('dbdoctor', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection DB is success.');
    } catch (error) {
        console.error('Unable to connect to the database:');
    }
};

module.exports = connectDB;
