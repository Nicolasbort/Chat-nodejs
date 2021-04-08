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

    getUserData(userId)
    {
        return this.data.users[userId];
    }

    setUserData(username, key, value)
    {
        this.data.users[username][key] = value;
        this.saveFile();
    }

    createUser(userName, userGenre, userConnected)
    {
        this.data.users[userName] = {
            username: userName,
            genre: userGenre,
            connected: userConnected,
        };
        this.saveFile();
        console.log(this.data.users[userName]);
        return this.data.users[userName];
    }
}

module.exports = JSONDatabaseController;