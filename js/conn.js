let ip
let getip = new XMLHttpRequest
getip.open('GET',"https://www.cloudflare.com/cdn-cgi/trace")
//getip.setRequestHeader('Access-Control-Allow-Origin', 'http://meuip.com')
//getip.setRequestHeader('Origin','http://meuip.com')
getip.send()
getip.onload = (e)=>{ip=getip.responseText.split('ip=')[1].split('ts')[0]}
let configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
let rtc=new RTCPeerConnection(configuration)
console.log(rtc,RTCPeerConnectionIceEvent)

let socket = io('http://localhost:3000',{query:{token:user.token}})

socket.emit('startshare')
window.addEventListener('beforeunload',()=>{socket.emit('loggout')},false)
socket.on('call',(to)=>{
    alert('aceitar')
})
socket.on('connected',(isso)=>{console.log('isso')})
socket.on('tologin',(isso)=>{location.href='./login.html';console.log('tologin')})
setup = {audio:true}
async function getaudio(msg){
    audio = await navigator.mediaDevices.getUserMedia(msg)
} 
function uptkskt(){
    socket.io.opts.query = {token: user.token}
}
