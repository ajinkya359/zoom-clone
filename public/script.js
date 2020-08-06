
const socket=io('/')

const myVideo=document.createElement('video')
let videoGrid=document.getElementById('video-grid')

myVideo.muted=true

var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'5000'
}); 


let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true ,
    audio:true
}).then(stream=>{ 
    myVideoStream=stream
    addVideoStream(myVideo,stream)

    peer.on('call',call=>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })

    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream)
    })   
    
    
    
})

let userid
peer.on('open',id=>{
    userid=id
    socket.emit('join-room',ROOM_ID,id);
})


const connectToNewUser=(userId,stream)=>{
    const call = peer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream', userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
} 


const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}

let msg = document.getElementById('chat_message')
msg.addEventListener('keydown',(e)=>{
    if(e.which==13 && e.target.value.length !==0 ){
        console.log(e.target.value)
        socket.emit('message',e.target.value,ROOM_ID,userid)
        e.target.value=''
    }
})


socket.on("createMessage",(message,userId)=>{
    console.log(message)

    var messages=document.getElementById('messages')
    messages.innerHTML+=(`<li><strong>user:</strong>${message}</li>`)
    scrollToBottom()
})

const scrollToBottom=()=>{
    var messages=document.getElementById('messages')
    messages.scrollTop
}


const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false
        setUnmuteButton();
    }
    else{
        setMuteButton()
        myVideoStream.getAudioTracks()[0].enabled=true
    }
}

const setMuteButton=()=>{
    const html=`
    <i class="fas fa-microphone"></i>
    <span>Mute</span>`
    document.querySelector('.main__mute__button').innerHTML=html
}

const setUnmuteButton=()=>{
    const html=`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`
    document.querySelector('.main__mute__button').innerHTML=html
}

const playStop=()=>{
    let enabled=myVideoStream.getAudioTracks()[0].enabled
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false
        setPlayVideo()
    }
    else{
        setStopVideo()
        myVideoStream.getAudioTracks()[0].enabled=true
    }
}

const setStopVideo=()=>{
    const html=`
    <i class="fas fa-video></i>
    <span>Stop Video</span>"`
    document.querySelector(".main__video__button").innerHTML=html
}

const setPlayVideo=()=>{
    const html=`
    <i class="stop fas fa-video-slash></i>
    <span>Play Video</span>"`
    document.querySelector(".main__video__button").innerHTML=html
}
