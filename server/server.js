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

// Verifica se é admin e se for envia o evento de toast para o front contendo o tipo (success, warning, etc) e a mensagem 
function isAdmin(username, toastType, toastMessage, socket)
{
    if (username == "admin" || username == 'iago'){
        socket.emit(Events.SHOW_TOAST, {type: toastType, message:toastMessage})
        return true;
    }

    return false;
}


io.on('connection', socket => {
    // Socket conectado
    console.info(`Socket ${socket.id} inicializado. Usuário na tela de login.`)

    
    // Tentativa login no cliente
    socket.on(Events.USER_LOGIN, loginData => { 

        loginData.username = loginData.username.toLowerCase();

        //Se ele já ta conectado
        if(connectedUsers[loginData.username]){
            console.warn(`Usuário '${loginData.username}' já está logado!`)
            socket.emit(Events.SHOW_TOAST,  {type: "danger", message: `Usuário '${loginData.username}' já conectado!`} );
            return;
        }
        
        // Pega dados da database, se não existir cria novo usuário
        var user = database.getUserData(loginData.username);
        if(!user){

            if (!loginData.imageUrl){
                socket.emit(Events.SHOW_TOAST, {type: "warning", message: "Selecione um avatar"});
                return;
            }

            user = database.createUser(loginData.username, loginData.imageUrl);
            database.addUserGroup( loginData.username, "Todos" );

            //
            // Parte do ADMIN
            //
            let adminSocket = getSocketByUsername( "admin" );

            var contactInfo = { lastMessageDate: "", lastMessage: "", imageUrl: loginData.imageUrl, history: [] };
            database.addUserContact("admin", loginData.username, contactInfo)

            if (adminSocket)
                adminSocket.emit(Events.PUSH_CONTACT, loginData.username, contactInfo);
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


    // Remove um contato do usuário que chamou
    socket.on(Events.REMOVE_CONTACT, usernameContact => {
        // Pega o username do socket que chamou o evento
        var username = getUsernameBySocketId( socket.id );

        if (isAdmin(username, "warning", "Contato removido apenas visualmente!. O Admin não pode excluir contatos!", socket))
            return;

        console.log(`Removendo ${usernameContact} da lista de ${username}`);

        database.removeUserContact( username, usernameContact );
    });

    
    // Recebe a mensagem do usuário 'from' e envia para o usuário 'to' 
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
    

    // Cria grupo e adiciona os usuários selecionados
    socket.on(Events.CREATE_GROUP, (groupName, imageUrl, selectedUsers) => {

        console.log("SERVER: CREATE_GROUP");
        console.log(groupName, imageUrl, selectedUsers)
        /*newGroup = {
            groupName: 
            lastMessage:            "",
            lastMessageDate:        "",
            imageUrl:               imageUrl,
            history:                [],
            users:                  []
        }*/

        let usernameGroupCreator = getUsernameBySocketId( socket.id );

        database.createGroup( groupName, imageUrl, usernameGroupCreator );

        selectedUsers.push(usernameGroupCreator);
        selectedUsers.push("admin");

        console.table(selectedUsers);

        // Adiciona os usuários no grupos e atualiza o grupo para os conectados
        for(var user of selectedUsers){
            database.addUserGroup( user, groupName );
            
            socketUser = getSocketByUsername( user );
            if (socketUser)
                socketUser.join(groupName);
        }
        
        io.to(groupName).emit(Events.PUSH_GROUP, groupName, usernameGroupCreator, imageUrl);
    });


    // Remove um usuário de um grupo
    socket.on(Events.QUIT_GROUP, groupName => {
        // Pega o username do socket que chamou o evento
        var username = getUsernameBySocketId( socket.id );

        if (isAdmin(username, "warning", "Grupo removido apenas visualmente. O Admin não pode sair de grupos!", socket))
            return;

        console.log(`Server: Usuário '${username}' saindo do grupo '${groupName}'`)
        database.removeUserFromGroup(username, groupName);
    })


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
    });{
        
    }

    // Delete o grupo
    socket.on(Events.DELETE_GROUP, groupName => {
        let username = getUsernameBySocketId( socket.id );
        let group = database.getGroupData( groupName );

        // Verifica se o grupo ainda existe no database
        if (!group) {
            socket.emit(Events.SHOW_TOAST, { type:'info', message:`Grupo '${groupName}' não existe mais no database` })
            return;
        }

        // Verifica se o grupo selecionado é o grupo 'Todos'
        if (groupName == "Todos") {
            socket.emit(Events.SHOW_TOAST, { type: "danger",  message: `Grupo '${groupName}' não pode ser deletado!` } )
            return;
        }

        // Verifica se o usuário é dono do grupo
        if(username == group.owner) {
            database.deleteGroup(groupName);
            io.to(groupName).emit(Events.GROUP_DELETED, groupName);
            socket.emit(Events.SHOW_TOAST, { type: "success",  message: `Grupo '${groupName}' deletado!` } )
            return;
        }

            
        socket.emit(Events.SHOW_TOAST,  {type: "danger", message: `Você não é dono do grupo '${groupName}'!`} );
        database.saveFile();
    });
    


    socket.on(Events.RESET_DATABASE, () => {
        let username = getUsernameBySocketId( socket.id )

        if ( isAdmin(username, "success", `Database deletado!`, socket) ){
            database.resetDatabase();
            return;
        }
        
        socket.emit(Events.SHOW_TOAST, { type:"danger", message: `Usuário '${username}' não tem permissão para fazer isso!` });
    })


    // Ao deslogar do sistema remove da lista de conectados
    socket.on('disconnect', () => {
        let username = getUsernameBySocketId(socket.id)
        delete connectedUsers[username];
        console.log(`Usuário '${username}' desconectado`);
    })

});

// Listen do servidor
app.listen(port, () => { console.log(`Server listening at port ${port}`) })


