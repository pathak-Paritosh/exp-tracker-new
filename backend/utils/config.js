require('dotenv').config();

const config = {
    PORT: process.env.SERVER_PORT,
    DB_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

module.exports = config;