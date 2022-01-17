const dotenv = require('dotenv')

dotenv.config()

const AUTH_SECRET = process.env.SECRET

module.exports = AUTH_SECRET