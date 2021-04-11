const fs = require("fs");

class JSONDatabaseController
{
    constructor(filePath, autoLoad=true)
    {  
        this.data = {};
        this.filePath = __dirname + filePath;
        
        if(autoLoad)
            this.loadFile();
    }

    loadFile()
    {
        this.data = JSON.parse(fs.readFileSync(this.filePath));
    }

    saveFile()
    {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4));
    }

    getUserData( username ) { return this.data.users[username]; }

    getGroupData( groupName ) { 
        console.log(`> Database: Retornando grupo '${groupName}'`);
        return this.data.groups[groupName]; 
    }

    createUser(username, imageUrl)
    {
        this.data.users[username] = {
            username: username,
            imageUrl: imageUrl,
            contacts: {},
            groups: {}
        };

        this.saveFile();

        return this.data.users[username];
    }

    addUserContact( username, usernameContact, contact )
    {
        console.log(`> Database: Usuário '${username}' adicionando '${usernameContact}' aos contatos`)

        this.data.users[username].contacts[usernameContact] = contact;
        this.saveFile();
    }
    
    removeUserContact(username, usernameContact){
        console.log(`> Database: Usuário '${username}' removendo '${usernameContact}' dos contatos`)

        delete this.data.users[username].contacts[usernameContact];

        this.saveFile();
    }

    createGroup( groupName, imageUrl, ownerUsername = "admin" )
    {
        console.log(`> Database: Grupo '${groupName}' criado com avatar '${imageUrl}'`)

        this.data.groups[groupName] = {
            owner:                  ownerUsername,
            lastMessage:            "",
            lastMessageDate:        "",
            imageUrl:               imageUrl,
            history:                [],
            users:                  []
        }

        this.saveFile();
    }

    addUserGroup( username, groupName )
    {
        console.log(`> Database: Usuário '${username}' entrando no grupo '${groupName}'`)

        var group = this.data.groups[groupName];

        if(!group.users.includes(username)) { group.users.push(username); }

        this.data.users[username].groups[groupName] = {
            lastMessageDate:   group.lastMessage,
            lastMessage:       group.lastMessageDate,
            imageUrl:          group.imageUrl,
            history:           group.history
        }
        this.saveFile();
    }

    removeUserFromGroup( username, groupName )
    {
        if (username == "admin") return; 
        
        console.log(`> Database: Usuário '${username}' saindo do grupo '${groupName}'`)

        delete this.data.users[username].groups[groupName]

        let userIndex = this.data.groups[groupName].users.indexOf( username )

        if (userIndex != -1){
            this.data.groups[groupName].users.splice(userIndex, 1);

            if(this.data.groups[groupName].users.length <= 1)
                delete this.data.groups[groupName];
            
            
            this.saveFile();
            return;
        }

        console.log(`> Database: Usuário '${username}' não está no grupo '${groupName}'`)
    }

    deleteGroup( groupName )
    {
        for(var username of this.data.groups[groupName].users)
            delete this.data.users[username].groups[groupName];
        
        delete this.data.groups[groupName];

        this.saveFile();
    }
    
    resetDatabase()
    {
        let databaseTemplatePath = __dirname + '/_databaseTemplate.json';
        let template = JSON.parse(fs.readFileSync(databaseTemplatePath));

        this.data = template
        this.saveFile();
    }
}

module.exports = JSONDatabaseController;