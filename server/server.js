const app           = require('http').createServer();
const io            = require('socket.io')(app)
const Events        = require('../Events');

// JSONDatabase
const Database      = require('./database/databaseController');
const database      = new Database('/database.json');
const port          = process.env.PORT || 3000;
var connectedUsers = {};


function getSocketByUsername(username)
{
    // Previnir erro 'Cannot read property 'socket' of undefined'
    if ( connectedUsers[username] )
        return connectedUsers[username].socket;
    
    return null;
}

function getUsernameBySocketId( socketId )
{
    var found = null;
    Object.keys(connectedUsers).forEach(function(key, index){
        if(connectedUsers[key].socket.id == socketId){
            found = key; 
        }
    });
    return found;
}

io.on('connection', socket => {
    // Socket conectado
    console.info(`Socket ${socket.id} inicializado. Usuário na tela de login.`)

    // Tentativa login no cliente
    socket.on(Events.USER_LOGIN, loginData => { 
        //Se ele já ta conectado
        if(connectedUsers[loginData.username]){
            console.warn(`Usuário '${loginData.username}' já está logado!`)
            socket.emit(Events.SHOW_TOAST,  {type: "danger", message: `Usuário ${loginData.username} já conectado!`} );
            return;
        }
        
        // Pega dados da database, se não existir cria novo usuário
        var user = database.getUserData(loginData.username);
        if(!user){
            user = database.createUser(loginData.username, loginData.imageUrl);
            database.addUserGroup( loginData.username, "Todos" );
        }

        // Atualiza usuários conectados
        connectedUsers[user.username] = {
            username: user.username,
            imageUrl: user.imageUrl,
            socket: socket
        };

        // Insere em seus grupos
        Object.keys(user.groups).forEach(function(key){
            socket.join(key);
        });

        // Envia o usuário para o cliente
        socket.emit(Events.SEND_USER_DATA, user);
    });

    
    // Tentavi de adição do contato
    socket.on(Events.ADD_CONTACT, contactUsername => {
        // Pega o username do socket que chamou o evento
        var username = getUsernameBySocketId( socket.id );
        // Procura contato na database
        var contactData = database.getUserData(contactUsername);

        if ( username == contactUsername) {
            socket.emit(Events.SHOW_TOAST,  {type: "info", message: `A solidão é complicada, mas você não pode adicionar você mesmo...`} );
            return;
        }

        // Se contato existe
        if (contactData)
        {
            var contact = { lastMessageDate: "", lastMessage: "", imageUrl: contactData.imageUrl, history: [] };
            // Insere na lista de contatos do socket que chamou o evento
            database.addUserContact(username, contactUsername, contact)
            // Envia para adicionar na lista de contatos do client
            socket.emit(Events.PUSH_CONTACT, contactUsername, contact);
            return;
        }
        // Enviar toast erro Contato nao existe
        socket.emit(Events.SHOW_TOAST,  {type: "danger", message: `Usuário '${contactUsername}' não existe!`} );
    });

    
    // Recebe a menssagem do usuário 'from' e envia para o usuário 'to' 
    socket.on(Events.SEND_MESSAGE_PRIVATE, newMessage => {
        console.log(`Message private from ${newMessage.from} to ${newMessage.to}`);
        // Encontra o socket do usuário 'to' 
        let socket_receiver = getSocketByUsername( newMessage.to );

        // Usuario desconectado
        if (!socket_receiver){
            socket.emit(Events.SHOW_TOAST,  {type: "info", message: `Usuário ${newMessage.to} está desconectado!`} );
            return;
        }
        
        // Envia mensagem para o usuário 'to'
        socket_receiver.emit(Events.RECEIVE_MESSAGE_PRIVATE, newMessage)
    });
    

    // Cria grupo
    socket.on(Events.CREATE_GROUP, (groupName, imageUrl, users) => {
        /*newGroup = {
            groupName: 
            lastMessage:            "",
            lastMessageDate:        "",
            imageUrl:               imageUrl,
            history:                [],
            users:                  []
        }*/
        database.createGroup( groupName, imageUrl );

        for(var user of users){
            database.addUserGroup( user, groupName );
            let socketUser = getSocketByUsername( user );
            socketUser.join(groupName);
        }
    });

    // Adiciona um membro no grupo
    socket.on(Events.ADD_GROUP_MEMBER, (groupName, username) => {
        database.addUserGroup( username, groupName );
        let socketUser = getSocketByUsername(username);
        socketUser.join(groupName);
    });    

    // Envia uma mensagem para um grupo
    socket.on(Events.SEND_MESSAGE_GROUP, newMessage => {
        console.table(newMessage);
        io.to(newMessage.to).emit(Events.RECEIVE_MESSAGE_GROUP, newMessage);
    });
    
    // Ao deslogar do sistema remove da lista de conectados
    socket.on('disconnect', () => {
        let username = getUsernameBySocketId(socket.id)
        delete connectedUsers[username];
        console.log(`Usuário '${username}' desconectado`);
    })

});

// Listen do servidor
app.listen(port, () => { console.log(`Server listening at port ${port}`) })


