document.querySelector('.inputimg').onchange = function(evt){
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
        console.log(files.length, files.name,)
    // FileReader support
    
    if (FileReader && files && document.querySelector('.inputimg').files[0].size<=30000) {
        var fr = new FileReader();
        fr.onload = function () {
            console.log(document.querySelector('.inputimg').value,document.querySelector('.inputimg').files[0])
            document.querySelector('img.fileimg').src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        document.querySelector('.inputimg').value=''
        alert('tamanho ultrapassado')
    }
}
var socket= io('http://localhost:9030');

function submit(href){
    var username= document.getElementById("username").value
    var password= document.getElementById("password").value
    var fileimg= document.querySelector('.inputimg').files
    var boundary = (new Date()).getTime();
    var blobFile = fileimg[0];
    var formData = new FormData();
    //formData.append("file", blobFile);
    formData.append("username", username);
    formData.append("password", password);
    formData.append('file', fileimg[0], fileimg[0].name);
    var request=new XMLHttpRequest;
    request.open("POST","http://localhost:8082"+href ,true);
    request.setRequestHeader("data",formData)
    request.send(formData);
    request.onload=(e)=>{
    if(JSON.parse(request.status)==200){ 
        alert('conta criada')
    }else{
        alert('error ao fazer o cadastro');
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