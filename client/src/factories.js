const uuid = require('uuid/v4');

const createUser = ( name="", genre="" ) => {
    return {
        id: uuid(),
        username: name,
        genre: genre
    }
}

const createMessage = ( msg="", sender="" ) => {
    return {
        id: uuid(),
        time: getTime(new Date(Date.now())),
        message: msg,
        sender: sender
    }
}


const createChat = ( messages = [], name = "Community", users = [] ) => {
    return {
        id: uuid(),
        name: name,
        messages: messages,
        users: users,
        typingUsers: []
    }
}


const getTime = (date) => {
    return `${date.getHours()}:${"0"+date.getMinutes().slice(-2)}`
}