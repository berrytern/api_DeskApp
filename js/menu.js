console.log(validate)
var f_topic='none'
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
            //chu.src = data+JSON.parse(request.responseText)['conversas'][conversa]
            document.querySelector('.menu.bottom.top').appendChild(chu)
        }
    }
    user_bar()
    friends_all()
});
window.addEventListener('click',(event)=>{
    if(document.querySelector('.set-status').style.display!='none'){
        if(((302>event.clientX)&&(event.clientX>82))&&(((window.innerHeight-50)>event.clientY)&&(event.clientY>(window.innerHeight-280)))){
        }else{document.querySelector('.set-status').style.display='none'}}
    },true)
let user_bar=()=>{
    let icon = document.querySelector('.option.bottom img')
    icon.src = 'data:image/jpeg;base64,' + user.icon;
    let status = document.querySelector('.option.bottom img.status')
    status.src = ''
    status.onmousemove= ()=>{
        if((status.offsetTop+12>event.clientY && status.offsetLeft+12>event.clientX)){status.style.cursor='pointer'
        }else{status.style.cursor='auto'}}
    status.onclick=()=>{
        if((status.offsetTop+12>event.clientY && status.offsetLeft+12>event.clientX)){user_status()}}
    status.onmouseout = ()=>{status.style.cursor='auto'}
    let name = document.querySelector('.option.bottom label')
    name.innerText = user.username
    let config = document.querySelector('.option.bottom div button')
    let iconfig = document.querySelector('.option.bottom div button img')
    iconfig.src = '../image/gear.png'
    config.onmouseover=()=>{config.style.background = 'rgba(11,11,11, 0.2)'}
    config.onmouseleave=()=>{config.style.background = 'transparent'}
}
function user_status(){
    console.log('status')
    document.querySelector('.set-status').style.display = 'block'
}
function user_config(){
    document.querySelector('.user-config').style.display = 'flex'
}
function user_config_close(){
    document.querySelector('.user-config').style.display = 'none'
}
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
function about(elem, message){
    console.log(elem.offsetWidth)
    elem.style.cursor = 'pointer'
    try{document.querySelector('body').removeChild(document.querySelector('.float-info'))}
    catch(e){}
    let div = document.createElement('div')
    div.className='float-info'
    div.style.display = 'flex'
    div.style.height = '33px'
    div.style.borderRadius='5px'
    div.style.background = 'rgb(22,22,22)'
    div.style.position= 'fixed'
    div.style.zIndex = 1
    div.style.top = `calc(${elem.offsetTop}px - ${elem.offsetHeight}px)`
    div.style.marginLeft = `calc(${(elem.offsetLeft)}px - ${(message.length*2.5)}px)`
    let msg = document.createElement('label')
    msg.innerText = message
    msg.style.margin = '5px 5px 5px 5px'
    msg.style.color = 'white'
    div.appendChild(msg)
    elem.onmouseout=()=>{
        document.querySelector('body').removeChild(div)
    }
    document.querySelector('body').appendChild(div)

}
function desapear(elem,father,color){
    let opacity = 100
    elem.style.background = color
    let bool = true
    let anima=()=>{
        opacity-=10
        console.log(opacity)
        elem.style.opacity = opacity+'%'
        if(opacity>0){
            setTimeout(anima,65)
        }else{
            bool = false
            console.log('removed')
            try{
                father.removeChild(elem)
                document.querySelector('body').removeChild(document.querySelector('.float-info'))}
            
            catch(e){}
            console.log('repete')
        }
    }
    anima()

}
function friends_all(){
    if(f_topic!='none'){reauth()}
    if(f_topic!='friend_all'){f_topic='friend_all'}
    let request = new XMLHttpRequest
    request.open("POST", "http://localhost:8082/friends")
    request.setRequestHeader('Authorization',"Bearer "+ user.token)
    request.send()
    request.onload= ()=>{
        let resp = JSON.parse(request.responseText)
        console.log(resp)
        if(f_topic=='all'){}
        else{
            let message =document.querySelector('div.message')
            message.innerHTML = ''
            let topic_msg='TODOS OS AMIGOS'
            let topic =document.createElement('label')
            topic.className='f lbl'
            topic.style.margin = '10px 0px 10px 20px'
            topic.style.color = 'white'
            topic.innerText = topic_msg
            message.appendChild(topic)
            if(resp.exist){
                let count
                let body = document.querySelector('body')
                for(friend in resp.list){
                    let div = document.createElement('div')
                    div.className = 'f div'
                    div.style.borderTop = 'solid 1px rgb(5, 60, 82)'
                    div.style.borderRadius ='4px'
                    div.onmouseover=()=>{div.style.background='rgba(190, 190, 190,0.2)'}
                    div.onmouseout=()=>{div.style.background='transparent'}
                    let icon = document.createElement('img')
                    icon.src = 'data:image/jpeg;base64,'+resp.list[friend].icon
                    icon.style.margin = '5px 0px 5px 0px'
                    icon.style.borderRadius ='30px'
                    icon.style.width = '30px'
                    icon.style.height= '30px'
                    let lbl = document.createElement('label')
                    lbl.innerText = resp.list[friend].username
                    lbl.style.margin = '10px 0px 0px 10px'
                    lbl.style.font = 'normal 12pt Arial'
                    lbl.style.fontWeight = 'bold'
                    lbl.style.color ='white'
                    lbl.style.flex = '1 1'
                    let msg = document.createElement('button')
                    msg.style.margin = '5px 0px 0px 5px'
                    msg.onmouseover =()=>{
                        about(msg,'Mensagem')
                        

                    }
                    msg.onclick =()=>{alert('futuro -> conversa')
                        
                    }
                    let opt = document.createElement('button')
                    opt.style.margin = '5px 5px 0px 5px'
                    opt.style.borderRadius = '30px'
                    opt.onmouseover =()=>{
                        about(opt,'Mais')
                    }
                    opt.onclick=(event,e)=>{
                        console.log(event,(event.clientY/window.innerHeight)*100)
                        let option = document.createElement('div')
                        option.className='float-opt'
                        option.style.display = 'flex'
                        option.style.flexDirection ='column'
                        option.style.width = '140px'
                        option.style.height = '33px'
                        option.style.borderRadius='5px'
                        option.style.background = 'rgb(22,22,22)'
                        option.style.position= 'fixed'
                        option.style.zIndex = 1
                        option.style.top = `calc(${event.clientY}px - 2px)`
                        option.style.marginLeft = `calc(${(event.clientX/window.innerWidth)*100}vw - 2px)`
                        option.onmouseleave=()=>{
                            body.removeChild(option)
                            friends_all()
                        }
                        let exc = document.createElement('button')
                        exc.style.background ='transparent'
                        exc.style.margin = '5px'
                        exc.style.height = 'calc(100% - 10px)'
                        exc.style.width = 'calc(100% - 10px)'
                        exc.style.border = '0'
                        exc.style.borderRadius = '2px'
                        exc.onmouseover = ()=>{exc.style.background ='rgb(39,39,39)'}
                        exc.onmouseleave = ()=>{exc.style.background ='transparent'}
                        exc.onclick = ()=>{
                            let excluir = new XMLHttpRequest
                            excluir.open("POST", "http://localhost:8082/friend/delete")
                            excluir.setRequestHeader('Authorization',"Bearer "+ user.token)
                            excluir.setRequestHeader('Content-Type','application/json')
                            excluir.send(`{"to":"${resp.list[friend].id}"}`)
                            excluir.onload= ()=>{
                                if(excluir.status==200){
                                    desapear(div,message,'rgb(255,90,100)')
                                    count-=1
                                    if(count==0){topic.innerText=topic_msg
                                    }else{
                                        topic.innerText=topic_msg+' - '+count
                                        body.removeChild(option)
                                    }
                                    
                                }
                            }

                        }
                        exc.style.color = 'rgb(200,73,73)'
                        exc.innerText='Desfazer amizade'
                        exc.style.cursor = 'pointer'
                        //exc.onclick=()=>{
                        //    let excluir = new XMLHttpRequest
                        //    excluir.open("POST", "http://localhost:8082"+"/friends")
                        //    excluir.setRequestHeader('Authorization',"Bearer "+ user.token)
                        //    excluir.send('resp.list[friend].id')
                        //    excluir.onload= ()=>{}
                        //}
                        exc.style.flex='1 1'
                        option.appendChild(exc)
                        body.appendChild(option)
                    }
                    let msgicon = document.createElement('img')
                    msgicon.src = '../image/msg.png'
                    msgicon.style.margin ='4px 0px 0px 0px'
                    msgicon.style.width ='12px'
                    msgicon.style.height ='13px'
                    msgicon.style.filter = 'opacity(80%)'
                    let opticon = document.createElement('img')
                    opticon.src = '../image/optc.png'
                    opticon.style.margin ='8.5px'
                    opticon.style.width ='12px'
                    opticon.style.height ='13px'
                    opticon.style.filter = 'opacity(80%)'
                    msg.appendChild(msgicon)
                    opt.appendChild(opticon)
                    div.appendChild(icon)
                    div.appendChild(lbl)
                    div.appendChild(msg)
                    div.appendChild(opt)
                    message.appendChild(div)
                }
                count = Number(friend)+1
                topic.innerText= topic.innerText+' - '+(count)
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
            pedid.setRequestHeader('Authorization','Bearer '+user.token)
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
        request.setRequestHeader('Authorization',"Bearer "+ user.token)
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
        request.setRequestHeader('Authorization',"Bearer "+ user.token)
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
                let count
                for(friend in resp.list){
                    let div = document.createElement('div')
                    div.className = 'f div'
                    div.style.borderTop = 'solid 0.1px rgb(140,140,200)'
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
                    lbl.style.font = 'normal 12pt Arial'
                    lbl.style.fontWeight = 'bold'
                    lbl.style.flex = '1 1'
                    let acc = document.createElement('button')
                    acc.style.margin = '5px 0px 0px 5px'
                    acc.onmouseover=()=>{
                        acc.style.cursor='pointer'
                        accimg.src = '../image/acceptg.png'
                        accimg.style.filter= ''
                        about(acc,"Aceitar")
                        }
                    acc.onmouseleave=()=>{
                        accimg.src = '../image/accept.png'
                        accimg.style.filter ='invert(20%)'
                    }
                    acc.onclick =()=>{
                        try{document.querySelector('body').removeChild(document.querySelector('.float-info'))}
                        catch(e){}
                        let aceitar = new XMLHttpRequest
                        console.log(resp.list[friend].id)
                        aceitar.open("POST", "http://localhost:8082/friend/new")
                        aceitar.setRequestHeader('Authorization',"Bearer "+ user.token)
                        aceitar.setRequestHeader('Content-Type','application/json')
                        aceitar.send(`{"to":"${resp.list[friend].id}"}`)
                        aceitar.onload= ()=>{if(aceitar.status==200){desapear(div,message,'rgb(90,255,100)');friend-=1;topic.innerText=topic_msg+' - '+friend}}
                    }
                    let exc = document.createElement('button')
                    exc.style.margin = '5px 0px 0px 5px'
                    exc.onmouseover=()=>{
                        exc.style.cursor='pointer'
                        excimg.src = '../image/unacceptr.png'
                        excimg.style.filter= ''
                        about(exc,"Ignorar")
                        }
                    exc.onmouseleave=()=>{
                        excimg.src = '../image/unaccept.png'
                        excimg.style.filter ='invert(20%)'
                    }
                    exc.onclick=(event,e)=>{
                        try{document.querySelector('body').removeChild(document.querySelector('.float-info'))}
                        catch(e){}
                        console.log('exc')
                        let excluir = new XMLHttpRequest
                        excluir.open("POST", "http://localhost:8082/pedido/delete")
                        excluir.setRequestHeader('Authorization',"Bearer "+ user.token)
                        excluir.setRequestHeader('Content-Type','application/json')
                        excluir.send(`{"to":"${resp.list[friend].id}"}`)
                        excluir.onload= ()=>{
                            if(excluir.status==200){
                                desapear(div,message,'rgb(255,90,100)')
                                count-=1
                                if(count==0){topic.innerText=topic_msg
                                }else{topic.innerText=topic_msg+' - '+count}
                        }
                    }
                    }
                    let accimg = document.createElement('img')
                    accimg.src = '../image/accept.png'
                    accimg.style.filter ='invert(20%)'
                    accimg.style.width = '15px'
                    accimg.style.margin = '2.5px 0px 0px 0px'
                    let excimg = document.createElement('img')
                    excimg.src = '../image/unaccept.png'
                    excimg.style.filter ='invert(20%)'
                    excimg.style.width = '12px'
                    excimg.style.margin = '2.5px 0px 0px 0px'
                    acc.appendChild(accimg)
                    exc.appendChild(excimg)
                    div.appendChild(icon)
                    div.appendChild(lbl)
                    div.appendChild(acc)
                    div.appendChild(exc)
                    message.appendChild(div)
                }
                count = Number(friend)+1
                console.log(count)
                topic.innerText= topic.innerText+' - '+(count)
            }
        }
    }
}
