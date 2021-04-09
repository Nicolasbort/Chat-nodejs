<template>

    <div class="h-100">

      <ToastElement :toastMessage="toastMessage" :toastType="toastType" />

      <Login v-if="isLogin" @userLoginSubmit="handleLoginSubmit" />

      <Chat v-else :user="user"  @sendMessageRoot="sendMessageServer" @addNewContact="addNewContact"/>

    </div>

</template>

<script>
/* eslint-disable */ 

import io from "socket.io-client"
import Chat from './components/Chat'
import Login from './components/Login'
import ToastElement from './components/Toast.vue'

import { Toast } from 'bootstrap'
import EVENTS from '../../Events'


const serverURL = "http://localhost:3000"


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

            // Recebe informações sobre o usuário digitado no login
            this.socket.on(EVENTS.SEND_USER_DATA, user => {
                // Usuario já conectado
                if (!user)
                {
                    that.showToast("danger", `Usuario já conectado!`);
                    return;
                }

                that.user = user;
                that.isLogin = false;
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

            // Recebe a menssagem enviada em um grupo
            this.socket.on(EVENTS.RECEIVE_MESSAGE_GROUP, message => { 

                console.log("RECEIVE_MESSAGE_GROUP:")
                console.table(message);

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

            let Event = chatType == 'group' ? EVENTS.SEND_MESSAGE_GROUP : EVENTS.SEND_MESSAGE_PRIVATE;

            this.socket.emit(Event, newMessage);                
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