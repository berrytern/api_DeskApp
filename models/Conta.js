const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Conta = new Schema ({
    eAdmin:{
        type: Number,
        default: 0
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    icon:{
        type: Buffer
    },
    email:{
        type: String,
    },
    status:{
        type: String,
        default: 'offline'
    },
    laststatus:{
        type: String,
        default: 'online'
    },
})

module.exports =mongoose.model('contas', Conta)