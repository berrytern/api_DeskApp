
window.addEventListener('load', (event) => {
    var request=new XMLHttpRequest;
    request.open("GET","http://localhost:8081/conversa"),request.setRequestHeader("Content-Type","application/json"),request.send('{"username":"'+'username'+'","password": "'+'password'+'"}');
    request.onload=(e)=>{
        let data= 'data:image/jpeg;base64,'
        let last = document.createElement('img')
        last.src = data+JSON.parse(request.responseText)['last']
        document.querySelector('.menu.top').appendChild(last)
	    for(let i = 0; i<2; i++){
		    let exe = document.createElement('img')
		    exe.src = data+JSON.parse(request.responseText)['exemplo']
		    document.querySelector('.menu.bottom.top').appendChild(exe)
        }   
    }
});