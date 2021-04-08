const app           = require('http').createServer();
const io            = require('socket.io')(app)
const Events        = require('../Events');

// JSONDatabase
const Database      = require('./database/databaseController');
const database      = new Database('/database.json');
const port          = process.env.PORT || 3000;
const connectedUsers = {};

let userTemplate = {
    username: "",
    genre: "",
    socket: null
}


io.on('connection', socket => {
    console.info(`Socket ${socket.id} inicializado. Usuário na tela de login.`)

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
                console.warn(`Usuário '${data.username}' já está logado!`)
                socket.emit(Events.SEND_USER_DATA, false);
            }
            else
            {
                console.info(`Usuário ${data.username} não está logado!  Logando...`)
                success = true;
            }
        }
        else
        {
            console.info(`Criando usuário '${data.username}'`)
            user = database.createUser(data.username, data.genre, true);
            success = true;
        }

        if(success){
            userTemplate.username = user.username;
            userTemplate.genre    = user.genre;
            userTemplate.socket   = socket;

            connectedUsers[user.username] = { ...userTemplate};
            socket.emit(Events.SEND_USER_DATA, user);
            io.emit(Events.NEW_USER, user);
        }
    });


    socket.on('disconnect', () => {
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
        let socket_receiver = getSocketByUsername( data.to );

        // Usuario desconectado
        if (!socket_receiver)
        {
            console.log(`Usuario ${data.to} desconectado!`);
            return;
        }

        let data_to_send = {
            from: data.from,
            message: data.message,
            date: data.date
        } 

        socket_receiver.emit(Events.RECIEVE_MESSAGE_PRIVATE, data_to_send)

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