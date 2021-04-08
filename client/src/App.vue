<template>

  <Login v-if="isLogin" :socket="socket" :setUser="setUser" @userLoggedIn="switchToChat" />

  <Chat v-else :socket="socket" :user="user" />

</template>

<script>
import io from "socket.io-client"

import Chat from './components/Chat'
import Login from './components/Login'


const Events = {
    USER_LOGIN:"USER_LOGIN",
    USER_DISCONNECTED: "USER_DISCONNECTED",
    MESSAGE_SENT: "MESSAGE_SENT",
    MESSAGE_RECIEVED: "MESSAGE_RECIEVED",
    SEND_MESSAGE_PRIVATE: "SEND_MESSAGE_PRIVATE",
    RECIEVE_MESSAGE_PRIVATE: "RECIEVE_MESSAGE_PRIVATE",
    SEND_CHAT_STATE: "SEND_CHAT_STATE",
    USER_LOGOUT: "USER_LOGOUT",
    VERIFY_USER: "VERIFY_USER",
    SEND_USER_DATA:"SEND_USER_DATA",
    NEW_USER: "NEW_USER",
}

const serverURL = "http://localhost:3000"

export default {
    name: 'App',

    data() {
        return {
            socket: null,
            isLogin: true,
            user: null,
            // Teste:
            // isLogin: false,
            // user: {
            //     username: "iago",
            //     genre: "user-man"
            // }
        }
    },

    components: {
        Chat,
        Login,
    },

    created() {
        this.initSocket();

        this.socket.on(Events.SEND_USER_DATA, data => {
            console.log(`Send User Data ${data}`)
        })
    },

    methods: {
        initSocket() {
            this.socket = io(serverURL, {transports:['websocket']});

            this.socket.on('connect', () => {
                console.log("Conncted");
            })
        },


        setUser( user ) {
            this.user = user;
        },


        logout() {
            this.socket.emit(Events.LOGOUT);

            this.user = null;
        },

        switchToChat() {
            this.isLogin = false;
        }

    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
