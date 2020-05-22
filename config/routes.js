const express = require('express')
const Conta = require("../models/Conta")
const Online = require('../models/Online')
const Pedidos = require('../models/Pedidos')
const Friends = require('../models/Friends')
const Bloqued = require('../models/Bloqued')
const Conversa = require('../models/Conversa')
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
    app.use('/validate', auth())
    app.use('/change/username', auth())
    app.use('/change/icon', auth())
    app.use('/change/password', auth())
    app.use('/friends', auth())
    app.use('/friend/new', auth())
    app.use('/friend/delete', auth())
    app.use('/pedidos', auth())
    app.use('/pedido/new', auth())
    app.use('/pedido/delete', auth())
    app.use('/conversas',auth())
    app.use('/message',auth())
    app.use('/conversa/new',auth())
    app.use('/conversa/update',auth())
    app.use('/bloqueados', auth())
    app.use('/bloqueado/new', auth())
    app.use('/bloqueado/delete', auth())
    app.use('/status', auth())
    app.use('/logout',auth())

    app.use('/admin', admin())  

    //app.get('',(req, res)=>{
    //    res.redirect('http://berrytern.github.io/api_DeskApp/')
    //})
    app.use(fileUpload({
        limits: { fileSize: 40024 },
      }));
    app.post('/validate', (req,res)=>{
        console.log('/validate')
        token = req.header('Authorization').split(' ')[1] || null
        if(!!token){
            try{user=jwt.decode(token, authSecret)}
            catch (e){user=null}
            if(!user){res.json({'valid':false,'token':null, 'admin':0, 'icon':null, 'username':null})}
            else{let timetk = user.exp -(Date.now()/1000)
                if(timetk>=1){
                    Conta.findOne({_id: user._id}, (e,doc)=>{
                        if(e==null){
                            Online.findOne({id:doc._id},(e,resp)=>{
                                if(e){res.status(500).send();console.log(e)}
                                else if(!resp){ 
                                    res.status(401).send()
                                }else{
                                    resp.time = (Date.now()/1000)+(60 * 30 * 1)
                                    resp.save()
                                    res.json({'valid':true,'token':return_token(doc).token, 'admin':user.eAdmin, 'icon':doc.icon.toString('base64'), 'username':doc.username,'status':doc.status,'email':doc.email})
                                }
                            })
                            

                        }
                        else{res.json({'valid':false,'token':null})}
                    })
                }else{res.json({'valid':false,'token':null})}
            }
        }else{res.json({'valid':false})}
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

        Conta.findOne({username: username},(err,doc)=>{
            if(!!doc){
                if(bcrypt.compareSync(password, doc.password)){
                    console.log('logado')
                    doc.status = doc.laststatus
                    doc.save()
                    Online.findOne({id:doc.id},(e,resp)=>{
                        if(e){res.status(500).send();console.log(e)}
                        else if(!resp){ 
                            console.log('nao existe')
                            new Online({
                                id: doc.id,
                                time: (Date.now()/1000) + (60 * 30 * 1)
                            }).save()
                        }else{
                            console.log('existe',resp)
                            resp.time = (Date.now()/1000)+(60 * 30 * 1)
                            resp.save()
                        }
                    })
                    res.json(return_token(doc))
                }else res.status(400).send({'message':'senha inválida'})
            }else{res.status(404).send({'exists': false,'response':"user or password incorrect!"})}
        }).catch(()=>{ res.send(500,{'exists': false,'response':'dont work!'})
        })

    })
    app.post('/logout',(req,res)=>{
        console.log('/logout')
        Conta.findOne({_id:req.user._id},(err,doc)=>{
            if(err){res.status(500).send()}
            else{
                doc.status='offline'
                doc.save()
            }
        })
        Online.findOneAndDelete({id:req.user._id},(err,doc)=>{
            console.log(err)
            if(!err){res.status(200).send('loggout')}
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
                            lista.push({'id':user._id,'username':user.username, "icon": user.icon.toString('base64'), "status":user.status})
                            
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
    app.get('/bloqueados',(req,res)=>{
        console.log('/bloqueados')
        Bloqued.findOne({id:req.user._id},(err,doc)=>{
            let list=[]
            let find=async ()=>{
                for(i in doc.who){
                    user = await Conta.findOne({_id:doc.who[i]})
                    list.push({'id':user._id,'username':user.username, "icon": user.icon.toString('base64')})
                }
                res.status(200).send({'list':list})
            }
            if(!!doc){
                find()
            }else{res.status(404).send()}
        })
    })
    app.post('/bloqueado/new',(req,res)=>{
        console.log('/bloqueado/new')
        const {to} = req.body
        let already = false
        if(!!to){
            Conta.findOne({_id:to},(err,resp)=>{
                if(!!resp){
                    Bloqued.findOne({id:req.user._id},(err,doc)=>{
                        if(!!doc){
                            for(i in doc.who){
                                console.log(doc.who[i], to,doc.who[i]==to)
                                if(doc.who[i]==to){already = true}
                            }
                            if(already){
                                res.status(409).send()
                            }else{
                                doc.who = doc.who.concat(to)
                                doc.save()
                                res.status(201).send()
                            }
                        }else{
                            new Bloqued({
                                id: req.user._id,
                                who: req.body.to
                            }).save()
                            res.status(201).send()
                        }
                    })
                }else{res.status(400).send()}
            })
            
        }else{res.status(400).send('sem body')}
    })
    app.delete('/bloqueado/delete',(req,res)=>{
        console.log('/bloqueado/delete')
        const {to} = req.body
        let already = true
        if(!!to){
            Bloqued.findOne({id:req.user._id},(err,doc)=>{
                if(!!doc){
                    for( var i = 0; i < doc.who.length; i++){
                        if(doc.who[i] === to){
                            already=false;
                            console.log(doc.who.splice(i,1))
                            doc.who.splice(i,1);
                            doc.save()
                        }
                    }
                    if(already){res.status(409).send()
                    }else{
                       res.status(200).send()
                    }
                }else{res.status(400).send()}
            })
        }
    })
    app.post('/status',(req,res)=>{
        console.log('/status',req.body.status,req.user._id)
        let statuslist = ['online','offline', 'busy','away']
        let exist = false
        Conta.findOne({_id: req.user._id},(err,doc)=>{
            if(err){res.status(500).json({'error':'server error'})}
            else{
                if(statuslist.indexOf(req.body.status)!=-1){
                    doc.laststatus = req.body.status
                    doc.status = req.body.status
                    doc.save() 
                    res.status(200).json({'done': req.body.status})
                }else{res.status(314).send({'err': 'status inválido'})}
            }
        })
    })
    app.post('/change/username',(req, res)=>{
        console.log('/change/username')
        Conta.findOne({_id:req.user._id},(err,doc)=>{
            if(err){res.status(404).send()}
            else{
                if(bcrypt.compareSync(req.body.password, doc.password)){
                    doc.username = req.body.username
                    doc.save()
                    res.status(201).send()
                }else{res.status(401).send()}
            }
        })
    })
    app.post('/change/icon',(req,res)=>{
        console.log('/change/icon')
        Conta.findOne({_id:req.user._id},(err,doc)=>{
            if(err){res.status(404).send()}
            else{
                if(bcrypt.compareSync(req.body.password, doc.password)){
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
                    doc.icon = usepath  
                    doc.save()
                    res.status(201).send()
                }else{res.status(401).send()}
            }
        })
    })
    app.post('/change/password',(req,res)=>{
        console.log('/change/password')
        Conta.findOne({_id:req.user._id},(err,doc)=>{
            if(err){res.status(404).send()}
            else{
                if(bcrypt.compareSync(req.body.password, doc.password)){
                    let hashpass= bcrypt.hashSync(req.body.newpassword, bcrypt.genSaltSync(10))
                    doc.password = hashpass
                    doc.save()
                    res.status(201).send()
                }else{res.status(401).send()}
            }
        })
    })
    app.get('/conversa/:id/:partir/:fim',(req,res)=>{
        console.log('get /conversa/:id',req.params.id)
        let geticon= async (doc)=>{
            let listid = []
            let listuser = []
            let listicon = []
            let id = req.params.id
            let partir = req.params.partir
            let fim = req.params.fim
            let resp
            if(id=='n'){id=undefined}
            if(partir=='n'){partir=undefined}
            if(fim=='n'){fim=undefined}
            console.log(req.body,req.params)
            if(typeof id!=='undefined'){
                if(typeof partir==='undefined' && typeof fim==='undefined'){
                    resp = doc.message.slice(-30)
                }else if(typeof partir!=='undefined'&& typeof fim==='undefined'){
                    resp = doc.message.slice(partir)
                }else if(typeof partir!=='undefined'&& typeof fim!=='undefined'){
                    resp = doc.message.slice(partir,fim)
                }
                if(resp.length>0){
                    for(let msg in resp){
                        if(listid.length>0){
                            let already = false
                            listid.find((id)=>{if(id==resp[msg].id){already=true;return true}})
                            if(already==false){
                                let user
                                user = await Conta.findOne({_id:resp[msg].id})
                                listid.push(resp[msg].id)
                                listuser.push(user.username)
                                listicon.push(user.icon.toString('base64'))
                            }
                        
                        }else{
                            user = await Conta.findOne({_id:resp[msg].id})
                            listid.push(resp[msg].id)
                            listuser.push(user.username)
                            listicon.push(user.icon.toString('base64'))
                        }
                    }
                    res.send([resp,[listid,listuser,listicon]])
                }else{res.status(204).send()}
            }else{res.status(400).send()}
        }
        Conversa.findOne({_id:req.params.id},(err,doc)=>{
            geticon(doc)
        })
    })
    app.post('/message/:id',(req,res)=>{
        console.log('post /conversa/:id')
        console.log(req.body.message, req.body.type)
        Conversa.findOne({_id:req.params.id},(err,doc)=>{
            if(doc.between.indexOf(req.user._id)!=-1){
                doc.message = doc.message.concat({'id':req.user._id,'type':req.body.type,'message':req.body.message,'time':Date.now(),'num':doc.message.length})
                doc.save()
                res.status(201).json({'id':req.user._id,'type':req.body.type,'message':req.body.message,'time':Date.now(),'num':doc.message.length})
            }else{res.status(401).send()}
        })
    })
    app.get('/conversas',(req, res)=>{
        console.log('/conversas')
        let listcon =[]
        let list
        let find=async(conversa)=>{
            let lista = await conversa.between.map(async(id)=>{
                if(id!=req.user._id){
                    if(!conversa.group){
                        user = await Conta.findOne({_id:id})
                        return {'_id':conversa._id,"username":user.username,"icon": user.icon.toString('base64'),'status':user.status,'group':conversa.group}//{"username":user.username,"icon":user.icon.toString('base64')}
                    }else{
                        user = await Conta.findOne({_id:id})
                        return user.username
                    }
                }
            }   )
            return Promise.all(lista).then((result)=>{return result.filter((isso)=>isso)})
            /*
            for(id in doc[conversa].between){
                if(doc[conversa].between[id]!=req.user._id){
                    if(!doc[conversa].group){
                    user = await Conta.findOne({_id:doc[conversa].between[id]})
                    list.push({"username":user.username,"icon":user.icon.toString('base64')})
                    }else{
                        user = await Conta.findOne({_id:doc[conversa].between[id]})
                        list.push({"username":user.username})
                    }
                }
                
            }*/
            
        }
        let sendcon=async(doc)=>{
            const isso =doc.map(async(conversa)=>{
                if(!conversa.group){
                    return await find(conversa).then(li=>{
                        return li[0]
                        
                    })
                }else{
                    return await find(conversa).then(li=>{
                        return {'_id':conversa._id,"username":li.filter((isso)=>isso),'group':conversa.group}
                    })
                }
            })
            return Promise.all(isso).then((m)=>{res.status(200).send({"list":m});console.log('sended')})
            
            
        }
        Conversa.find({between:req.user._id},(err,doc)=>{
            if(err){
            }else if(doc.length==0){res.status(404).send()
            }else{
                sendcon(doc)
            }
        })
        
    })
    app.post('/conversa/new',(req, res)=>{
        console.log('/conversa/new')
        let exist = true
        let missing = false
        let find = async(res,all)=>{
            for(id in req.body.to){
                result = await Conta.findOne({_id:req.body.to[id]},(e,resp)=>{
                })
                if(!result){console.log('tofalse');exist = false;break}
            }
            if(exist){
                console.log('create')
                new Conversa({
                    between: all,
                    group: true
                }).save()
                res.status(201).send()
            }else{res.status(404).send()}
        }
        try{req.body.group;req.body.to;console.log(req.body.group,req.body.to)}
        catch(e){missing = true}
        if(!missing){
            if(req.body.to.indexOf(req.user._id)==-1){
                let all = [...req.body.to]
                console.log(req.body.to,all)
                all.push(req.user._id)
                if(req.body.group){
                    Conversa.findOne({group:true,between:all},(err,doc)=>{
                        console.log(err, doc)
                        if(!!doc){
                            res.status(409).send()
                        }
                        else{
                            find(res,all)
                        }
                    })
                }else{
                    if(all.length==2){
                        console.log("group = false, length = 2",all,req.body.to)
                        Conversa.findOne({$and:([{group:false},{$or:([{between: all},{between:Array.from(all).reverse()}])}])},(err,doc)=>{
                            if(!!doc){
                                let find=async(status)=>{
                                    user =  await Conta.findOne({_id:req.body.to})
                                    res.status(status).json({'obj':{'_id':doc._id,'between':doc.between,'username':user.username,'icon':user.icon.toString('base64'),'status':user.status}})
                                }
                                find(409)
                            }
                            else{
                                Conta.findOne({_id:req.body.to},(e,resp)=>{
                                    if(!resp){
                                        res.status(404).send()
                                    }
                                    else{
                                        new Conversa({
                                            between: all,
                                            group: false
                                        }).save()
                                        let find=async(status)=>{
                                            user =  await Conta.findOne({_id:req.body.to})
                                            con = await Conversa.findOne({group:false,between:all})
                                            res.status(201).json({'obj':{'_id':con._id,'between':all,'username':user.username,'icon':user.icon.toString('base64'),'status':user.status}})
                                        }
                                        find()
                                        
                                    }
                                })
                            }
                        })
                    }else{res.status(400).json({'error': "need 2 peoples to create a conversation"})}
                }
            }
        }else{
            res.status(400).json({'error': "missing args"})
        }
    })
    app.put('/conversa/update',(req, res)=>{
        console.log('/conversa/update')
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