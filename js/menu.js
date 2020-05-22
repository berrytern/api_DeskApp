document.querySelector('.inputimg').onchange = function(evt){
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
    // FileReader support
    
    if (FileReader && files && document.querySelector('.inputimg').files[0].size<=40000) {
        var fr = new FileReader();
        fr.onload = function () {
            console.log(fr.result)
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
var f_topic='none'
var lastselected = 'amigos'
var lastoption = 'none'
var new_pass = false
function selected(is){
    if(this.id==undefined){var isto=is}
    else{var isto=this}
    if(isto.id==lastselected){
    
    }
    else{
        console.log(isto.id)
        document.querySelector(`#${isto.id}`).className ='option-selected :'+isto.con
        let lt= document.querySelector(`#${lastselected}`)
        lt.className=lt.className.replace('-selected','')
        lastselected=isto.id
        if(lastselected=='amigos'){

        }
    }
}
let topmsg
let botmsg
function Conversas(){
    this.aftermsg=(id,content_id)=>{
        console.log('new messages?')
        reauth()
        array = document.querySelectorAll('.message-content label#num')
        lastmsg=document.querySelectorAll('#divmsg')
        lasticon=document.querySelectorAll('#divicon')
        lastmsg=lastmsg[lastmsg.length-1]
        lasticon=lasticon[lasticon.length-1]
        let big = ''
        let biggest, biggestnum
        if(array.length!=0){
            for(let num in array){
                if(typeof array[num].className!=='undefined'){
                    let novo = Number(array[num].className.split(':')[1])
                    if(big==''){big = novo
                    }else if(big<novo){big=novo;biggest = array[num].className}
                }
            }
            biggestnum = Number(biggest.split(':')[1])+1
        }else{biggest='n'}
        newmsg = new XMLHttpRequest()
        newmsg.open("GET","http://localhost:8082/conversa/"+id+`/${biggestnum}/n`)
        newmsg.setRequestHeader('Authorization','Bearer '+user.token)
        newmsg.setRequestHeader('Content-Type','application/json')
        newmsg.onerror=(e)=>{console.log('error')}
        newmsg.send()
        newmsg.onload=(e)=>{
            if(document.querySelector('.option-selected').id==content_id){
                console.log(biggest)
                if(newmsg.status==204){
                }else if(newmsg.status==200){
                    let messages=JSON.parse(newmsg.responseText)[0]
                    info_user=JSON.parse(newmsg.responseText)[1]
                    let lastid = biggest.split(':')[0]
                    this.addmsg(messages,info_user,lastmsg,lasticon,lastid)
                    document.querySelector('.message-content').scrollTo(0, 10000)
                }
                setTimeout(()=>{this.aftermsg(id,content_id)},1000)
            }else{}
            
        }
    }
    this.time =  Date.now()
    this.to=(id,obj,group)=>{selected(document.getElementsByClassName('option :'+id)[0]);this.content(id,obj,group);setTimeout(()=>{this.aftermsg(id,document.getElementsByClassName('option-selected :'+id)[0].id)},1000);this.loadmsg(id,document.getElementsByClassName('option-selected :'+id)[0].id)}
    this.loadmsg=(id,content_id)=>{
        document.querySelector('.message-content').addEventListener('mousewheel',(event)=>{
            if(document.querySelector('.option-selected').id==content_id){
                var rolled = 0;
                if ('wheelDelta' in event) {
                    rolled = event.wheelDelta;
                }
                else {  // Firefox
                        // The measurement units of the detail and wheelDelta properties are different.
                    rolled = -40 * event.detail;
                }if(rolled>0&&document.querySelector('.message-content').scrollTop<=0 && this.time<Date.now()){
                    this.time=Date.now()+3000
                    console.log('up: ',content_id,)
                    let nextmsg = document.querySelector('.message-content').firstChild.children[1]
                    let nexticon = document.querySelector('.message-content').firstChild.children[0]
                    let next = document.querySelectorAll('label#num')[0].className.split(':')
                    let before
                    if(Number(next[1])-10<0){before = 0}else{before = Number(next[1])-10}
                    let load=new XMLHttpRequest
                    load.open("GET","http://localhost:8082/conversa/"+`${id}/${before}/${next[1]}`)
                    load.setRequestHeader('Authorization','Bearer '+user.token)
                    load.send()
                    load.onload=()=>{
                        if(load.status==204){}
                        else{
                        let messages=JSON.parse(load.responseText)[0]
                        let info_user = JSON.parse(load.responseText)[1]
                        this.addmsg(messages,info_user,null,null,"",next[0],next[1],nextmsg,nexticon,before=true)
                        }
                    }
                }
            }
        })
        
    }
    this.con_add=(conversa,num)=>{
        console.log(conversa)
        let a =document.createElement('a')
        a.className='option'
        a.style.margin = '2px 0px 0px 9px'
        a.id= 'user'+num
        a.className = 'option :'+conversa._id
        a.con = conversa._id
        a.onclick=()=>{selected(a);this.content(conversa._id,conversa,conversa.group);setTimeout(()=>{this.aftermsg(conversa._id,a.id)},1000);this.loadmsg(conversa._id,a.id)}
        let img = document.createElement('img')
        img.className='opt'
        let status = document.createElement('img')
        let label = document.createElement('label')
        if(conversa.group){
            for(let user in conversa.username){
                label.innerText+=conversa.username[user]+', '
            }
            a.addEventListener('contextmenu',(e)=>{this.menu(a,conversa._id,conversa.group)})
            label.innerText= label.innerText.slice(0,-2)
            img.src='../image/exemplo.png'
        }else{
            a.addEventListener('contextmenu',(e)=>{this.menu(a,conversa._id,conversa.group)})
            label.innerText=conversa.username
            img.src='data:image/jpeg;base64,'+conversa.icon
            status.style.width = '14px'
            status.style.height = '14px'
            status.style.position= 'relative'
            status.style.background='rgb(5, 60, 82)'
            status.style.border= 'solid 2px rgb(5, 60, 82)'
            status.style.borderRadius = '22px'
            status.style.margin= '26px 9px 0px -23px'
            status.src = '../image/'+conversa.status+'.png'

        }
        a.appendChild(img)
        console.log(status.src.length)
        if(status.src.length>0){a.appendChild(status)}
        a.appendChild(label)
        document.querySelector('div.option.center-content .option-cvs').appendChild(a)
    }
    this.get=()=>{request= new XMLHttpRequest
        document.querySelector('div.option.center-content .option-cvs').innerHTML = ''
        request.open("GET",'http://localhost:8082/conversas')
        request.setRequestHeader('Authorization', 'bearer '+user.token)
        request.send()
        request.onload = ()=>{
            if(request.status==404){
    
            }else if(request.status==200){
                
                let list = JSON.parse(request.responseText)['list']
                let time = Date.now()
                
                for(let conversa in list){
                    this.con_add(list[conversa],conversa)
                }
                
            }
        }
    }
    this.addmsg=(messages,info_user,lastdivmsg=null,lastdivicon=null,lastid=null,nextid=null,nextnum=null,nextmsg=null,nexticon=null,before=false)=>{
        if(document.querySelector('.message-content').childNodes.length==0){topmsg=messages[0]}
        now=new Date()
        let username
        let icon
        let inverso = messages.length
        for(let msgi in messages){
            let msg
            if(before){if(msgi==0){inverso = messages.length-1}else{inverso=inverso-1};msg=inverso
            }else{msg=msgi}
            time = new Date(messages[msg].time)
            console.log(Number(messages[msg].time),Number(topmsg.time),before&&(nextid==messages[msg].id),Number(topmsg.time)<Number(messages[msg].time)+10*60000, before)
            if((lastid==messages[msg].id &&Number(botmsg.time)+10*60000>Number(messages[msg].time))|| before&&(nextid==messages[msg].id) && Number(topmsg.time)<Number(messages[msg].time)+10*60000){
                console.log('dentro')
                let timelbl = document.createElement('label')
                timelbl.style.color = 'rgb(150,150,150)'
                timelbl.style.font = 'normal 9pt Arial'
                timelbl.style.alignSelf = 'flex-end'
                timelbl.style.margin = '5px 4px 4px 0px' 
                timelbl.style.visibility = 'hidden'
                let message = document.createElement('label')
                message.id='num'
                message.className = messages[msg].id+':'+messages[msg].num
                message.style.color = 'rgb(210,210,210)'
                message.style.font = 'normal 12pt Arial'
                message.style.marginBottom = '5px'
                message.innerText = messages[msg].message
                if(before){
                    time = new Date(topmsg.time)
                    let zeroh = zerom = ''
                    if(time.getHours()<10){zeroh='0'}
                    if(time.getMinutes()<10){zerom='0'}
                    timelbl.innerText = zeroh+time.getHours()+':'+zerom+time.getMinutes()
                    nextmsg.children[1].onmouseover=()=>{timelbl.style.visibility='visible'}
                    nextmsg.children[1].onmouseleave=()=>{timelbl.style.visibility='hidden'}
                    nexticon.insertBefore(timelbl,nexticon.children[1])
                    time = new Date(messages[msg].time)
                    zeroh = zerom = ''
                    if(time.getHours()<10){zeroh='0'}
                    if(time.getMinutes()<10){zerom='0'}
                    timelbl.innerText = zeroh+time.getHours()+':'+zerom+time.getMinutes()
                    nextmsg.insertBefore(message,nextmsg.children[1])
                    topmsg = messages[msg]
                    nextid = messages[msg].id
                }else{
                    let zeroh = zerom = ''
                    if(time.getHours()<10){zeroh='0'}
                    if(time.getMinutes()<10){zerom='0'}
                    timelbl.innerText = zeroh+time.getHours()+':'+zerom+time.getMinutes()
                    message.onmouseover=()=>{message.style.cursor = 'auto';timelbl.style.visibility = 'visible'}
                    message.onmouseout=()=>{timelbl.style.visibility = 'hidden'}
                    lastdivicon.appendChild(timelbl)
                    lastdivmsg.appendChild(message)
                    lastid = messages[msg].id
                    botmsg = messages[msg]
                }
            }
            else if(lastdivmsg==null || lastid!=messages[msg].id ||Number(botmsg.time)+10*60000<Number(messages[msg].time)|| (before&&(nextid!=messages[msg].id))|| (Number(topmsg.time)<Number(messages[msg].time)+10*60000&&before)){
                let index = info_user[0].indexOf(messages[msg].id);
                username = info_user[1][index];
                icon = info_user[2][index];
                let div = document.createElement('div')
                div.style.display = 'flex'
                divicon = document.createElement('div')
                divicon.id='divicon'
                divicon.style.display = 'flex'
                divicon.style.flexDirection = 'column'
                lastdivicon = divicon
                let iconimg = document.createElement('img')
                iconimg.style.width = '40px'
                iconimg.style.height = '40px'
                iconimg.style.margin = '8px 15px 0px 15px'
                iconimg.style.borderRadius = '20px'
                iconimg.src='data:image/jpeg;base64,'+icon
                let divmsg = document.createElement('div')
                divmsg.id='divmsg'
                divmsg.style.display = 'flex'
                divmsg.style.flexDirection = 'column'
                lastdivmsg = divmsg
                divnametime = document.createElement('div')
                divnametime.style.display = 'flex'
                let namelbl = document.createElement('label')
                namelbl.style.margin = '8px 0px 0px 0px'
                namelbl.style.font = 'bold 12pt Arial'
                namelbl.style.color = 'white'
                namelbl.innerText = username
                namelbl.onmouseover = ()=>{namelbl.style.textDecoration= 'underline';namelbl.style.cursor = 'pointer'}
                namelbl.onmouseleave = ()=>{namelbl.style.textDecoration = 'none'}
                namelbl.onclick=()=>{}
                let timelbl =  document.createElement('label')
                timelbl.style.margin = '11px 0px 0px 8px'
                timelbl.style.color = 'rgb(150,150,150)'
                timelbl.style.font = 'normal 9pt Arial'
                if(time.getFullYear()==now.getFullYear()||(time.getFullYear()+1==now.getFullYear()&&time.getMonth()==11 && now.getMonth()==0 && now.getDate()==1)){
                    if(time.getMonth()==now.getMonth() || (time.getMonth()+1==now.getMonth() && now.getDate()==1)||(time.getMonth()==11 && now.getMonth()==0 && now.getDate()==1)){
                        if(time.getDate() == now.getDate()){
                            let zeroh = zerom = ''
                            if(time.getHours()<10){zeroh='0'}
                            if(time.getMinutes()<10){zerom='0'}
                            timelbl.innerText = "Hoje às "+zeroh+time.getHours()+':'+zerom+time.getMinutes()
                        }else if(time.getDate()+1 == now.getDate()||(time.getFullYear()+1==now.getFullYear() || (time.getMonth()+1==now.getMonth()))){
                            let zeroh = zerom = ''
                            if(time.getHours()<10){zeroh='0'}
                            if(time.getMinutes()<10){zerom='0'}
                            timelbl.innerText = "Ontem às "+zeroh+time.getHours()+':'+zerom+time.getMinutes()
                        }else{
                            let zerod = zerom = ''
                            if(time.getDate()<10){zerod='0'}
                            if(time.getMonth()<10){zerom='0'}
                            timelbl.innerText = zerod+time.getDate()+"/"+zerom+time.getMonth()+'/'+time.getFullYear()
                        }
                    }else{
                        let zerod = zerom = ''
                        if(time.getDate()<10){zerod='0'}
                        if(time.getMonth()<10){zerom='0'}
                        timelbl.innerText = zerod+time.getDate()+"/"+zerom+time.getMonth()+'/'+time.getFullYear()
                    }
                }else{
                    let zerod = zerom = ''
                    if(time.getDate()<10){zerod='0'}
                    if(time.getMonth()<10){zerom='0'}
                    timelbl.innerText = zerod+time.getDate()+"/"+zerom+time.getMonth()+'/'+time.getFullYear()
                }   
                let message = document.createElement('label')
                message.id='num'
                message.className = messages[msg].id+':'+messages[msg].num
                message.style.color = 'rgb(210,210,210)'
                message.style.font = 'normal 12pt Arial'
                message.style.marginBottom = '4px'
                message.innerText = messages[msg].message
                message.onmouseover=()=>{message.style.cursor = 'auto';}
                divnametime.appendChild(namelbl)
                divnametime.appendChild(timelbl)
                divmsg.appendChild(divnametime)
                divmsg.appendChild(message)
                divicon.appendChild(iconimg)
                div.appendChild(divicon)
                div.appendChild(divmsg)
                if(before){
                    document.querySelector('.message-content').insertBefore(div,document.querySelector('.message-content').children[0])
                    topmsg = messages[msg]
                    nextid = messages[msg].id
                }
                else{
                    document.querySelector('.message-content').appendChild(div)
                    lastid = messages[msg].id
                    botmsg = messages[msg]
                }
                
            }
        }
    }
    this.content=(id, conversa,group)=>{
        console.log(id,group)
        document.querySelector('div.navl-friends').style.display = 'none'
        document.querySelector('div.navr-friends').style.display = 'none'
        document.querySelector('.message-content').innerHTML =''
        document.querySelector('.navl-message').innerHTML = ''
        document.querySelector('.send-message').innerHTML = ''
        let navl =document.querySelector('.navl-message')
        let img
        let info
        let status = document.createElement('img')
        navl.style.display = 'flex'
        if(group){
            img = document.createElement('img')
            img.src = '../image/Amigos.png'
            info = document.createElement('input')
            info.type='text'
            info.style.color = 'gray'
            info.style.margin = '12px 0px'
            info.style.width = '80px'
            for(let user in conversa.username){
                info.value+=conversa.username[user] +', '
            }
            info.value = info.value.slice(0, -2)
            
        }else{
            img = document.createElement('img')
            img.src = '../image/unaccept.png'
            info = document.createElement('label')
            info.style.color = 'white'
            info.style.margin = '14px 0px'
            info.innerText=conversa.username
            info.style.width = 'min-width';
            status.style.width = '14px'
            status.style.height = '14px'
            status.style.position= 'relative'
            status.style.background='rgb(6, 77, 105)'
            status.style.border= 'solid 2px rgb(6, 77, 105)'
            status.style.borderRadius = '22px'
            status.style.margin = '17px 2px'
            status.src = '../image/'+conversa.status+'.png'
        }
        img.style.margin = '15px 12px 15px 18px'
        img.style.width = '18px'
        img.style.height = '18px'
        img.style.filter = 'invert(30%)'
        info.style.backgroundColor = 'transparent'
        info.style.border = 0
        info.style.font = 'bold 12pt Arial'
        navl.appendChild(img)
        navl.appendChild(info)
        if(status.src.length>0){navl.appendChild(status)}
        let getmsg = new XMLHttpRequest
        getmsg.open('GET','http://localhost:8082/conversa/'+id+'/n/n')
        getmsg.setRequestHeader('Authorization','Bearer ' + user.token)
        getmsg.send()
        getmsg.onload = () => {
            let messages = JSON.parse(getmsg.responseText)[0]
            let info_user = JSON.parse(getmsg.responseText)[1]
            console.log(messages)
            this.addmsg(messages,info_user)
            document.querySelector('.message-content').scrollTo(0, 10000)
            document.querySelector('.message').style.justifyContent = 'flex-end'
        }
        
        let div =document.querySelector('.send-message')
        div.style.display = 'flex'
        div.style.background = 'rgba(255,255,255,0.13)'
        div.style.borderRadius = '10px'
        let up =  document.createElement('input')
        up.style.visibility = 'hidden'
        up.style.width = '0px'
        up.style.height = '0px'
        up.style.padding = '0px'
        up.type = 'file'
        up.accept = '.png, .jpg, .jpeg'
        up.id = 'upmsg'
        let uplbl = document.createElement('label')
        uplbl.htmlFor = 'upmsg'
        uplbl.style.padding = '0px 9px'
        uplbl.style.marginTop = '4px'
        let bg = document.createElement('div')
        bg.style.marginTop = '2px'
        bg.style.borderRadius = '30px'
        bg.style.height = '30px'
        bg.style.background = 'rgba(22,22,22,0.4)'
        let lblimg = document.createElement("img")
        lblimg.src = '../image/upmsg.png'
        lblimg.style.width =  '30px'
        lblimg.style.height =  '30px'
        let message = document.createElement('input')
        message.style.border = 0
        message.style.background = 'transparent'
        message.style.width = '100%'
        message.type = 'text'
        message.addEventListener('keydown', (e)=>{
            if(e.key=="Enter"){
                console.log(id)
                let sendm = new XMLHttpRequest 
                sendm.open('POST', `http://localhost:8082/message/${id}`)
                sendm.setRequestHeader('Authorization', "Bearer " + user.token)
                sendm.setRequestHeader('Content-Type', 'application/json')
                sendm.send(`{"type":"text","message":"${message.value}"}`)
                sendm.onload=()=>{
                    message.value = ''
                }
            }
        })
        bg.appendChild(lblimg)
        uplbl.appendChild(bg)
        div.appendChild(up)
        div.appendChild(uplbl)
        div.appendChild(message)
    }
    this.menu=(elem,id,group)=>{
        console.log(elem,id,group)
        console.log('menu')
        let div = document.createElement('div')
        div.style.display = "flex"
        div.style.flexDirection = 'column'
        div.style.position = 'fixed'
        div.style.zIndex = 2
        div.style.width = '200px'
        div.onmouseleave=()=>{div.remove()}
        if(group){
        }else{}
        let button = document.createElement('button')
        button.style.height = '30px'
        div.appendChild(button)
        elem.appendChild(div)
    }
}
let conversa = new Conversas


function reauth_fim(){
    if(!user.icon){setTimeout(reauth_fim,50)
    }else{
        user_bar()
        myaccount()
    }
}
window.addEventListener('load', (event) => {
    friends.to()
    reauth_fim()
    conversa.get()
});
//window.addEventListener('contextmenu', event => event.preventDefault());
window.addEventListener('click',(event)=>{
    if(document.querySelector('.set-status').style.display!='none'){
        if(((302>event.clientX)&&(event.clientX>82))&&(((window.innerHeight-50)>event.clientY)&&(event.clientY>(window.innerHeight-280)))){
        }else{document.querySelector('.set-status').style.display='none'}}
    },true)
let user_bar=()=>{
    let icon = document.querySelector('.option.bottom img')
    icon.src = 'data:image/jpeg;base64,' + user.icon;
    let status = document.querySelector('.option.bottom img.status')
    status.src = '../image/'+user.status +'.png'
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
function change_status(status){
    reauth()
    request = new XMLHttpRequest
    request.open('POST',"http://localhost:8082/status")
    request.setRequestHeader('Authorization', "Bearer " + user.token)
    request.setRequestHeader('Content-Type','application/json')
    request.send(`{"status":"${status}"}`)
    request.onload =()=>{
        document.querySelector('.set-status').style.display = 'none'
        document.querySelector('.option.bottom img.status').src = '../image/'+status+'.png'
        
    }
}
function user_config(){
    document.querySelector('.user-config').style.display = 'flex'
    myaccount()
}
function myaccount(){
    if(lastoption != 'myaccout'){
        document.querySelector('div.account').style.display = 'flex';
        lastoption = 'myaccount';
        document.querySelector('.account-user.i > img').src = 'data:image/jpeg;base64,' + user.icon;
    }
    user_edit()
}

function aviso(pai, message,color,time=2000){
    if(color=='red'){color='255,66,66';console.log('red')}
    else if(color=='green'){color='66,255,66';console.log('green')}
    else{color = '120,120,120'}
    let div = document.createElement('div')
    div.style.height = '40px'
    div.style.background = "rgba("+color+",0.5)"
    div.style.borderRadius = '4px'
    div.style.display = 'flex'
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center'
    let label = document.createElement('label')
    label.innerText = message
    label.style.font = 'bold 12pt Arial'
    label.style.color = 'white'
    div.appendChild(label)
    pai.insertBefore(div,pai.childNodes[0])
    console.log('created')
    setTimeout(()=>{div.remove()}, time)
}
function user_edit(action=''){
    if(action=='edit'){
        document.querySelector('div.account-user.i').style.display = 'none'
        document.querySelector('div.account-user.edit').style.display = 'flex'
        document.querySelector('div.account-user.edit img').src = 'data:image/jpeg;base64,' + user.icon;
        document.querySelector('div.account-user.edit input.username').value = user.username
        if(!!user.email){document.querySelector('div.account-user.edit input.email').value = user.email}
        document.querySelector('div.account-user.edit input.password').value = ''
        console.log(new_pass)
        if(new_pass){
            document.querySelector('div.account-user.edit div  div.user-change label.lbl-newpassword').remove()
            document.querySelector('div.account-user.edit div  div.user-change input.newpassword').remove()
            let a = document.createElement('a')
            a.innerText='Mudar senha?'
            a.onclick=()=>{edit_password(); a.innerHTML=''}
            document.querySelector('div.account-user.edit div  div.user-change').appendChild(a)
            new_pass=false
        }

    }else{
        if(action=='save'){
            let username = document.querySelector('.user-change .username').value
            let email = document.querySelector('.user-change .email').value
            let password = document.querySelector('.user-change .password').value
            let new_password = null
            let change_i,change_u,change_p = null
            if(!!password){
                if(password.indexOf(' ')==-1){
                    if(username !=user.username){
                        change_u =true
                        u_change = new XMLHttpRequest
                        u_change.open('POST',"http://localhost:8082/change/username")
                        u_change.setRequestHeader('Authorization', "Bearer " + user.token)
                        u_change.setRequestHeader('Content-Type','application/json')
                        u_change.send(`{"username":"${username}","password":"${password}"}`)
                        u_change.onload =()=>{
                            if(u_change.status==401){aviso(document.querySelector('.user-content'),'Senha Incorreta','red',3000);
                            }else if(u_change.status==201){reauth();setTimeout(user_bar,400);aviso(document.querySelector('.user-content'),'Nome de Usuário alterado','green',4000)}
                        }

                    }console.log('icon',user.icon!=document.querySelector('img.fileimg').src,!!document.querySelector('img.fileimg').src,document.querySelector('img.fileimg').src)
                    if((user.icon)!=document.querySelector('img.fileimg').src.split(',')[1] && !!document.querySelector('img.fileimg').src){
                        console.log('icon')
                        change_i =true
                        let fileimg= document.querySelector('.inputimg').files
                        let boundary = (new Date()).getTime();
                        let blobFile = fileimg[0];
                        let formData = new FormData();
                        formData.append("password", password);
                        formData.append('file', fileimg[0], fileimg[0].name);
                        i_change = new XMLHttpRequest
                        i_change.open('POST',"http://localhost:8082/change/icon",true)
                        i_change.setRequestHeader('Authorization', "Bearer " + user.token)
                        i_change.setRequestHeader("data",formData)
                        i_change.send(formData);
                        i_change.onload=(e)=>{
                            if(i_change.status==201){reauth();setTimeout(user_bar,200);setTimeout(myaccount,200);aviso(document.querySelector('.user-content'),'Icone alterado','green',5000)}
                            else if(i_change.status==400){aviso(document.querySelector('.user-content'),'Nenhuma imagem enviada','red')}
                            else if(i_change.status==401){aviso(document.querySelector('.user-content'),'Senha Incorreta','red')}
                            else if(i_change.status==413){aviso(document.querySelector('.user-content'),'Tamanho passa do limite','red')}
                        }
                    }if(!!document.querySelector('.user-change .newpassword')){
                        change_p =true
                        new_password = document.querySelector('.user-change .newpassword').value
                        if(!!new_password){
                            if(new_password.indexOf(' ')==-1){
                                if(password==new_password){aviso(document.querySelector('.user-content'),'Senha antiga e nova são idênticas','red',4000)
                                }else{
                                    p_change = new XMLHttpRequest
                                    p_change.open('POST',"http://localhost:8082/change/password")
                                    p_change.setRequestHeader('Authorization', "Bearer " + user.token)
                                    p_change.setRequestHeader('Content-Type','application/json')
                                    p_change.send(`{"password":"${password}","newpassword": "${new_password}"}`)
                                    p_change.onload =()=>{
                                        console.log(p_change.status)
                                        if(p_change.status==401){aviso(document.querySelector('.user-content'),'Senha Incorreta','red',3000)
                                        }else{reauth();setTimeout(user_bar,200);setTimeout(myaccount,200);aviso(document.querySelector('.user-content'),'Senha alterada','green',5000)}
                                    }
                                }
                            }else{
                                aviso(document.querySelector('.user-content'),'Nova Senha contém espaços','red')
                            }
                        }else{
                            aviso(document.querySelector('.user-content'),'Nova Senha está vazia','red')
                        }
                    }else if(!change_i && !change_u &&!change_p){aviso(document.querySelector('.user-content'),'Nada para mudar','')}

                }else{aviso(document.querySelector('.user-content'),'Senha contém espaços','red')}
            }else{aviso(document.querySelector('.user-content'),'Senha está vazia','red')}
            
        }else if(action=='cancel'){
        }
        document.querySelector('div.account-user.edit').style.display = 'none'
        document.querySelector('div.account-user.i').style.display = 'flex'
        document.querySelector('div.account-user.i .username').innerText = user.username
        if(!!user.email){document.querySelector('div.account-user.i .email').innerText = user.email
        }else{document.querySelector('div.account-user.i .email').innerText ='Associe o e-mail!!!'}

    }
}
function edit_password(){
    document.querySelector('div.account-user.edit div  div.user-change a').innerHTML =''
    let label = document.createElement('label')
    label.className = 'lbl-newpassword'
    label.innerText = 'NOVA SENHA'
    let input = document.createElement('input')
    input.type = 'text'
    input.className = 'newpassword'

    document.querySelector('div.account-user.edit div  div.user-change').appendChild(label)
    document.querySelector('div.account-user.edit div  div.user-change').appendChild(input)
    new_pass = true
}

function logout(){
    request = new XMLHttpRequest
    request.open('POST',"http://localhost:8082/logout")
    request.setRequestHeader('Authorization', "Bearer " + user.token)
    request.setRequestHeader('Content-Type','application/json')
    request.send()
    request.onload =()=>{
        if(request.status=200){location.href = './login.html'}
    }
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
        div.remove()
    }
    elem.addEventListener('click',()=>{div.remove()})
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
function Friends(){
    this.to=()=>{
        
        document.querySelector('.message').style.justifyContent = ''
        document.querySelector('.send-message').innerHTML = ''
        document.querySelector('.send-message').style = ''
        document.querySelector('.message-content').innerHTML = ''
        document.querySelector('.navl-message').innerHTML = ''
        console.log(f_topic)
        if(f_topic=='pedidos'){this.pedidos()
        }else if(f_topic=='add'){this.add()
        }else if(f_topic=='bloqued'){this.bloqued()
        }else if(f_topic=='able'){this.able()
        }else{this.all()}
        document.querySelector('div.navl-friends').style.display = 'flex'
        document.querySelector('div.navr-friends').style.display = 'flex'
        document.querySelector('div.content.hiddable').style.display = 'none'
    }
    this.able=()=>{
        if(f_topic!='none'){reauth()}
        if(f_topic!='able'){f_topic='able'}
        let request = new XMLHttpRequest
        request.open("POST", "http://localhost:8082/friends")
        request.setRequestHeader('Authorization',"Bearer "+ user.token)
        request.send()
        request.onload= ()=>{
            let resp = JSON.parse(request.responseText)
            if(f_topic=='all'){}
            else{
                let message =document.querySelector('div.message-content')
                message.innerHTML = ''
                let topic_msg='ONLINE'
                let topic =document.createElement('label')
                topic.className='f lbl'
                topic.style.margin = '10px 0px 10px 20px'
                topic.style.color = 'white'
                topic.innerText = topic_msg
                message.appendChild(topic)
                if(resp.exist){
                    let count
                    let body = document.querySelector('body')
                    for(let friend in resp.list){
                        if(resp.list[friend].status!="offline"){
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
                            let status = document.createElement('img')
                            status.style.width = '14px'
                            status.style.height = '14px'
                            status.style.position= 'relative'
                            status.style.background='rgb(6, 77, 105)'
                            status.style.border= 'solid 2px rgb(6, 77, 105)'
                            status.style.borderRadius = '20px'
                            status.style.marginLeft = '-12px'
                            status.style.marginTop='22px'
                            status.src = '../image/'+resp.list[friend].status+'.png'
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
                            msg.onclick =()=>{
                                
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
                            div.appendChild(status)
                            div.appendChild(lbl)
                            div.appendChild(msg)
                            div.appendChild(opt)
                            message.appendChild(div)
                        count = Number(friend)+1
                        topic.innerText= topic.innerText+' - '+(count)
                    }
                }
            }
        }
    }
    }
    this.all = ()=>{
        if(f_topic!='none'){reauth()}
        if(f_topic!='all'){f_topic='all'}
        let request = new XMLHttpRequest
        request.open("POST", "http://localhost:8082/friends")
        request.setRequestHeader('Authorization',"Bearer "+ user.token)
        request.send()
        request.onload= ()=>{
            let resp = JSON.parse(request.responseText)
            let message =document.querySelector('div.message-content')
            message.innerHTML = ''
            let topic_msg='TODOS OS AMIGOS'
            let topic =document.createElement('label')
            topic.className='f lbl'
            topic.style.margin = '10px 0px 10px 20px'
            topic.style.color = 'white'
            topic.innerText = topic_msg
            message.appendChild(topic)
            if(resp.exist){
                let count = 0
                let body = document.querySelector('body')
                for(let friend in resp.list){
                    count+=1
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
                    let status = document.createElement('img')
                    status.style.width = '14px'
                    status.style.height = '14px'
                    status.style.position= 'relative'
                    status.style.background='rgb(6, 77, 105)'
                    status.style.border= 'solid 2px rgb(6, 77, 105)'
                    status.style.borderRadius = '20px'
                    status.style.marginLeft = '-12px'
                    status.style.marginTop='22px'
                    status.src = '../image/'+resp.list[friend].status+'.png'
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
                    msg.onclick =()=>{
                        let find = new XMLHttpRequest
                        find.open('POST','http://localhost:8082/conversa/new')
                        find.setRequestHeader('Authorization','Bearer '+user.token)
                        find.setRequestHeader('Content-Type','application/json')
                        find.send('{"to":["'+resp.list[friend].id+'"]}')
                        find.onload=()=>{
                            console.log(find.status)
                            if(find.status==409){
                                console.log(find.responseText,find.status)
                                let id = JSON.parse(find.responseText)['id']
                                let obj = JSON.parse(find.responseText)['obj']
                                conversa.to(obj._id,obj,false)
                            }else{
                                console.log(find.responseText,find.status)
                                let obj = JSON.parse(find.responseText)['obj']
                                conversa.con_add(obj,document.getElementsByClassName('option-cvs')[0].childElementCount)
                                document.querySelector('.message').style.justifyContent = 'flex-end'
                                conversa.to(obj._id,obj,false)
                            }
                        }
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
                    div.appendChild(status)
                    div.appendChild(lbl)
                    div.appendChild(msg)
                    div.appendChild(opt)
                    message.appendChild(div)
                }
                topic.innerText= topic.innerText+' - '+(count)
            }
        }
    }
    this.add=()=>{
        console.log('add()')
        if(f_topic!='none'){reauth()}
        if(f_topic!='add'){f_topic = "add"}
        let message =document.querySelector('div.message-content')
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
    }
    this.pedidos = ()=>{
        console.log('pedidos()')
        if(f_topic!='none'){reauth()}
        if(f_topic!='pedidos'){f_topic = "pedidos"}
        let request = new XMLHttpRequest
        request.open("POST", "http://localhost:8082"+"/pedidos")
        request.setRequestHeader('Authorization',"Bearer "+ user.token)
        request.send()
        request.onload= ()=>{
            let resp = JSON.parse(request.responseText)
            let message =document.querySelector('div.message-content')
            message.innerHTML = ''
            let topic =document.createElement('label')
            let topic_msg = 'TODOS OS PEDIDOS'
            topic.className='f lbl'
            topic.style.margin = '10px 0px 10px 20px'
            topic.style.color = 'white'
            topic.innerText = topic_msg
            message.appendChild(topic)
            if(resp.exist){
                let count = 0
                for(let friend in resp.list){
                    count+=1
                    console.log(count)
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
                console.log(count)
                topic.innerText= topic.innerText+' - '+(count)
            }
        }
    }
    this.bloqued = ()=>{console.log('bloqued()')
    if(f_topic!='none'){reauth()}
    if(f_topic!='bloqued'){f_topic = "bloqued"}
    let request = new XMLHttpRequest
    request.open("GET", "http://localhost:8082"+"/bloqueados")
    request.setRequestHeader('Authorization',"Bearer "+ user.token)
    request.send()
    request.onload= ()=>{
        if(request.status ==404){
        }else{
            let resp = JSON.parse(request.responseText)
            let message =document.querySelector('div.message-content')
            message.innerHTML = ''
            let topic =document.createElement('label')
            topic.className='f lbl'
            topic.style.margin = '10px 0px 10px 20px'
            topic.style.color = 'white'
            topic.innerText = 'TODOS OS BLOQUEADOS'
            message.appendChild(topic)
            if(resp.exist){
                let count
                for(let bloq in resp.list){
                    let div = document.createElement('div')
                    div.className = 'f div'
                    div.style.borderTop = 'solid 0.1px rgb(140,140,200)'
                    let icon = document.createElement('img')
                    icon.src = 'data:image/jpeg;base64,'+resp.list[bloq].icon
                    icon.style.margin = '5px 0px 5px 0px'
                    icon.style.borderRadius ='30px'
                    icon.style.width = '30px'
                    icon.style.height= '30px'
                    let lbl = document.createElement('label')
                    lbl.innerText = resp.list[bloq].username
                    lbl.style.margin = '10px 0px 0px 10px'
                    lbl.style.color ='white'
                    lbl.style.font = 'normal 12pt Arial'
                    lbl.style.fontWeight = 'bold'
                    lbl.style.flex = '1 1'
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
                        excluir.open("DELETE", "http://localhost:8082/bloqueado/delete")
                        excluir.setRequestHeader('Authorization',"Bearer "+ user.token)
                        excluir.setRequestHeader('Content-Type','application/json')
                        excluir.send(`{"to":"${resp.list[bloq].id}"}`)
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
}


let friends = new Friends