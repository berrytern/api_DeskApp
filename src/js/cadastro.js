function post(path, params, method='post') {
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
  
        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
}
function submit(href){
    var username= document.getElementById("username").value
    var password= document.getElementById("password").value
    if(href=='/login'){
    var request=new XMLHttpRequest;
    request.open("POST","http://localhost:8081"+href),request.setRequestHeader("Content-Type","application/json"),request.send('{"username":"'+username+'","password": "'+password+'"}');
    request.onload=(e)=>{
        if(JSON.parse(request.status)==200){ 
            location.href=href 
        }else{
            alert('Usuário ou senha errados!');
        }}
    }else{
        var request=new XMLHttpRequest;
        request.open("POST","http://localhost:8081"+href),request.setRequestHeader("Content-Type","application/json"),request.send('{"username":"'+username+'","password": "'+password+'"}');
        request.onload=(e)=>{
        if(JSON.parse(request.status)==200){ 
            alert('conta criada')
        }else{
            alert('error ao fazer o cadastro');
        }}
        //post(href,{'username':username, 'password': password})
    }

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