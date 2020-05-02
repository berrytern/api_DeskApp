const express = require('express')
var cors = require('cors')
var app =express()
const consign = require('consign')
const path =require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
//const Conta = require('./models/Post')
const routes= require('./config/routes.js')
const mongoose = require('mongoose')
const {setoff} = require('./config/setoffline')

var whitelist = ['https://berrytern.github.io', 'file:']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    console.log(req.header('Origin'))
    corsOptions = { origin: true } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
 
//Configurações
    // cors
    app.use(cors(corsOptionsDelegate))
    // Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // path
        app.use(express.static(path.join(__dirname,"public")))
    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/api_to_all", { useNewUrlParser: true ,useUnifiedTopology: true}).then(()=>{
        console.log("Mongoose connected...")
    }).catch((err)=>{
        console.log(`cant connect to Mongoose, Error: ${err}`)
    })
    // Session
    // Middleware
    app.use((req,res,next)=>{
        console.log('verificacao de acesso')
        if(true){
            next()
        }else{
            res.render('access_denied')
        }
    })
        
    // Rotas
consign()
    .then('./config/routes.js')
    .into(app)

//socket.io
setInterval(setoff, 1000)

const server = require('http').createServer(app)
const io = require('socket.io')(server)
io.on('connection', socket=>{
    console.log(socket.id)
    socket.on('sendLogin',data=>{
        console.log(data)
    })
})

server.listen(9030)
//localhost:808
const Port = 8082
app.listen(Port, ()=>{
    console.log(`Servidor rodando na url http://localhost:${Port}`)
})
