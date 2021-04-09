<template>
    <!--MainContainer-->
    <div class="container mt-10">

        <!--Row-->
        <div class="row rounded shadow mt-5 h-100">
          <!--Col Contacts-->
          <div class="col-3 border-end p-0  mh-100 d-flex flex-column">
            <div class="p-3 bg-green text-white d-flex align-items-center">
              <img :src="require(`../assets/avatar_${user.imageUrl}.png`)" alt="User image" style="width:32px;height:32px;">
              <div class="ms-3">
                <h5 class="mb-0"> {{ user.username }} </h5>
              </div>
            </div>
            <div class="p-3 d-flex flex-column overflow-auto mh-100">
              <!--Add Contact-->
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Adicionar contato..." v-model="inputTextNewContact" ref="inputText">
                <button class="btn btn-outline-green" type="button" v-on:click="addNewContact()" ref="buttonSend">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
              <!--Contacts List-->
              <ul class="list-group flex-fill overflow-auto mh-100">

                <GroupList
                v-for="(group, groupname) in user.groups"
                :key="groupname"
                :isActive="groupname == nameChatAtual"
                :groupname="groupname"
                :lastMessage="group.lastMessage" 
                :lastMessageDate="group.lastMessageDate" 
                :imageUrl="group.imageUrl"
                @clickLi="changeCurrentChatGroup"
                />

                <ChatList 
                v-for="(contact, username) in user.contacts" 
                :key="username" 
                :isActive="username == nameChatAtual"
                :username="username" 
                :lastMessage="contact.lastMessage" 
                :lastMessageDate="contact.lastMessageDate" 
                :imageUrl="contact.imageUrl"
                @clickLi="changeCurrentChatContact"
                @addNewContactButton="addNewContact"
                />
                

              </ul>
            </div>
          </div>
          <!--Col Messages-->
          <div class="col-9 p-3 d-flex flex-column mh-100">
            <!--Messages-->
            <div class="flex-fill overflow-auto  mh-100" ref="divMessages">
              <!--Sent message-->

              <div v-if="chatType == 'group' && user.groups[nameChatAtual]">
                  <div v-for="(message, index) in user.groups[nameChatAtual].history" :key="index">
                  
                      <ChatOutgoing v-if="message.from == user.username" :message="message.message" :lastMessageDate="message.date" />

                      <ChatIncoming v-else :message="message.message" :lastMessageDate="message.date" :isGroup="true" :from="message.from"/>

                  </div>  
              </div>
              
              <div v-else-if="chatType == 'contact' && user.contacts[nameChatAtual]" > 
                  <div v-for="(message, index) in user.contacts[nameChatAtual].history" :key="index">
                  
                      <ChatIncoming v-if="message.to == user.username" :message="message.message" :lastMessageDate="message.date" :isGroup="false" from=""/>

                      <ChatOutgoing v-else :message="message.message" :lastMessageDate="message.date" />

                  </div>  
              </div>
                
            </div>
            <!--Input-->
            <ChatInput @sendMessage="sendMessageChat" :isDisabled="nameChatAtual.length == 0"/>
          </div>
        </div>
    </div>
</template>

<script>
import ChatIncoming from "./ChatIncoming";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import ChatOutgoing from './ChatOutgoing.vue';
import GroupList from './GroupList.vue';

