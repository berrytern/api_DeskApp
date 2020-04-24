const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pedidos = new Schema ({
    id:{
        type: String,
        required:true,
        unique: true,
        dropDumps: true

    },
    who:{
        type: Array,
        required: true
    },
    when:{
        type: Date,
        default: Date.now()
    }
})
mongoose.model('pedidos', Pedidos);
module.exports= mongoose.model('pedidos', Pedidos)