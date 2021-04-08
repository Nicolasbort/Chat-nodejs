const io = require('./server').io


module.exports = function(socket) 
{
    console.log(`Socket ${socket.id} connected`);

    socket.on(Events.USER_CONNECTED, data => {
        // data = { username, genre }
        var user = database.getUserData(data.username);
        var sucess = false;
        if(user){
            if(!user.connected){
                database.setUserData(data.username, 'connected', true);
                sucess = true;
            }else{
                socket.emit(Events.SEND_USER_DATA, false);
            }
        }else{
            user = database.createUser(data.username, data.genre);
            sucess = true;
        }

        if(sucess){
            socket.emit(Events.SEND_USER_DATA, user);
            SocketIo.emit(Events.NEW_USER, user);
        }
        
    });
}