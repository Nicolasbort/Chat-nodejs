const fs = require("fs");

class DatabaseInterface
{

    constructor(databaseName)
    {
        this.databaseName = __dirname + databaseName;

        this.read();
    }

    getAllUsers()
    {
        return this.currentData;
    }

    getUserByUsername( username )
    {
        return this.currentData.users[username];
    }

    getLastUsername()
    {
        return this.currentData.lastUsername;
    }

    updateUserSocket( username, socketId)
    {
        this.currentData.users[username].socket = socketId;
        fs.writeFileSync(this.databaseName, JSON.stringify(this.currentData) );
    }
    

    add( data = {} )
    {
        console.log("Database add");
        console.table(data);
        if (!data) throw Error("Data to add is empty");

        this.currentData.users[data.username] = {
            genre: data.genre,
            groups: data.groups
        }

        fs.writeFileSync(this.databaseName, JSON.stringify(this.currentData) );
    }


    read()
    {
        this.currentData = JSON.parse( fs.readFileSync(this.databaseName, 'utf-8') );
    }


    update( data = {} )
    {
        if (!data) throw Error("Data to update is empty");

        this.currentData.users[data.username] = {
            genre: data.genre,
            groups: data.groups
        }

        fs.writeFileSync(this.databaseName, JSON.stringify(this.currentData) );
    }


    delete( username )
    {
        if (!username) throw Error("Username to delete is empty");

        delete this.currentData.users[username];

        fs.writeFileSync(this.databaseName, JSON.stringify(this.currentData) );
    }
}


module.exports = DatabaseInterface;