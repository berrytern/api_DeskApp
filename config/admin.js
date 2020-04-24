function admin(req,res,next){
    return (req,res,next)=>{
        
        user= req.user  || null
        console.log(req.user._id, !user, !!user)
        if(!user){console.log("admin: false");res.status(401).send('Usuário não é administrador.')}
        if(req.user.eAdmin) {console.log("admin: true")
            next()
        } else {
            res.status(401).send('Usuário não é administrador.')
        }
    }
}

module.exports = {admin}