const express=require('express')
const app=express()
const PORT=5000
const {v4:uuidv4}=require('uuid')
const server=require('http').Server(app)
const io=require('socket.io')(server)
const {ExpressPeerServer}=require('peer')
const peerServer=ExpressPeerServer(server,{
    debug:true
})

app.set('view engine','ejs')
app.use(express.static('public'))

app.use('/peerjs',peerServer)
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})


server.listen(PORT,()=>{
    console.log(`Server Started on port ${PORT}`)
});

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        console.log(userId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
    })
    socket.on('message', (message,roomId,userId)=>{
        io.to(roomId).emit('createMessage',message,userId)
    })
})