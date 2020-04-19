const express = require('express')
var app =express()
const consign = require('consign')
const path =require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
//const Conta = require('./models/Post')
const routes= require('./config/routes.js')
const mongoose = require('mongoose')
const _dirname = "C:\\Users\\berrytern\\Documents\\api_DeskApp\\"

//Configurações
    // Body Parser
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // path
        app.use(express.static(path.join(_dirname,"src")))
    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/api_to_all", { useNewUrlParser: true ,useUnifiedTopology: true}).then(()=>{
        console.log("Mongoose connected...")
    }).catch((err)=>{
        console.log(`cant connect to Mongoose, Error: ${err}`)
    })
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
    .include('./config/passport.js')
    .then('./config/routes.js')
    .into(app)



//localhost:8082
const Port = 8082
app.listen(Port, ()=>{
    console.log(`Servidor rodando na url http://localhost:${Port}`)
})
