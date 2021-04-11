<template>
    <!--MainContainer-->
    <div class="container mt-10">
      <!--Row-->
      <div class="row rounded shadow mt-5 h-100">
        <!--Col Contacts-->
        <div class="col-3 border-end p-0  mh-100 d-flex flex-column">
          <div class="p-3 bg-green text-white d-flex justify-content-between align-items-center">

            <div class="p-0 d-flex align-items-center">
              <img :src="require(`../assets/avatar_${user.imageUrl}.png`)" alt="User image" style="width:32px;height:32px;">
              <div class="ms-3">
                <h5 class="mb-0"> 
                  {{ user.username.charAt(0).toUpperCase() + user.username.slice(1) }}
                </h5>
              </div>
            </div>

          </div>
          <div class="p-3 d-flex flex-column overflow-auto mh-100">
            
            <button class="btn btn-outline-danger w-full mb-3" type="button" v-on:click="$emit('resetDatabase')"  v-if="user.username == 'admin' || user.username == 'iago'">
              Reiniciar banco de dados <i class="fa fa-sync"></i>
            </button>
            
            <!--Group List-->
            <h5 class="text-muted">Grupos</h5>
            <!--List-->
            <ul class="list-group flex-fill overflow-auto mh-100">
                <!--Create group-->
                <li class="btn-outline-green list-group-item text-center" style="cursor:pointer;" v-on:click="this.$parent.createGroupModal.show()">
                  <i class="fa fa-plus"></i>&nbsp;Criar grupo
                </li>
                <GroupList
                v-for="(group, groupname) in user.groups"
                :key="groupname"
                :isActive="groupname == nameChatAtual"
                :groupname="groupname"
                :lastMessage="group.lastMessage" 
                :lastMessageDate="group.lastMessageDate" 
                :imageUrl="group.imageUrl"
                :showPill="group.showPill"
                @clickLi="changeCurrentChatGroup"
                />
            </ul>
            

            <!--Contacts List-->
            <h5 class="mt-4 text-muted">Contatos</h5>
            <!--Add Contact-->
            <form @submit.prevent="addNewContact()">
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Adicionar contato..." v-model="inputTextNewContact" ref="inputText">
                <button class="btn btn-outline-green" type="submit" ref="buttonSend">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
            </form>
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
                :showPill="contact.showPill"
                @clickLi="changeCurrentChatContact"
                @addNewContactButton="addNewContact"
                />
            </ul>
          </div>
        </div>
        <!--Col Messages-->
        <div class="col-9 p-0 d-flex flex-column mh-100 show-slide-left">

          <!-- Informacoes do usuário clicado -->
          <div v-if="nameChatAtual.length > 0" class="p-3 bg-green text-white d-flex justify-content-between align-items-center show-slide-left">
            <div class=" align-items-center" style="display: inherit">
              <img :src="require(`../assets/${chatType == 'contacts' ? 'avatar' : 'group'}_${user[chatType][nameChatAtual].imageUrl}.png`)" alt="User image" style="width:32px;height:32px;">
              <div class="ms-3">
                <h5 class="mb-0"> 
                  {{ nameChatAtual.charAt(0).toUpperCase() + nameChatAtual.slice(1) }}
                </h5>
              </div>
            </div>

            <div>
              <!-- Botão apagar grupo -->
              <button type="button" v-if="chatType=='groups'" title="Deletar grupo" v-on:click="deleteGroup()" class="border-0 bg-transparent text-white delete-atual" >
                <i class="fas fa-users-slash"></i>
              </button>
              <!-- Botão apagar contato -->
              <button type="button" v-on:click="deleteChatAtual()" title="Remove contato / Sair do grupo" class="border-0 bg-transparent text-white delete-atual" >
                <i class="fas fa-user-minus"></i>
              </button>
            </div>
          </div>

          <!--Messages-->
          <div class="flex-fill p-3 overflow-auto mh-100 show-slide-left" ref="divMessages">
            <!--Sent message-->

            <div v-if="user[chatType][nameChatAtual]">
                <div v-for="(message, index) in user[chatType][nameChatAtual].history" :key="index">
                      <ChatOutgoing 
                      v-if="message.from == user.username" 
                      :message="message.message" 
                      :lastMessageDate="message.date" 
                      class="chat-message"
                      />

                      <ChatIncoming 
                      v-else 
                      :message="message.message" 
                      :lastMessageDate="message.date" 
                      :from="message.from" 
                      :chatType="chatType" 
                      class="chat-message"
                      />
                </div>  
            </div>
            <div v-else class="h-100 d-flex justify-content-center align-items-center flex-column">
              <i class="fa fa-viruses fa-7x text-green"></i>
              <h2 class="text-green w-50 text-center">CoronaChat</h2>
              <h5 class="w-50 text-center text-muted">Clique em um contato ou grupo para ver as mensagens</h5>
            </div>

          </div>

          <!--Input-->
          <ChatInput v-if="user[chatType][nameChatAtual]" class="p-3" @sendMessage="sendMessageChat" :isDisabled="nameChatAtual.length == 0"/>
            
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
        changeCurrentChatContact( username ) 
        { 
          if(this.nameChatAtual == username){
            this.nameChatAtual = "";
          }else{
            this.user.contacts[username]["showPill"] = false;
            this.nameChatAtual = username 
            this.chatType = 'contacts';
          }
        },

        // Muda o grupo aberto
        changeCurrentChatGroup( groupname ) 
        { 
          if(this.nameChatAtual == groupname){
            this.nameChatAtual = "";
          }else{
            this.user.groups[groupname]["showPill"] = false;
            this.nameChatAtual = groupname;
            this.chatType = 'groups';
          }
        },

        // Envia a mensagem para o contato aberto
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


        // Insere 'newMessage' no 'history' de pra quem for enviada a mensagem
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

            // Desce o scrollbar quando uma mensagem for enviada
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
            if(newContact.imageUrl == '0') 
              this.deleteChatAtual(this.inputTextNewContact, 'contacts'); 
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
        deleteChatAtual(username = "", chatType = "") 
        { 
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

          delete this.user[this.chatType][this.nameChatAtual];
          this.$emit('removeContactOrGroup', this.nameChatAtual, this.chatType);   
          this.nameChatAtual = ""
        },  


        deleteGroup()
        {
          this.$emit('deleteGroup', this.nameChatAtual)

          this.nameChatAtual = "";
        },

        // Verifica existência de contato na lista de contatos
        userExists(username) 
        { 
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