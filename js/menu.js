function seach(){
    console.log('seach')
    let fundo = document.createElement('a')
    fundo.style.width = "100vw"
    fundo.style.height = "100vh"
    fundo.style.background = 'rgba(0,0,0,0.5)'
    fundo.style.position= 'fixed'
    fundo.style.top = '1.2em'
    fundo.style.zIndex = 0
    fundo.style.pointerEvents = 'visible'
    fundo.onclick=()=>{
        if((event.clientX>((window.innerWidth/2)-150) && event.clientY>((window.innerHeight/2)-132)) &&((event.clientX<((window.innerWidth/2)+150) && event.clientY<((window.innerHeight/2)+169)))){}
        else{document.querySelector('body').removeChild(fundo)}
    }
    let btn = document.createElement('button')
    btn.style.width = "550px"
    btn.style.height = '340px'
    btn.style.border = 0
    btn.style.borderRadius = '10px'
    btn.style.zIndex = 1
    btn.style.marginTop = 'calc(50vh - 150px)'
    btn.style.marginLeft = 'calc(50vw - 150px)'
    fundo.appendChild(btn)
    document.querySelector('body').appendChild(fundo)
}
var lastselected = 'amigos'
function selected(is){
    if(this.id==undefined){var isto=is}
    else{var isto=this}
    if(isto.id==lastselected){
    
    }
    else{
        console.log(isto.id)
        document.querySelector(`#${isto.id}`).className ='option-selected'
        document.querySelector(`#${lastselected}`).className='option'
        lastselected=isto.id
    }
}
for(let i=0;i<19;i++){
    let a =document.createElement('a')
    a.className='option'
    a.id= 'user'+i
    a.addEventListener('click', selected)
    let img = document.createElement('img')
    img.className='opt'
    img.src='/image/exemplo.png'
    let label = document.createElement('label')
    label.innerText='user'
    a.appendChild(img)
    a.appendChild(label)
    document.querySelector('div.option.center-content').appendChild(a)
}
window.addEventListener('load', (event) => {
    var request=new XMLHttpRequest;
    request.open("GET","http://localhost:8082/conversa"),request.setRequestHeader("Content-Type","application/json"),request.send('{"username":"'+'username'+'","password": "'+'password'+'"}');
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