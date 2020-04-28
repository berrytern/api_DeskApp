const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

function return_token(user){
    
    const now = Math.floor(Date.now() / 1000)
    
    const payload = {
        _id: user.id,
        name: user.username,
        email: user.email,
        eAdmin: user.eAdmin,
        iat: now,
        exp: now + (60 * 30 * 1)
    }
    
    return{...payload,token: jwt.encode(payload, authSecret)
    }
    }
function auth(req,res,next){
    return (req,res,next)=>{
        console.log('on auth')
        header_token=req.header('Authorization') || null
        if(!header_token) {res.redirect('http://berrytern.github.io/api_DeskApp/html/login.html')}
        else{
        token = req.header('Authorization').split(' ')[1] || null
        if(!token){console.log('sem token');res.redirect('/login')}
        else{
            req.user=jwt.decode(token, authSecret)
            console.log('passed')
            next()}
        }
    }
}
module.exports = {return_token,auth}