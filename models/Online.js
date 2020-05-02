const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Online = new Schema ({
    id:{
        type: String,
        required:true,
        unique: true,
        dropDumps: true

    },
    time:{
        type: Number,
        required: true
    }
})
module.exports= mongoose.model('online', Online)