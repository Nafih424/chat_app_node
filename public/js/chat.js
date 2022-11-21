
const socket = io()
const $messages = document.querySelector("#messages")

// templates
const messagetemplate = document.querySelector("#message-template").innerHTML
const locationtemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix : true})

const autoScroll = ()=>{
    $messages.scrollTop = $messages.scrollHeight
}
socket.on("message", (msg)=>{
    console.log(msg);
    const html = Mustache.render(messagetemplate, {
        message:msg.text,
        createdat: moment(msg.createdAt).format("h:mm a"),
        username:msg.username
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoScroll()
})

socket.on("roomData", ({room,users})=> {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector("#sidechat").innerHTML = html
})

socket.on("LOCATION", (location)=>{
    console.log(location);
    const url = Mustache.render(locationtemplate, {
        location:location.url,
        createdat:moment(location.createdAt).format("h:mm a"),
        username:location.username
    })
    $messages.insertAdjacentHTML("beforeend", url)
    autoScroll()
})




const search = document.querySelector("#message-form")
search.addEventListener("submit",(e)=>{
    e.preventDefault()
    document.querySelector("button").setAttribute("disabled","disabled")
    const message = document.querySelector("input").value
    
    socket.emit("msg",message, ()=>{
        console.log("message delivered");
        document.querySelector("button").removeAttribute("disabled")
        document.querySelector("input").value = ""
        document.querySelector("input").focus()
    })
})

document.querySelector("#sendLocation").addEventListener("click", ()=>{
    document.querySelector("#sendLocation").setAttribute("disabled","disabled")
    if(!navigator.geolocation){
        return alert("location is not spported by the browser")
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        const location = {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
        socket.emit("sendLocation", location, ()=>{
            console.log("location shared");
            document.querySelector("#sendLocation").removeAttribute("disabled")
        })

    })
})

socket.emit("join", {username,room}, (error)=>{
    if(error){
        alert(error)
        location.href = "/"
    }
})  