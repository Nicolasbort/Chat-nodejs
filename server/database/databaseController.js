const fs = require("fs");

class JSONDatabaseController
{
    constructor(filePath, autoLoad=true)
    {  
        this.data = {};
        this.filePath = __dirname + filePath;
        if(autoLoad){
            this.loadFile();
        }
    }

    loadFile()
    {
        this.data = JSON.parse(fs.readFileSync(this.filePath));
    }

    saveFile()
    {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data));
    }

    getUserData( username ) { return this.data.users[username]; }


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
        this.data.users[username].contacts[usernameContact] = contact;
        this.saveFile();
    }
    
    removeUserContact(username, usernameContact){
        delete this.data.users[username].contacts[usernameContact];
    }

    createGroup( groupName, imageUrl )
    {
        this.data.groups[groupName] = {
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



    

    // cria um grupo
    // ele adiciona o grupo no banco
    // adiciona o usuario no grupo
    // adiciona o grupo nos usuarios do grupo
}

module.exports = JSONDatabaseController;