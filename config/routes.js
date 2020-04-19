const express = require('express')
const Conta = require("../models/Conta")
const admin = require('./admin')
const return_token = require("./auth")
const bcrypt = require('bcrypt-nodejs')

module.exports = app=>{
    app.get("/cadastro", (req, res)=>{
        res.render("cadastro",{header_s:'../css/access_header.css',body_s:'../css/access_body.css'})
    })
    app.post('/cadastro', admin(async (req, res)=>{
        console.log("/cadastro")
        const { username, password } = req.body
        if (!username || !password) return res.status(406).send({Error: "missing information!"});
        console.log("username: " +req.body.username+" password: " + req.body.password)
        const salt = bcrypt.genSaltSync(10)
        let hashpass= bcrypt.hashSync(password, salt)
        new Conta({
            eAdmin: 0,
            username: req.body.username,
            password: hashpass,
            nickname: null,
            email: null
        }).save().then(()=>{
            console.log("sucesso!")
            try{res.redirect('/login').status(200).send({'status':200,'response':'Registro realizado!'})}
            catch{}
        }).catch((error)=>{
            res.status(500).send("{'message':'Não foi possível realizar a operação: "+ error+"'")
        })
    }))
    app.get("/login", (req, res)=>{
        res.render("login",{header_s:'../css/access_header.css',body_s:'../css/access_body.css'})
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
        }).catch(()=>{ res.send(410,{'exists': false,'response':'dont work!'})
        })

    })


    //app.use('/icon', app.config.passport.authenticate())
    app.get('/icon',app.config.passport.authenticate())
        .get( (req,res)=>{
            console.log('icon')
        })
    app.use('/',app.config.passport.authenticate())
        .get((req, res)=>{
            return res.render('principal',{header_s:'../css/access_header.css', body_s:'../css/principal_body.css'})
        })

    app.use('/conversa',app.config.passport.authenticate())
        .get((req, res)=>{
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
            res.json({'last': last, 'exemplo': exemplo})//{"images": JSON.parse(data)})
        })}