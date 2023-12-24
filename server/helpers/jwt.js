const jwt = require('jsonwebtoken')

let JWT_SECRET = process.env.JWT_SECRET

function signToken(payloadUser) {
    let { id } = payloadUser
    return jwt.sign({ id }, JWT_SECRET)
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET)
}


module.exports = { signToken, verifyToken }