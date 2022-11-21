const exp = require("constants")
const express = require("express")
const http = require("http")
const path = require("path")
const app = express()
const socketio = require("socket.io")
const {generateMessage,generateLocationTime} = require("./utils/message")
const {addUser,removeUser,getUser,getUserInRoom} = require("./utils/users")

const server = http.createServer(app)
const io = socketio(server)


port = process.env.PORT || 3000
directoryPath = path.join(__dirname,"../public")


app.use(express.static(directoryPath))


io.on("connection", (socket)=>{
    console.log("web connection");

    socket.on("join", ({username,room},callback)=>{
        const {error,user} = addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("message", generateMessage("welcome","Admin"))
        socket.broadcast.to(user.room).emit("message",generateMessage(`${user.username} has joined!`,"Admin"))
        io.to(user.room).emit("roomData", {
            room:user.room,
            users : getUserInRoom(user.room)
        })

        callback()
    })

    socket.on("msg", (msg,cb)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit("message",generateMessage(msg,user.username))
        cb()
    })

    socket.on("sendLocation",(location,cb)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit("LOCATION",generateLocationTime(`https://google.com/maps?q=${location.latitude},${location.longitude}`,user.username))
        cb()
    })

    socket.on("disconnect", ()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit("message",generateMessage(`a ${user.username} has left chat`,"Admin"))
            io.to(user.room).emit("roomData",{
                room:user.room,
                users : getUserInRoom(user.room)
            })
        }
    })
})

server.listen(port, ()=> console.log("running on port" + port ))