
let isso= (port)=>{
    console.log('nem ap')
    let jwt = require('jwt-simple')
    let {authSecret} = require('../.env')

    let io = require('socket.io')(port)
    let Conta = require('../models/Conta')
    let users = []
    io.on('connection',(client)=>{
        function next(){
            console.log('conectado: '+client.id,authSecret)
            client.on('startshare',data=>{client.emit('isso',data);console.log('data',data)})
        }
        let token = client.handshake.query.token;
        try{
           user = jwt.decode(token,authSecret)
           next()
        }catch(err){next()}//client.emit('tologin')}
        
    })
}
module.exports = {isso}