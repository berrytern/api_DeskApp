var token=localStorage.getItem('token') || null
if(!token){
    alert('user not logged')
    location.href= "./login.html"
}
else{
    validate= new XMLHttpRequest
    validate.open("POST",'http://localhost:8082'+'/validate')
    validate.setRequestHeader("Content-Type","application/json")
    validate.send('{"token":"'+token+'"}')
    validate.onload=(e)=>{
        console.log(validate.responseText)
        token = JSON.parse(validate.responseText).token
    
        if(token==null){
            alert('user not logged')
            location.href="./login.html"}
        else{
        }
    }
}