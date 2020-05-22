let user = Object
user.token=localStorage.getItem('token') || null
user.admin = 0
function reauth(){
    validate= new XMLHttpRequest
    validate.open("POST",'http://localhost:8082'+'/validate')
    validate.setRequestHeader("Authorization","Bearer "+user.token)
    validate.send()
    validate.onload=()=>{
        if(validate.status == 401){location.href = './login.html'
        }else if(validate.status == 500){
            location.href = './login.html'
        }else{  
            user.token = JSON.parse(validate.responseText).token
            user.username = JSON.parse(validate.responseText).username
            user.email = JSON.parse(validate.responseText).email
            user.icon = JSON.parse(validate.responseText).icon
            user.status = JSON.parse(validate.responseText).status
            user.admin = JSON.parse(validate.responseText).admin
            if(user.token==null){
                alert('user not logged')
                location.href="./login.html"}
            else{
                localStorage.setItem('token', user.token)
                if(typeof uptkskt!=='undefined'){uptkskt()
                }else{}
            }
        }
    }
    validate.ontimeout = (e)=>{
        alert('connection error')
        location.href="./login.html"}
    validate.onerror=(e)=>{
        alert('connection error')
        location.href="./login.html"}
    
    
}
if(!user.token){
    alert('user not logged')
    location.href= "./login.html"
}
else{
    reauth()
}