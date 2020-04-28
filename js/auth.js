var token=localStorage.getItem('token') || null
var admin = 0
function reauth(){
    validate= new XMLHttpRequest
    validate.open("POST",'http://localhost:8082'+'/validate')
    validate.setRequestHeader("Content-Type","application/json")
    validate.send('{"token":"'+token+'"}')
    validate.onload=(e)=>{
        token = JSON.parse(validate.responseText).token
        admin = JSON.parse(validate.responseText).admin
        if(token==null){
            alert('user not logged')
            location.href="./login.html"}
    }
    validate.onerror=()=>{
        alert('connection error')
        location.href="./login.html"}
    
    
}
if(!token){
    alert('user not logged')
    location.href= "./login.html"
}
else{
    reauth()
}