export default {
    name: 'Chat',
    props: {
      user: Object
    },


    data() {
      return {
        inputTextNewContact: "",
        nameChatAtual: "",
        chatType: ""
      }
    },

    components: {
      ChatIncoming,
      ChatOutgoing,
      ChatList,
      ChatInput,
      GroupList
    },

    methods: {
        // Muda o contato aberto
        changeCurrentChatContact( username ) { 
          this.nameChatAtual = username 
          this.chatType = 'contact';
        },

        changeCurrentChatGroup( groupname ) { 
          this.nameChatAtual = groupname;
          this.chatType = 'group';
        },

        // Envia a menssagem para o contato aberto
        sendMessageChat(msg)
        {
            console.log(`${msg} from ChatInput`)

            let date = new Date();
            let stringDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}` 

            let newMessage = {
                from: this.user.username,
                to: this.nameChatAtual,
                message: msg,
                date: stringDate
            }

            this.insertHistoryMessage(newMessage);

            if(this.chatType == 'group'){
              this.$parent.user.groups[this.nameChatAtual].lastMessage       = msg
              this.$parent.user.groups[this.nameChatAtual].lastMessageDate   = stringDate
            }else{
              this.$parent.user.contacts[this.nameChatAtual].lastMessage     = msg
              this.$parent.user.contacts[this.nameChatAtual].lastMessageDate = stringDate
            }

            this.$emit('sendMessageRoot', newMessage, this.chatType);
        },


        // Insere 'newMessage' no 'history' de pra quem enviada a msg
        insertHistoryMessage(newMessage)
        {
            console.log("New message:");
            console.table(newMessage)
            // Se a mensagem estiver vazia
            if (!newMessage) return;

            // Username do usuário para quem enviou a msg
            var contactUserTo = newMessage.to;

            // Adiciona ao histórico do usuário para quem envivou a msg
            if(this.chatType == 'contact'){
              this.$parent.user.contacts[this.nameChatAtual].history.push(newMessage);
            }

            // Se for o usuário que está aberto, dê o scroll para baixo
            if(contactUserTo == this.nameChatAtual){
              this.$refs.divMessages.scrollTop = this.$refs.divMessages.scrollHeight;
            }
        },

        // Adiciona um novo contato a lista
        addNewContact(username = null)
        {
          this.inputTextNewContact = username || this.inputTextNewContact

          if(!this.inputTextNewContact) return;

          if (this.userExists( this.inputTextNewContact ))
          {
            var newContact = this.user.contacts[this.inputTextNewContact];
            if(newContact.imageUrl == '0'){ this.deleteContact(this.inputTextNewContact); }
          }

          this.$emit('addNewContact', this.inputTextNewContact);      
        },

        // Gera a estrutura de um novo contato
        createContact( imageUrl, lastMessageDate = "", lastMessage = "", history = [] )
        {
          return {
            lastMessageDate: lastMessageDate,
            lastMessage: lastMessage,
            imageUrl: imageUrl,
            history: history
          }
        },

        // Remove um contato
        deleteContact(username) { delete this.user.contacts[username]; },  

        // Verifica existência de contato na lista de contatos
        userExists(username) { 
          return (username in this.user.contacts); 
        }

    }
}
</script>



<style>

  .overflow-auto::-webkit-scrollbar {
    width: 10px;
  }
  
  .overflow-auto::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px #2a9d8f50;
  }
  
  .overflow-auto::-webkit-scrollbar-thumb {
    border-radius: 15px;
    background-color: #2a9d8f;
  }

  .bg-light {
    background-color: #ebebeb !important;
  }

  .btn:focus {
    box-shadow: 0 0 0 0.25rem #2a9d8f50 !important;
  }

  .btn-outline-green{
    border-color: #2a9d8f !important;
    color: #2a9d8f !important;
  }

  .btn-outline-green:hover{
    background-color: #2a9d8f !important;
    border-color: white !important;
    color: white !important; 
  }

  .btn-outline-green:active:focus {
      box-shadow: 0 0 0 0.25rem #2a9d8f !important;
  }

  .btn-outline-green:active{
    background-color: #2a9d8f !important;
  }


  .btn-ouline-green:focus{
    box-shadow: 0 0 0 0.25rem #2a9d8f50 !important;
  }

  .border-green{
    border-color: #2a9d8f !important;

  }
  .text-green{
    color: #2a9d8f !important;

  }
  .bg-green {
    background-color: #2a9d8f !important;
  }

  small {
    font-size: 0.75rem !important;
  }

  .container {
    height: 100%;
  }
</style>