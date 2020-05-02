const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Bloqued = new Schema ({
    id:{
        type: String,
        required:true,
        unique: true,
        dropDumps: true

    },
    who:{
        type: Array,
        required: true
    }
})
module.exports= mongoose.model('bloqueados', Bloqued)