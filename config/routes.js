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

let remove_pedidos=function(from, to){
    Pedidos.findOne({id:to}, (err,ped)=>{
        if(!!ped){
            for( var i = 0; i < ped.who.length; i++){ 
                if ( ped.who[i] === from) {
                    ped.who.splice(i, 1); 
                    ped.save((erre)=>{console.log(erre)})
                }}
        }
        Pedidos.findOne({id:from}, (err,ped)=>{
            if(!!ped){
                for( var i = 0; i < ped.who.length; i++){ 
                    if ( ped.who[i] === to) {
                        ped.who.splice(i, 1); 
                        ped.save((erre)=>{console.log(erre)})
                    }}
            }})
})}
let remove_friends=function(from, to){
    Friends.findOne({id:to}, (err,ped)=>{
        if(!!ped){
            for( var i = 0; i < ped.who.length; i++){ 
                if ( ped.who[i] === from) {
                    ped.who.splice(i, 1); 
                    ped.save((erre)=>{console.log(erre)})
                }}
        }
        Friends.findOne({id:from}, (err,ped)=>{
            if(!!ped){
                for( var i = 0; i < ped.who.length; i++){ 
                    if ( ped.who[i] === to) {
                        ped.who.splice(i, 1); 
                        ped.save((erre)=>{console.log(erre)})
                    }}
            }})
})}
module.exports = app=>{
    app.use('/menu', auth())   
    app.use('/icon', auth()) 
    app.use('/admin', auth())
    app.use('/friends', auth())
    app.use('/friend/new', auth())
    app.use('/friend/delete', auth())
    app.use('/pedidos', auth())
    app.use('/pedido/new', auth())
    app.use('/pedido/delete', auth())

    app.use('/admin', admin())  

    //app.get('',(req, res)=>{
    //    res.redirect('http://berrytern.github.io/api_DeskApp/')
    //})
    app.use(fileUpload({
        limits: { fileSize: 20024 },
      }));
    app.post('/validate', (req,res)=>{
        console.log('/validate')
        token = req.body.token || null
        if(!!token){
            try{user=jwt.decode(token, authSecret)}
            catch (e){user=null}
            if(!user){res.json({'valid':false,'token':null, 'admin':0})}
            else{let timetk = user.exp -(Date.now()/1000)
                if(timetk>=1){
                    Conta.findOne({username: user.name}).then((e)=>{
                        if(JSON.stringify(e)!='null'){
                            res.json({'valid':true,'token':return_token(e).token, 'admin':user.eAdmin})
                            
                        }
                        else{res.json({'valid':false,'token':null, 'admin':0})}
                    })
                }else{res.json({'valid':false,'token':null, 'admin':0})}
            }
        }else{res.json({'valid':false,'token':null, 'admin':0})}
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
                var usepath=req.files.file.data
            }
            new Conta({
                eAdmin: 1,
                username: req.body.username,
                password: hashpass,
                icon: usepath,
                email: null
            }).save().then(()=>{
                console.log("sucesso!")
                try{res.status(200).send({'status':200,'response':'Registro realizado!'})}
                catch{}
            }).catch((error)=>{
                console.log(error)
                res.status(500).send("{'message':'Não foi possível realizar a operação: "+ error+"'")
            })}
        }).catch(()=>{ res.send(500,{'exists': false,'response':'dont work!'})
        })
    })
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
    app.post('/friends', (req,res)=>{
        console.log('/friends')
        Friends.findOne({id:req.user._id},(err,doc)=>{
            if(!!doc){
                if(doc.who.length>0){
                    let list = []
                    let lista =[]
                    let user
                    let header
                    let find=async ()=>{
                        let fs = require('fs')
                        for(friend in doc.who){
                            user = await Conta.findOne({_id:doc.who[friend]},(err,info)=>{})
                            lista.push({'id':user._id,'username':user.username, "icon": user.icon.toString('base64')})
                            
                        }
                        return lista
                    }   
                    find().then(lista =>{res.json({'exist': true, 'list':lista})})
                }
                else{
                    res.json({'exist': false})
                }
            }else{
                res.json({'exist': false})
            }
            })
        })
    app.post('/friend/new',(req,res)=>{
        console.log('/friend/new')
        let add= (from, to)=>{
            Friends.findOne({id:to},(err,doc)=>{
                if(!!doc){
                    var already = false
                    for(id in doc.who){
                        if(doc.who[id] ==from){
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
            remove_pedidos(req.user._id,req.body.to)
            res.send('done')

        })
    app.post('/friend/delete', (req,res)=>{
        console.log('/friend/delete')
        remove_friends(req.user._id, req.body.to)
        res.status(200).send()
    })
    app.post('/pedidos', (req,res)=>{
        Pedidos.findOne({id:req.user._id},(err,doc)=>{
            if(!!doc){
                if(doc.who.length>0){
                    let list = []
                    let lista =[]
                    let user
                    let header
                    let find=async ()=>{
                        let fs = require('fs')
                        for(friend in doc.who){
                            user = await Conta.findOne({_id:doc.who[friend]},(err,info)=>{})
                            lista.push({'id':user._id,'username':user.username, "icon": user.icon.toString('base64')})
                            
                        }
                        return lista
                    }   
                    find().then(lista =>{res.json({'exist': true, 'list':lista})})
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
        console.log('pedido/new')
        if(req.body.to==req.user.name){res.status(312).send({'exist':false})}
        else{
        Conta.findOne({username:req.body.to},(err,exist)=>{
            if(err){res.status(500).send({'exist':false})}
            else if(!exist){res.status(404).send({'exist':false})}
            else{
                Pedidos.findOne({id:exist._id},(err,doc)=>{
                
                if(!!doc){
                    var already = false
                    for(id in doc.who){
                        if(doc.who[id] ==req.user._id){

                            already= true
                        }
                    }
                    if(already){res.status(314).send({'done':false,'already':true})}
                    else{
                    doc.who= doc.who.concat(req.user._id)
                    doc.save((erre)=>{console.log(erre)})
                    res.send({'done':true,'already':false})}
                }else{console.log('err: ',err)
                new Pedidos({
                    id: exist.id,
                    who: req.user._id
                }).save().then(()=>{res.status(200).send({'done':true,'already':false})}).catch((err)=>{
                    res.send(err.message)
                })}
            
            })
            }
        })}
    })
    app.post('/pedido/delete',(req,res)=>{
        console.log('/pedido/delete')
        remove_pedidos(req.user._id,req.body.to)
        res.status(200).send()
    })
    app.get('/conversa',(req, res)=>{
        console.log('/conversa')
        res.json({'conversas':'nada'})})
    app.post('/admin/users',async (req,res)=>{
        await Conta.find({}, (err, user)=>{
            if(err){console.log(err)}
            else{
                var userMap = {};

                user.forEach(function(users) {
                    userMap[users.username] = users;
                });
                
                res.json(userMap)
            }
        })
    })
    app.post('/admin/conversas',async (req,res)=>{res.send('not implemented')})
   
}