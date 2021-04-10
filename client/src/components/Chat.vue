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
              <h5 class="mb-0"> 
                {{ user.username }} 
              </h5>
            </div>
          </div>
          <div class="p-3 d-flex flex-column overflow-auto mh-100">
            <!--Group List-->
            <h5>Grupos</h5>
            <!--Create group-->
            <button class="btn btn-outline-green w-full mb-3" type="button" data-bs-toggle="modal" data-bs-target="#modalCreateGroup">
              Criar grupo <i class="fa fa-plus"></i>
            </button>
            <!--List-->
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
            </ul>

            <!--Contacts List-->
            <h5 class="mt-4">Contatos</h5>
            <!--Add Contact-->
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Adicionar contato..." v-model="inputTextNewContact" ref="inputText">
              <button class="btn btn-outline-green" type="button" v-on:click="addNewContact()" ref="buttonSend">
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <!--List-->
            <ul class="list-group flex-fill overflow-auto mh-100">
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
        <div class="col-9 p-0 d-flex flex-column mh-100">

          <!-- Informacoes do usuário clicado -->
          <div v-if="nameChatAtual.length > 0" class="p-3 bg-green text-white d-flex justify-content-between align-items-center">
            <div class=" align-items-center" style="display: inherit">
              <img :src="require(`../assets/${chatType == 'contacts' ? 'avatar' : 'group'}_${user[chatType][nameChatAtual].imageUrl}.png`)" alt="User image" style="width:32px;height:32px;">
              <div class="ms-3">
                <h5 class="mb-0"> 
                  {{ nameChatAtual }} 
                </h5>
              </div>
            </div>

            <div>
              <button type="button" v-on:click="deleteChatAtual()" class="border-0 bg-transparent text-white delete-atual" >
                <i class="fas fa-user-minus"></i>
              </button>
            </div>
          </div>

          <!--Messages-->
          <div class="flex-fill p-3 overflow-auto  mh-100" ref="divMessages">
            <!--Sent message-->

            <div v-if="user[chatType][nameChatAtual]">
                <div v-for="(message, index) in user[chatType][nameChatAtual].history" :key="index">
                
                    <ChatOutgoing v-if="message.from == user.username" :message="message.message" :lastMessageDate="message.date" />

                    <ChatIncoming v-else :message="message.message" :lastMessageDate="message.date" :from="message.from" :chatType="chatType"/>

                </div>  
            </div>

          </div>

          <!--Input-->
          <ChatInput class="p-3" @sendMessage="sendMessageChat" :isDisabled="nameChatAtual.length == 0"/>
            
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
        nameChatAtual:       "",
        chatType:            "contacts"    // Não pode inicar vazio
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
          this.chatType = 'contacts';
        },

        // Muda o grupo aberto
        changeCurrentChatGroup( groupname ) { 
          this.nameChatAtual = groupname;
          this.chatType = 'groups';
        },

        // Envia a menssagem para o contato aberto
        sendMessageChat(msg)
        {
            var date = new Date();

            let hour = (date.getHours()<10?'0':'') + date.getHours();            
            let minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();

            let formatedDate = `${hour}:${minutes}`;

            let newMessage = {
                from: this.user.username,
                to: this.nameChatAtual,
                message: msg,
                date: formatedDate
            }

            this.insertHistoryMessage(newMessage);

            this.$parent.user[this.chatType][this.nameChatAtual].lastMessage = msg;
            this.$parent.user[this.chatType][this.nameChatAtual].lastMessageDate = formatedDate;

            this.$emit('sendMessageRoot', newMessage, this.chatType);
        },


        // Insere 'newMessage' no 'history' de pra quem for enviada a menssagem
        insertHistoryMessage(newMessage)
        {
            console.log("New message:");
            console.table(newMessage)
            // Se a mensagem estiver vazia
            if (!newMessage) return;

            // Adiciona ao histórico do usuário para quem envivou a msg
            if(this.chatType == 'contacts'){
              this.$parent.user.contacts[this.nameChatAtual].history.push(newMessage);
            }

            // Desce o scrollbar quando uma menssagem for enviada
            this.$refs.divMessages.scrollTop = this.$refs.divMessages.scrollHeight;
        },

        // Adiciona um novo contato a lista
        addNewContact(username = null)
        {
          this.inputTextNewContact = username || this.inputTextNewContact

          if(!this.inputTextNewContact) return;

          if (this.userExists( this.inputTextNewContact ))
          {
            var newContact = this.user.contacts[this.inputTextNewContact];
            if(newContact.imageUrl == '0'){ this.deleteChatAtual(this.inputTextNewContact); }
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
        deleteChatAtual(username = "", chatType = "") { 
          if (username)
          {
            delete this.user[chatType][username];
            return;
          }

          if (this.nameChatAtual == 'Todos')
          {
            this.$parent.showToast( 'warning', "Você não pode sair  do chat 'Todos'" );
            return;
          }

          // if ( this.user.username == "admin")
          // {
          //   this.$parent.showToast("warning", "O Admin não pode excluir contatos ou sair de grupos!");
          //   return;
          // }

          delete this.user[this.chatType][this.nameChatAtual];
          this.$emit('deleteContactOrGroup', this.nameChatAtual, this.chatType);   
          this.nameChatAtual = ""
        },  

        // Verifica existência de contato na lista de contatos
        userExists(username) { 
          return (username in this.user.contacts); 
        }

    }
}
</script>



<style>
  .container {
    height: 100%;
  }
</style>