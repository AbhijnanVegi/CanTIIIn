const dotenv = require('dotenv')

dotenv.config()

const AUTH_SECRET = process.env.SECRET
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

module.exports = { AUTH_SECRET, EMAIL_USER, EMAIL_PASS }