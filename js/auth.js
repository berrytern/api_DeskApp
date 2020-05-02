let user = Object
user.token=localStorage.getItem('token') || null
user.admin = 0
function reauth(){
    validate= new XMLHttpRequest
    validate.open("POST",'http://localhost:8082'+'/validate')
    validate.setRequestHeader("Content-Type","application/json")
    validate.send('{"token":"'+user.token+'"}')
    validate.onload=(e)=>{
        user.token = JSON.parse(validate.responseText).token
        user.username = JSON.parse(validate.responseText).username
        user.icon = JSON.parse(validate.responseText).icon
        user.admin = JSON.parse(validate.responseText).admin
        console.log(user.token)
        if(user.token==null){
            alert('user not logged')
            location.href="./login.html"}
        else{
            localStorage.setItem('token', user.token)
        }
    }
    validate.onerror=()=>{
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