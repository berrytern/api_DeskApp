console.log(validate)
var f_topic='none'
var lastselected = 'amigos'
function seach(){
    console.log('seach')
    let fundo = document.createElement('a')
    fundo.style.width = "100vw"
    fundo.style.height = "100vh"
    fundo.style.background = 'rgba(0,0,0,0.8)'
    fundo.style.position= 'fixed'
    fundo.style.top = '1.2em'
    fundo.style.zIndex = 0
    fundo.style.pointerEvents = 'visible'
    fundo.onclick=()=>{
        if((event.clientX>((window.innerWidth/2)-277) && event.clientY>((window.innerHeight/2)-150)) &&((event.clientX<((window.innerWidth/2)+277) && event.clientY<((window.innerHeight/2)+189)))){}
        else{document.querySelector('body').removeChild(fundo)}
    }
    let btn = document.createElement('div')
    btn.style.width = "550px"
    btn.style.height = '340px'
    btn.style.background = 'rgb(44,44,44)'
    btn.style.border = 0
    btn.style.borderRadius = '10px'
    btn.style.zIndex = 1
    btn.style.marginTop = 'calc(50vh - 170px )'
    btn.style.marginLeft = 'calc(50vw - 275px)'
    fundo.appendChild(btn)
    document.querySelector('body').appendChild(fundo)
}
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
    img.src='../image/exemplo.png'
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
        let conversas = JSON.parse(request.responseText)['conversas']
        let data= 'data:image/jpeg;base64,'
        for(conversa in conversas){
            let chu=document.createElement('img')
            chu.src = data+JSON.parse(request.responseText)['conversas'][conversa]
            document.querySelector('.menu.bottom.top').appendChild(chu)
        }
    }
    friends_all()
});
function friends_all(){
    if(f_topic!='none'){reauth()}
    if(f_topic!='friend_all'){f_topic='friend_all'}
    let request = new XMLHttpRequest
    request.open("POST", "http://localhost:8082"+"/friends")
    request.setRequestHeader('Authorization',"Bearer "+ token)
    request.send()
    request.onload= ()=>{
        let resp = JSON.parse(request.responseText)
        console.log(resp)
        if(f_topic=='all'){}
        else{
            let message =document.querySelector('div.message')
            message.innerHTML = ''
            let topic =document.createElement('label')
            topic.className='f lbl'
            topic.style.margin = '10px 0px 10px 20px'
            topic.style.color = 'white'
            topic.innerText = 'TODOS OS AMIGOS'
            message.appendChild(topic)
            if(resp.exist){
                for(friend in resp.list){
                    let div = document.createElement('div')
                    div.className = 'f div'
                    div.style.borderTop = 'solid 0.1px rgb(200,200,200)'
                    let icon = document.createElement('img')
                    icon.src = 'data:image/jpeg;base64,'+resp.list[friend].icon
                    icon.style.margin = '5px 0px 5px 0px'
                    icon.style.borderRadius ='30px'
                    icon.style.width = '30px'
                    icon.style.height= '30px'
                    let lbl = document.createElement('label')
                    lbl.innerText = resp.list[friend].username
                    lbl.style.margin = '10px 0px 0px 10px'
                    lbl.style.color ='white'
                    lbl.style.flex = '1 1'
                    let msg = document.createElement('button')
                    msg.style.margin = '5px 0px 0px 5px'
                    msg.onclick =()=>{
                        let excluir = new XMLHttpRequest
                        excluir.open("POST", "http://localhost:8082/friend/delete")
                        excluir.setRequestHeader('Authorization',"Bearer "+ token)
                        excluir.setRequestHeader('Content-Type','application/json')
                        excluir.send(`{"to":"${resp.list[friend].id}"}`)
                        excluir.onload= ()=>{if(excluir.status==200){alert('excluido');message.removeChild(div)}}
                    }
                    let opt = document.createElement('button')
                    opt.style.margin = '5px 0px 0px 5px'
                    opt.onclick=(event,e)=>{
                        console.log(event,(event.clientY/window.innerHeight)*100)
                        let option = document.createElement('div')
                        option.className='float'
                        option.style.width = '100px'
                        option.style.height = '33px'
                        option.style.borderRadius='5px'
                        option.style.background = 'red'
                        option.style.position= 'fixed'
                        option.style.zIndex = 1
                        option.style.top = `${event.clientY}px`
                        option.style.marginLeft = `${(event.clientX/window.innerWidth)*100}vw`
                        let contbtn = document.createElement('div')
                        contbtn.style.display = 'flex'
                        contbtn.style.flexDirection ='column'
                        contbtn.style.height = 'calc(100% - 10px)'
                        contbtn.style.width = 'calc(100% - 10px)'
                        contbtn.style.margin = '5px'
                        let exc = document.createElement('button')
                        exc.style.background = 'green'
                        //exc.onclick=()=>{
                        //    let excluir = new XMLHttpRequest
                        //    excluir.open("POST", "http://localhost:8082"+"/friends")
                        //    excluir.setRequestHeader('Authorization',"Bearer "+ token)
                        //    excluir.send('resp.list[friend].id')
                        //    excluir.onload= ()=>{}
                        //}
                        exc.style.flex='1 1'
                        contbtn.appendChild(exc)
                        option.appendChild(contbtn)
                        document.querySelector('body').appendChild(option)
                    }
                    div.appendChild(icon)
                    div.appendChild(lbl)
                    div.appendChild(msg)
                    div.appendChild(opt)
                    message.appendChild(div)
                }
                topic.innerText=topic.innerText +' - '+(Number(friend)+1)
            }else{

            }
            }
    }


}
function add(){
    console.log('add()')
    if(f_topic!='none'){reauth()}
    if(f_topic!='add'){
        let message =document.querySelector('div.message')
        message.innerHTML = ''
        let topic =document.createElement('label')
        topic.className='f lbl'
        topic.style.margin = '10px 0px 10px 20px'
        topic.innerText = 'ADICIONAR UM AMIGO'
        topic.style.color = 'white'
        divinp=document.createElement('div')
        divinp.style.background ='rgb(48,51,57)'
        divinp.style.border='solid 1.2px  black'
        divinp.style.borderRadius= '10px 10px 10px 10px'
        divinp.style.display = 'flex'
        divinp.style.height='55px'
        divinp.style.width = 'calc(100% - 40px)'
        divinp.style.margin = '0px 20px'
        
        divinp.style.zIndex=0
        input= document.createElement('input')
        input.style.padding = '0px 0px 0px 20px'
        input.style.color ='white'
        input.style.backgroundColor = 'transparent'
        input.style.borderRadius= '10px 0px 0px 10px'
        input.style.border ='0'
        input.style.flex = '2 2'
        input.innerText = 'Insira o nome de usuário'
        btn = document.createElement('button')
        btn.style.cursor ='pointer'
        btn.innerText= 'Enviar pedido de amizade'
        btn.style.color = 'white'
        btn.style.margin = '10px 10px 10px 10px'
        btn.style.width="180px"
        btn.style.background ='rgb(114,137,218)'
        btn.style.borderRadius= '5px 5px 5px 5px'
        btn.style.border = 'solid 1.2px  black'
        btn.style.borderLeft= '0'
        btn.onclick=()=>{
            pedid = new XMLHttpRequest
            pedid.open('POST','http://localhost:8082/pedido/new')
            pedid.setRequestHeader('Authorization','Bearer '+token)
            pedid.setRequestHeader('Content-Type','application/json')
            pedid.send(`{"to":"${input.value}"}`)
            pedid.onload= ()=>{
                console.log(pedid.responseText)
                resp = JSON.parse(pedid.responseText)||null
                if(pedid.status==200){alert('pedido enviado')}
                else if(pedid.status==404){
                    alert('usuário não existe')
                }else if(pedid.status==314){alert('pedido renviado')
                }else if(pedid.status==312){alert('você não pode se adicionar')
                }else if(pedid.status ==500){alert('error no server')}
            }
        }
        divinp.appendChild(input)
        divinp.appendChild(btn)
        message.appendChild(topic)
        message.appendChild(divinp)
        /*let request = new XMLHttpRequest
        request.open("POST", "http://localhost:8082"+"/friend/new")
        request.setRequestHeader('Authorization',"Bearer "+ token)
        request.send()
        request.onload= ()=>{
            let resp = JSON.parse(request.responseText)
            if(f_topic=='all'){}
            else{
            }}*/
        f_topic='add'
    
    }else{}
}
function pedidos(){
    console.log('pedidos()')
    if(f_topic!='none'){reauth()}
    if(f_topic!='pedidos'){
        let request = new XMLHttpRequest
        request.open("POST", "http://localhost:8082"+"/pedidos")
        request.setRequestHeader('Authorization',"Bearer "+ token)
        request.send()
        request.onload= ()=>{
            let resp = JSON.parse(request.responseText)
            console.log(resp)
            let message =document.querySelector('div.message')
            message.innerHTML = ''
            let topic =document.createElement('label')
            topic.className='f lbl'
            topic.style.margin = '10px 0px 10px 20px'
            topic.style.color = 'white'
            topic.innerText = 'TODOS OS PEDIDOS'
            message.appendChild(topic)
            if(resp.exist){
                for(friend in resp.list){
                    let div = document.createElement('div')
                    div.className = 'f div'
                    div.style.borderTop = 'solid 0.1px rgb(200,200,200)'
                    let icon = document.createElement('img')
                    icon.src = 'data:image/jpeg;base64,'+resp.list[friend].icon
                    icon.style.margin = '5px 0px 5px 0px'
                    icon.style.borderRadius ='30px'
                    icon.style.width = '30px'
                    icon.style.height= '30px'
                    let lbl = document.createElement('label')
                    lbl.innerText = resp.list[friend].username
                    lbl.style.margin = '10px 0px 0px 10px'
                    lbl.style.color ='white'
                    lbl.style.flex = '1 1'
                    let acc = document.createElement('button')
                    acc.style.margin = '5px 0px 0px 5px'
                    acc.onclick =()=>{
                        let aceitar = new XMLHttpRequest
                        console.log(resp.list[friend].id)
                        aceitar.open("POST", "http://localhost:8082/friend/new")
                        aceitar.setRequestHeader('Authorization',"Bearer "+ token)
                        aceitar.setRequestHeader('Content-Type','application/json')
                        aceitar.send(`{"to":"${resp.list[friend].id}"}`)
                        aceitar.onload= ()=>{if(aceitar.status==200){alert('aceito');message.removeChild(div)}}
                    }
                    let exc = document.createElement('button')
                    exc.style.margin = '5px 0px 0px 5px'
                    exc.onclick=(event,e)=>{
                        console.log('exc')
                        let excluir = new XMLHttpRequest
                        excluir.open("POST", "http://localhost:8082/pedido/delete")
                        excluir.setRequestHeader('Authorization',"Bearer "+ token)
                        excluir.setRequestHeader('Content-Type','application/json')
                        excluir.send(`{"to":"${resp.list[friend].id}"}`)
                        excluir.onload= ()=>{if(aceitar.status==200){alert('delete');message.removeChild(div)}}
                    }
                    div.appendChild(icon)
                    div.appendChild(lbl)
                    div.appendChild(acc)
                    div.appendChild(exc)
                    message.appendChild(div)
                
                }
                topic.innerText+=Number(friend)+1
            }
        }
    }
}
