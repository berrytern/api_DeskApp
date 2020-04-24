const express = require('express')
const path = require('path')
const app=express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handlebars = require('express-handlebars')

app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'handlebars')
app.engine('handlebars', handlebars({defaultLayout: 'main'}))

app.use('/',(req,res)=>{
    res.render('index')
})

io.on('connection', socket=>{
    console.log(socket.id)
    socket.on('sendLogin',data=>{
        console.log(data)
    })
})
server.listen(9030)