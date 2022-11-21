
const users = []

const addUser = ({id,username,room})=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!room && !username){
        return {error:"username and room are required"}
    }

    const existingUser = users.find((user)=>{
        return user.room == room && user.username == username
    })

    if(existingUser){
        return {error:"Username is already in use"}
    }

    const user = {id,username,room}
    users.push(user)
    return {user}

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id == id
    })
    if (index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
    const userOne = users.find((user)=>{
        return user.id == id
    })
    if(!userOne){
        return{
            error:"no user found"
        }
    }
    return userOne
}

const getUserInRoom = (room)=>{
    room = room.trim().toLowerCase()
    const userRoom = users.filter((user)=>{
        return user.room == room 
    })
    if(userRoom.length == 0){
        return {
            error: `No user found in ${room}`
        }
    }
    return userRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}