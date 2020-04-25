const express = require('express')
const Conta = require("../models/Conta")
const Pedidos = require('../models/Pedidos')
const Friends = require('../models/Friends')
const {admin} = require('./admin')
const {return_token} = require("./auth")
const {auth} = require("./auth")
const fileUpload = require('express-fileupload')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const { authSecret } = require('../.env')

module.exports = app=>{
    app.use('/menu', auth())   
    app.use('/icon', auth()) 
    app.use('/admin', auth())
    app.use('/friends', auth())
    app.use('/friends/new', auth())
    app.use('/pedidos', auth())
    app.use('/pedido/new', auth())

    app.use('/admin', admin())  

    app.use(fileUpload({
        limits: { fileSize: 20024 },
      }));
    app.post('/validate', (req,res)=>{
        console.log('/validate')
        token = req.body.token || null
        try{
            if(!!token){
                user=jwt.decode(token, authSecret)
                let timetk = user.exp -(Date.now()/1000)
                if(timetk>=1){
                    Conta.findOne({username: user.name}).then((e)=>{
                        console.log(JSON.stringify(e))
                        if(JSON.stringify(e)!='null'){
                            res.json({'valid':true,'token':return_token(e).token})
                            
                        }
                        else{res.json({'valid':false,'token':null})}
                    })
                }else{res.json({'valid':false,'token':null})}
            }else{res.json({'valid':false,'token':null})}
        }catch{res.json({'valid':false,'token':null})}
    })
    app.get("/cadastro", (req, res)=>{
        res.sendFile(__dirname.replace("config", '')+'src/html/cadastro.html')
    })
    app.post('/cadastro',async (req, res)=>{
        console.log("/cadastro")
        const { username, password } = req.body
        if (!username || !password) return res.status(406).send({Error: "missing information!"});
        console.log("username: " +req.body.username+" password: " + req.body.password)
        const salt = bcrypt.genSaltSync(10)
        let hashpass= bcrypt.hashSync(password, salt)
        Conta.findOne({username: username}).then((e)=>{
            if(JSON.stringify(e)!='null'){res.status(403).send({'message':'alreary exists'})}
            else{
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).send('No files were uploaded.');
                return;
            }
            else if(req.files.file.truncated){
                res.status(413).send({'err':'file is over the size limit'})
            }
            else{
                var usepath="./upload/icons/"+bcrypt.hashSync(req.files.file.name, bcrypt.genSaltSync(5)).replace(/\//g,'').replace(/\\/g,'') +'.'+req.files.file.name.split('.')[1]
                req.files.file.mv(usepath, (err)=>{
                    if(!err){
                    }else{console.log(err);res.status(500).send({err})}})
            }
            new Conta({
                eAdmin: 1,
                username: req.body.username,
                password: hashpass,
                icon: usepath,
                email: null
            }).save().then(()=>{
                console.log("sucesso!")
                try{res.redirect('/login').status(200).send({'status':200,'response':'Registro realizado!'})}
                catch{}
            }).catch((error)=>{
                console.log(error)
                res.status(500).send("{'message':'Não foi possível realizar a operação: "+ error+"'")
            })}
        }).catch(()=>{ res.send(500,{'exists': false,'response':'dont work!'})
        })
    })
    app.get("/login", (req, res)=>{
        res.sendFile(__dirname.replace("config", '')+'src/html/login.html')
    });
    app.post('/login',(req, res)=>{
        console.log("/login --POST")
        const { username, password } = req.body
        if (!username || !password) return res.status(406).send({Error: "missing information!"});
        console.log("username: "+req.body.username+" password: " +req.body.password)

        Conta.findOne({username: username}).then((e)=>{
            if(JSON.stringify(e)!='null'){
                if(bcrypt.compareSync(password, e.password)){
                    console.log('logado')
                    res.json(return_token(e))
                }else res.status(400).send({'message':'senha inválida'})
            }else{
                res.status(404).send({'exists': false,'response':"user or password incorrect!"})
            }
        }).catch(()=>{ res.send(500,{'exists': false,'response':'dont work!'})
        })

    })

    app.get('/menu',(req, res)=>{
        var fs =require('fs')
        fs.readFile('src/html/menu.html',(err,data)=>{
            res.json({'html':String(data),'js':'../js/menu.js'})
        })
        })
    app.get('/icon',(req,res)=>{
        //
        })
    
    app.post('/friends', (req,res)=>{
    
        Friends.findOne({id:req.user._id},(err,doc)=>{
            if(!!doc){
                if(doc.who.length>0){
                    res.json({'exist': true, 'list':doc.who})
                }
                else{
                    res.json({'exist': false})
                }
            }else{
                res.json({'exist': false})
            }
            })
        })
    app.post('/friends/new',(req,res)=>{
        let remove=function(from, to){
            Pedidos.findOne({id:to}, (err,ped)=>{
                if(!!ped){
                    for( var i = 0; i < ped.who.length; i++){ 
                        console.log(ped.who[i])
                        if ( ped.who[i] === from) {
                            ped.who.splice(i, 1); 
                            ped.save((erre)=>{console.log(erre)})
                        }}
                }
                Pedidos.findOne({id:from}, (err,ped)=>{
                    if(!!ped){
                        for( var i = 0; i < ped.who.length; i++){ 
                            console.log(ped.who[i])
                            if ( ped.who[i] === to) {
                                ped.who.splice(i, 1); 
                                ped.save((erre)=>{console.log(erre)})
                            }}
                    }})
        })}
        let add= (from, to)=>{
            Friends.findOne({id:to},(err,doc)=>{
                if(!!doc){
                    var already = false
                    console.log('doc.who: ',doc.who)
                    for(id in doc.who){
                        console.log('id: ',id,', value: ',doc.who[id])
                        if(doc.who[id] ==from){
                            console.log('id:',doc.who[id],'==',from)
                            already= true
                        }
                    }
                    if(already){
                    }
                    else{
                        doc.who= doc.who.concat(from)
                        doc.save((erre)=>{console.log(erre)})
                    }
                }else{console.log('err: ',err)
                new Friends({
                    id: to,
                    who: from
                }).save().then(()=>{res.send({'done':true,'already':false})}).catch((err)=>{
                    res.send(err.message)
                })}}
            

            
            )}
            add(req.user._id, req.body.to)
            add(req.body.to, req.user._id)
            remove(req.user._id,req.body.to)
            res.send('done')

        })
    app.post('/pedidos', (req,res)=>{
        
        Pedidos.findOne({id:req.user._id},(err,doc)=>{
            if(!!doc){
                if(doc.who.length>0){
                    res.json({'exist': true, 'list':doc.who})
                }
                else{
                    res.json({'exist': false})
                }
            }else{
                res.json({'exist': false})
            }
            })
        })
    app.post('/pedido/new',(req,res)=>{

        Pedidos.findOne({id:req.body.to},(err,doc)=>{
            
            if(!!doc){
                var already = false
                console.log('doc.who: ',doc.who)
                for(id in doc.who){
                    console.log('id: ',id,', value: ',doc.who[id])
                    if(doc.who[id] ==req.user._id){

                        console.log('id:',doc.who[id],'==',req.user._id)
                        already= true
                    }
                }
                if(already){res.json({'done':false,'already':true})}
                else{
                doc.who= doc.who.concat(req.user._id)
                doc.save((erre)=>{console.log(erre)})
                res.send({'done':true,'already':false})}
            }else{console.log('err: ',err)
            new Pedidos({
                id: req.body.to,
                who: req.user._id
            }).save().then(()=>{res.send({'done':true,'already':false})}).catch((err)=>{
                res.send(err.message)
            })}
        
        })

        })
    app.get('/conversa',admin((req, res)=>{
        var fs  = require('fs')

        function base64_encode(file) {
        // read binary data
            var bitmap = fs.readFileSync(file);
            // convert binary data to base64 encoded string
            return new Buffer(bitmap).toString('base64');
            }

        //var data =""
        //for(let i=0;i<10;i++){
            
            //if(!data) data+="{'data':'"+`${btoa(r)}'`
            //else data+=",'data':'"+"image/exemplo.png'"
        //}
        //data+="}"
        let last = base64_encode('./src/image/fechar.png')
        let exemplo = base64_encode('./src/image/exemplo.png')
        res.json({'last': last, 'exemplo': exemplo})}))
    app.get('/admin', (req,res)=>{
        var fs =require('fs')
        fs.readFile('src/html/admin.html',(err,data)=>{
            res.json({'html':String(data),'js':'../js/admin.js'})
        })
        })
    app.post('/admin/users',async (req,res)=>{
        await Conta.find({}, (err, user)=>{
            if(err){console.log(err)}
            else{
                var userMap = {};

                user.forEach(function(users) {
                    userMap[users.username] = users;
                });
                console.log(userMap)
                
                res.json(userMap)
            }
        })
    })
    app.post('/admin/conversas',async (req,res)=>{res.send('not implemented')})
   
}