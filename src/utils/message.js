

const generateMessage = (text,username)=>{
    return {

        text,
        createdAt : new Date().getTime(),
        username
    }
}

const generateLocationTime = (location,username)=>{
    return {
        url:location,
        createdAt : new Date().getTime(),
        username
    }
}
module.exports = {
    generateMessage,
    generateLocationTime
}