let Conta = require('../models/Conta')
let Online = require('../models/Online')
function setoff(){
    let exp = Date.now()/1000
    Online.find({time:{$lt: exp}},(err,doc)=>{
        if(err){console.log(err)
        }else{
            for(conta in doc){
                Conta.findOne({_id:doc[conta].id},(e,resp)=>{
                    if(!!e){console.log('conta err: ',e)}
                    else{
                        console.log('conta ok: ',e, resp._id)
                        resp.status = 'offline'
                        resp.save()
                        Online.findOneAndDelete({id:resp._id},(er,result)=>{
                            console.log(er, result)
                        })
                    }
                })
            }
        }
    })
}
module.exports = {setoff}