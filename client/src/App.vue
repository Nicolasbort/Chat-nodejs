<template>

    <div class="h-100" id="mainAppDiv">
      <ToastElement :toastMessage="toastMessage" :toastType="toastType" />

      <Login v-if="isLogin" @userLoginSubmit="handleLoginSubmit" />

      <Chat v-else :user="user"  @sendMessageRoot="sendMessageServer" @addNewContact="addNewContact" @removeContactOrGroup="removeContactOrGroup" @deleteGroup="deleteGroup" @resetDatabase="resetDatabase" ref="chat"/>

      <CreateGroupModal id="modalCreateGroup" :contacts="user.contacts" @createGroup="createGroup"/>
    </div>

</template>

<script>
import io from "socket.io-client"
import Chat from './components/Chat'
import Login from './components/Login'
import ToastElement from './components/Toast.vue'
import CreateGroupModal from './components/CreateGroupModal.vue'

import { Toast, Modal } from 'bootstrap'
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

            createGroupModal: {},
            createToast:      {},
        }
    },

    components: {
        Chat,
        Login,
        ToastElement,
        CreateGroupModal,
    },

    created() {
        this.initSocket();
    },

    mounted() {
        this.createGroupModal = new Modal(document.getElementById('modalCreateGroup'), {})
        this.createToast      = new Toast(document.querySelector('.toast'), {});
    },

    methods: {

        // Inicialização do socket
        initSocket() {
            var that = this;

            this.socket = io(serverURL, {transports:['websocket'], upgrade: false});

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

            // Recebe mensagem enviada por outro usuário
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

                // Acerta o scroll da caixa de mensagens atual
                var nameChatAtual = this.$refs.chat.nameChatAtual;
                var messageDiv = this.$refs.chat.$refs.divMessages;

                if(nameChatAtual == message.from)
                    messageDiv.scrollTop = messageDiv.scrollHeight;
        
                
                this.user.contacts[message.from].history.push(message); 
                this.user.contacts[message.from].lastMessage = message.message;
                this.user.contacts[message.from].lastMessageDate = message.date;

                if(message.from != nameChatAtual)
                    this.user.contacts[message.from]["showPill"] = true;
                
                console.log("Received")
                console.table(message);
            });

            // Recebe a mensagem enviada em um grupo
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

                var nameChatAtual = this.$refs.chat.nameChatAtual;
                if(message.to != nameChatAtual)
                    this.user.groups[message.to]["showPill"] = true;

                this.user.groups[message.to].history.push(message); 
                this.user.groups[message.to].lastMessage = `${message.from.charAt(0).toUpperCase() + message.from.slice(1)}: ${message.message}`;
                this.user.groups[message.to].lastMessageDate = message.date;
            });


            // Adiciona contato
            this.socket.on(EVENTS.PUSH_CONTACT, (usernameContact, contact) => { 

                if(usernameContact && contact)
                {
                    this.showToast("success", `Contato '${usernameContact}' adicionado!`);
                    this.user.contacts[usernameContact] = contact
                    this.$refs.chat.inputTextNewContact = "";   
                    return; 
                } 

                this.showToast("warning", `Falha ao adicionar. Contato não possui conta no App`);
            });



            this.socket.on(EVENTS.PUSH_GROUP, (groupname, groupowner, imageUrl) => {
                this.showToast('info', `Grupo '${groupname}' foi criado e você foi adicionado!`);

                if(groupowner == this.user.username)
                    document.getElementById("btnCloseModal").click();
    

                this.user.groups[groupname] = {
                    lastMessage:     "",
                    lastMessageDate: "",
                    imageUrl:        imageUrl,
                    history:         []
                }
            })

            this.socket.on(EVENTS.GROUP_DELETED, groupname => {
                delete this.user.groups[groupname];

                this.$refs.chat.nameChatAtual = "";
                this.showToast( 'info', `Grupo '${groupname} foi excluido!'` )
            });


            this.socket.on(EVENTS.SHOW_TOAST, toast => { this.showToast( toast.type, toast.message ); });
            
        },

        //Envia mensagem pro servidor
        sendMessageServer(newMessage, chatType){

            let Event = chatType == 'groups' ? EVENTS.SEND_MESSAGE_GROUP : EVENTS.SEND_MESSAGE_PRIVATE;

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

          this.createToast.show();
        },

        addNewContact(username){
            this.socket.emit(EVENTS.ADD_CONTACT, username);
        },
        
        removeContactOrGroup( name, chatType )
        {
            let Event = chatType == 'contacts' ? EVENTS.REMOVE_CONTACT : EVENTS.QUIT_GROUP;
            
            this.socket.emit(Event, name);
        },

        createGroup( groupname, imageUrl, selectedUsers )
        {
            this.socket.emit(EVENTS.CREATE_GROUP, groupname, imageUrl, selectedUsers)
        },

        deleteGroup ( groupname ){
            this.socket.emit(EVENTS.DELETE_GROUP, groupname)
        },

        resetDatabase(){
            this.socket.emit(EVENTS.RESET_DATABASE);
        }

    }
}
</script>