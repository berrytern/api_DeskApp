let Conta = require('../models/Conta')
let Online = require('../models/Online')
function setoff(){
    let exp = Date.now()/1000
    Online.find({time:{$lt: exp}},(err,doc)=>{
        if(!err){
            doc.map((conta)=>{
                Conta.findOne({_id:conta.id},(e,resp)=>{
                    if(!e){
                        resp.status = 'offline'
                        resp.save()
                        Online.findOneAndDelete({id:resp._id})
                    }
                })
            })
        }
    })
}
module.exports = {setoff}