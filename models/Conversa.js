const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Conversa = new Schema ({
    between:{
        type: Array,
        required: true
    },
    message:{
        type: Array,
        default: []
    },
    group:{
        type: Boolean
    }
})

module.exports= mongoose.model('conversas', Conversa)