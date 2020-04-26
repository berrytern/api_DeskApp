
//console.log(document.querySelector('section').removeChild())
function att_users(users){
    for(user in users){
        console.log('user: ',user, users[user]) 
        let div = document.createElement('div')
        let btn = document.createElement('button')
        btn.innerText = user
        btn.onclick = ()=>{
            if(content.style.display == 'none'){
                content.style.display = 'block'
            }
            else{content.style.display ='none'}
        }
        let content = document.createElement('div')
        content.style.display='none'
        for(value in users[user]){
            let label = document.createElement('label')
            label.innerText=value
            let input = document.createElement('input')
            input.type = 'text'
            input.value = users[user][value]
            content.appendChild(label)
            content.appendChild(input)
        }
        let submit = document.createElement('button')
        submit.innerText = 'change'
        submit.onclick=()=>{console.log('change')}
        content.appendChild(submit)
        div.appendChild(btn)
        div.appendChild(content)
        document.querySelector('section').appendChild(div)
    }
}
function post(rota){
    console.log('clicked')
    request = new XMLHttpRequest
    request.open("POST",'http://localhost:8082/admin'+rota, true)
    request.setRequestHeader("Content-Type","application/json")
    request.setRequestHeader("Authorization","Bearer "+localStorage.getItem('token'))
    request.send()
    request.onload=(e)=>{
        if(request.status==200){
        document.querySelector('section').innerHTML=''
        let users= JSON.parse(request.responseText)
        console.log('/users deu certo')
        if(document.querySelector('section').children.length>0){
            att_users(users)
        }
        else{
            att_users(users)
        }
        
        }
    }

}
