const express   = require('express');
const session   = require('express-session');
const app       = express();
const Http      = require("http").Server(app);
const SocketIo  = require("socket.io")(Http);
const cors      = require('cors');
const db        = require('./database/IDatabase');
const { Socket } = require('dgram');
const database  = new db('/database.json')


const port = 3000;


app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(session({secret:'XASDASDA'}))

app.use("/", require('./routes/user') );


let connectedUsers = {};

SocketIo.on('connection', socket => {
    console.log(`Client connected ${socket.id}`);

    connectedUsers[socket.id] = socket;

    let lastUsername = database.getLastUsername();
    database.updateUserSocket(lastUsername, socket.id);
    let userInfo = database.getUserByUsername( lastUsername );

    console.log("Table");
    console.table(userInfo);

    socket.on('new-incoming-msg', data => {
        console.log("new-incoming-msg")

        let friend = database.getUserByUsername(data.friend);
        let socketId = friend.socket;
        
        if (socketId in connectedUsers)
        {
            let socket = connectedUsers[socketId];

            socket.emit('new-outgoing-msg', data);
        }
        else
        {
            console.log("Friend disconnected");
        }


        // console.log(friend)
        // console.log(socket)

        // console.table(data);
    })

    socket.on('receive-message', data => {
        console.log(data);
    })
})


app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
})

Http.listen(4000, () => {
    console.log(`Socket io listening at port 4000`)
})