<template>

    <div class="h-100">

      <ToastElement :toastMessage="toastMessage" :toastType="toastType" />

      <Login v-if="isLogin" @userLoginSubmit="handleLoginSubmit" />

      <!-- <Chat v-else :socket="socket" :user="user" /> -->
      <Chat v-else :user="user"  @sendMessageRoot="sendMessageServer" @addNewContact="addNewContact"/>

    </div>

</template>

<script>
import io from "socket.io-client"
import Chat from './components/Chat'
import Login from './components/Login'
import ToastElement from './components/Toast.vue'
import { Toast } from 'bootstrap'

const serverURL = "http://localhost:3000"
const EVENTS = {
    //User events
    NEW_USER:                   "NEW_USER",
    USER_LOGIN:                 "USER_LOGIN",
    USER_LOGOUT:                "USER_LOGOUT",
    USER_DISCONNECTED:          "USER_DISCONNECTED",

    //Contatos
    ADD_CONTACT:                "ADD_CONTACT",
    PUSH_CONTACT:               "PUSH_CONTACT",
    
    //Message privada
    SEND_MESSAGE_PRIVATE:       "SEND_MESSAGE_PRIVATE",
    RECEIVE_MESSAGE_PRIVATE:    "RECEIVE_MESSAGE_PRIVATE",

    //Mensagem de grupo
    SEND_MESSAGE_GROUP:         "SEND_MESSAGE_GROUP",
    RECEIVE_MESSAGE_GROUP:      "RECEIVE_MESSAGE_GROUP",

    //Dados
    SEND_CHAT_STATE:            "SEND_CHAT_STATE",
    SEND_USER_DATA:             "SEND_USER_DATA",

    //Menssagens servidor
    SHOW_TOAST:                 "SHOW_TOAST",

    //Eventos de grupo  
    CREATE_GROUP:               "CREATE_GROUP",
    ADD_GROUP_MEMBER:           "ADD_GROUP_MEMBER",
}


export default {
    name: 'App',

    data() {
        return {
            socket:  null,
            isLogin: true,
            user:    {},

            toastMessage: "",
            toastType:    "",
        }
    },

    components: {
        Chat,
        Login,
        ToastElement,
    },

    created() {
        this.initSocket();
    },

    methods: {
        // Inicialização do socket
        initSocket() {
            var that = this;

            this.socket = io(serverURL, {transports:['websocket']});

            
            this.socket.on(EVENTS.SEND_USER_DATA, user => {
                // Usuario já conectado
                if (!user)
                {
                    that.showToast("danger", `Usuario já conectado!`);
                    return;
                }

                that.user = user;
                that.isLogin = false;

                console.table(user)
                console.table(user.groups);
            })

            // Recebe menssagem enviada por outro usuário
            this.socket.on(EVENTS.RECEIVE_MESSAGE_PRIVATE, message => { 

                // Criar um usuário anonimo caso o usuário que enviou não seja um contato do usuário recebedor
                if(!(message.from in this.user.contacts))
                {
                    this.user.contacts[message.from] = {
                        lastMessage: message.message,
                        lastMessageDate: message.lastMessageDate,
                        imageUrl: "0",
                        history: []
                    }
                }

                this.user.contacts[message.from].history.push(message); 
            });

            this.socket.on(EVENTS.RECEIVE_MESSAGE_GROUP, message => { 

                console.log("RECEIVE_MESSAGE_GROUP:")
                console.table(message);

                // let message = {
                //     from: this.user.username,
                //     to: this.nameChatAtual,
                //     message: msg,
                //     date: stringDate
                // }


                if(!(message.to in this.user.groups))
                {
                    this.user.groups[message.to] = {
                        lastMessage: message.message,
                        lastMessageDate: message.lastMessageDate,
                        imageUrl: "0",
                        history: []
                    }
                }

                this.user.groups[message.to].history.push(message); 
            });


            // Adiciona contato
            this.socket.on(EVENTS.PUSH_CONTACT, (usernameContact, contact) => { 

                if(usernameContact && contact)
                {
                    this.showToast("success", `Contato '${usernameContact}' adicionado!`);
                    this.user.contacts[usernameContact] = contact
                    return; 
                } 

                this.showToast("warning", `Falha ao adicionar. Contato não possui conta no App`);
            });


            this.socket.on(EVENTS.SHOW_TOAST, toast => { this.showToast( toast.type, toast.message ); });
            
        },

        //Envia mensagem pro servidor
        sendMessageServer(newMessage, chatType){
            if(chatType == 'group'){
                this.socket.emit(EVENTS.SEND_MESSAGE_GROUP, newMessage);
            }else{
                this.socket.emit(EVENTS.SEND_MESSAGE_PRIVATE, newMessage);
            }
        },
        
        //Cuida do login
        handleLoginSubmit(userInput){
            this.socket.emit(EVENTS.USER_LOGIN, userInput);
        },

        //Mostra toast
        showToast(type, text){

          this.toastMessage = text;
          this.toastType    = type;

          var toastElement = document.querySelector('.toast');
          const toast = new Toast(toastElement);
          toast.show();
        },

        addNewContact(username){
            this.socket.emit(EVENTS.ADD_CONTACT, username);
        }

    }
}
</script>