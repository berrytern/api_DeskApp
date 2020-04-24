const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Conversa = new Scheama ({
    id:{
        type: Number,
        required:true
    },
    between:{
        type: Array,
        required: true
    },
    message:{
        type: Object
    }
})

module.exports= mongoose.model('conversas', Conversa)