const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports =(user)=>{
console.log('e : ',user.username)

const now = Math.floor(Date.now() / 1000)

const payload = {
    _id: user.id,
    name: user.username,
    email: user.email,
    eAdmin: user.eAdmin,
    iat: now,
    exp: now + (60 * 60 * 24 * 3)
}
console.log(payload)

return{...payload,token: jwt.encode(payload, authSecret)
}
}
