const app           = require('http').createServer();
const io            = require('socket.io')(app)
const Events        = require('../Events');

// JSONDatabase
const Database      = require('./database/databaseController');
const database      = new Database('/database.json');
const port = process.env.PORT || 3000;
const connectedUsers = {};

let userTemplate = {
    username: "",
    genre: "",
    socket: null
}


io.on('connection', socket => {
    console.log(`Socket ${socket.id} connected`);

    //
    // @params Username && Genre
    //
    socket.on(Events.USER_LOGIN, data => {

        if (!data.username || !data.genre) {
            console.log(`Username ou Genero vazios! Username: ${data.username}. Genere: ${data.genre}`);
            return;
        }

        var user = database.getUserData(data.username);
        var success = false;
        
        if(user)
        {
            if(connectedUsers[data.username])
            {
                console.log("Usuario já esta logado")
                socket.emit(Events.SEND_USER_DATA, false);
            }
            else
            {
                console.log("Usuario não esta logado")
                success = true;
            }
        }
        else
        {
            console.log("Criando usuario ", data.username)
            user = database.createUser(data.username, data.genre, true);
            success = true;
        }

        if(success){
            database.setUserData(user.username, "connected", true);

            userTemplate.username = user.username;
            userTemplate.genre    = user.genre;
            userTemplate.socket   = socket;

            connectedUsers[user.username] = userTemplate;
            socket.emit(Events.SEND_USER_DATA, user);
            io.emit(Events.NEW_USER, user);

            console.log(connectedUsers[user.username].socket.id);
        }
    });


    socket.on('disconnect', () => {

        console.log(`Socket id ${socket.id} disconnecting`)

        for (const [username, data] of Object.entries(connectedUsers))
        {
            if (data.socket.id == socket.id)
            {
                database.setUserData(username, "connected", false);

                console.log(`Usuário '${username}' desconectando`);
                delete connectedUsers[username];
            }
        }
    })

    
    //
    //  @params From && To && Message && Date
    //
    socket.on(Events.SEND_MESSAGE_PRIVATE, data => {
        
        console.log(`Message private from ${data.from} to ${data.to}`);

        // let socket_sender   = getSocketByUsername( data.from );
        let socket_reciever = getSocketByUsername( data.to );

        // Usuario desconectado
        if (!socket_reciever)
        {
            console.log(`Usuario ${data.to} desconectado!`);
            return;
        }

        let data_to_send = {
            from: data.from,
            message: data.message,
            date: data.date
        } 

        socket_reciever.emit(Events.RECIEVE_MESSAGE_PRIVATE, data_to_send)

    });
});


app.listen(port, () => { console.log(`Server listening at port ${port}`) })



function getSocketByUsername(username)
{
    for (const [usr, data] of Object.entries(connectedUsers))
    {
        if (usr == username)
        {
            return data.socket
        }
    }
}