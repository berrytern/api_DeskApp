
var socket= io('http://localhost:9030');

function submit(href){
    var username= document.getElementById("username").value
    var password= document.getElementById("password").value
    var request=new XMLHttpRequest;
    request.open("POST","http://localhost:8082"+href),request.setRequestHeader("Content-Type","application/json"),request.send('{"username":"'+username+'","password": "'+password+'"}');
    request.onload=(e)=>{
        console.log(request.responseText)
        if(JSON.parse(request.status)==200){ 
            let token =JSON.parse(request.responseText)['token']
            window.localStorage.setItem('token',token)
            location.href="/menu"
            //document.querySelector('html').innerHTML=get.responseText
        }else{
            alert('Usuário ou senha errados!');
        }}

    //document.getElementById("user").innerText = username
}
function pass(showisit=false){
    var pass= document.getElementById("password")
    if(showisit==true && pass.value==""){
        pass.value="Password"
        pass.type="text"
    }
    else if(pass.value=="Password"){
        pass.value=''
    }

}
function user(showisit=false){
    var user= document.getElementById("username")
    if(showisit==true && user.value==""){
        user.value="Username"
    }
    else if(user.value=='Username'){
        user.value=''
    }

}