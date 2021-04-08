<template>
    <!--MainContainer-->
    <div class="container mt-10">
        <!--Row-->
        <div class="row rounded shadow mt-5 h-100">
          <!--Col Contacts-->
          <div class="col-3 border-end p-0  mh-100 d-flex flex-column">
            <div class="p-3 bg-green text-white d-flex align-items-center">
              <img :src="require(`../assets/${user.genre}.png`)" alt="User image" style="width:32px;height:32px;">
              <div class="ms-3">
                <h5 class="mb-0"> {{ user.username }} </h5>
              </div>
            </div>
            <div class="p-3 d-flex flex-column overflow-auto mh-100">
              <!--Add Contact-->
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Adicionar contato..." v-model="friendInputName" ref="inputText">
                <button class="btn btn-outline-green" type="button" v-on:click="addNewFriend()" ref="buttonSend">
                  <i class="fa fa-plus"></i>
                </button>
              </div>
              <!--Contacts List-->
              <ul class="list-group flex-fill overflow-auto mh-100">

                <ChatList 
                v-for="(value, index) in friends" 
                :key="index" 
                :isActive="index == indexChatAtual" 
                :id="`friend-${index}`"
                :username="value.username" 
                :lastMessage="value.lastMessage" 
                :date="value.date" 
                :imageName="`${value.genre}.png`"
                v-on:click="changeCurrenChat($event)"
                />
                

              </ul>
            </div>
          </div>
          <!--Col Messages-->
          <div class="col-9 p-3 d-flex flex-column mh-100">
            <!--Messages-->
            <div class="flex-fill overflow-auto  mh-100" ref="divMessages">
              <!--Sent message-->

                <div v-for="(value, index) in friends[indexChatAtual].history" :key="index">
                
                    <ChatIncoming v-if="value.isIncoming" :message="value.message" :date="value.date" :imageName="`${user.genre}.png`" />

                    <ChatOutgoing v-else :message="value.message" :date="value.date" />

                </div>  
                 
            </div>
            <!--Input-->
            <ChatInput @sendMessage="sendMessageSocket" />
          </div>
        </div>
    </div>
</template>

<script>
import ChatIncoming from "./ChatIncoming";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import ChatOutgoing from './ChatOutgoing.vue';

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


export default {
    name: 'Chat',

    props: {
        user: Object,
        socket: Object,
    },


    data() {
      return {

        friendInputName: "",

        indexChatAtual: 0,
        friends: [           
            {
                username: "Joazinho",
                lastMessage: "ahahaha",
                date: "23 Abril",
                genre: "user-man",
                history: [
                    {
                    isIncoming: true,
                    message: "dsahdiuha",
                    date: "21 Jan"
                    },
                    {
                    isIncoming: false,
                    message: "ahahaha",
                    date: "25 Dec"
                    }
                ]
            },   
            {
                username: "Mariazinha",
                lastMessage: "ahahaha",
                date: "23 Abril",
                genre: "user-man",
                history: [
                    {
                    isIncoming: true,
                    message: "321321",
                    date: "21 Jan"
                    },
                    {
                    isIncoming: false,
                    message: "ewqeqqe",
                    date: "25 Dec"
                    }
                ]
            }
        ],
      }
    },

    components: {
      ChatIncoming,
      ChatOutgoing,
      ChatList,
      ChatInput
    },

    mounted() {
      
        var callback = this.addFriend;
        this.$refs.inputText.addEventListener("keyup", function(event) {
          if(event.keyCode === 13){
            callback();
          }
        })
        
        var that = this;
        this.socket.on(Events.RECIEVE_MESSAGE_PRIVATE, data => {

            console.log(`Private message from '${data.from}' containing '${data.message}'`);

            var foundFriend = false;
            for (var i=0; i<that.friends.length; i++)
            {
                if (that.friends[i].username == data.from)
                {
                    that.friends[i].lastMessage = data.message;
                    that.friends[i].history.push({
                        isIncoming: true,
                        message: data.message,
                        date: data.date
                    })

                    
                    if(i == this.indexChatAtual){
                      this.$refs.divMessages.scrollTop = this.$refs.divMessages.scrollHeight - this.$refs.divMessages.clientHeight;
                    }

                    foundFriend = true;

                    break;
                }
            }
            

            if (!foundFriend)
            {
                let history = [{
                    isIncoming: true,
                    message: data.message,
                    date: data.date
                }]

                that.friends.push( that.createFriend(data.from, "user-man", data.message, history) )
            }
        })



        // NAtualiza o novo usuario no chat
        this.socket.on(Events.NEW_USER, user => {
            that.friends.push( that.createFriend(user.username, user.genre, "") );
        })


        // Recebe os clients conectados ao entrar no chat
        this.socket.on(Events.SEND_CHAT_STATE, connectedUsers => {
            console.log("conneceted users: ")
            console.table(connectedUsers)
            that.friends.push( that.createFriend(connectedUsers.username, connectedUsers.genre, "") )
        })

        // Usuario desconecotu
        this.socket.on(Events.USER_LOGOUT, usrname => {
            that.deleteFriend(usrname);
            
        })

    },

    methods: {

        changeCurrenChat( event )
        {
            let chatId = event.currentTarget.id

            this.indexChatAtual = chatId.split('-')[1];
        },



        sendMessageSocket( msg )
        {
            console.log(`${msg} from ChatInput`)

            let activeFriend = this.friends[this.indexChatAtual];

            let date = new Date();
            let stringDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}` 

            let historyData =  {
                isIncoming: false,
                friend: activeFriend.username,
                message: msg,
                date: stringDate
            }

            this.insertHistoryMessage(historyData);
            this.friends[this.indexChatAtual].lastMessage = msg
            this.friends[this.indexChatAtual].date = stringDate

            let data = {
                from: this.user.username,
                to: activeFriend.username,
                message: msg,
                date: stringDate
            }

            //
            //  data = From && To && Message && Date
            //
            this.socket.emit(Events.SEND_MESSAGE_PRIVATE, data);
        },



        insertHistoryMessage( data )
        {
            if (!data) return;

            for (var i=0; i<this.friends.length; i++)
            {
                if (this.friends[i].username === data.friend)
                {
                    this.friends[i].history.push({
                        isIncoming: data.isIncoming,
                        message: data.message,
                        lastMessage: data.message,
                        date: data.date
                    })

                    
                    if(i == this.indexChatAtual){
                      this.$refs.divMessages.scrollTop = this.$refs.divMessages.scrollHeight - this.$refs.divMessages.clientHeight;
                    }

                    return;
                }
            }

        },


        addNewFriend()
        {
            if (!this.friendInputName)
            {
                alert(`Insira um nome. Nome atual: ${this.friendInputName}`);
                return;
            }

            if (this.userExists(this.friendInputName))
            {
                alert('Amigo ja adicionado');
                return;
            }

            this.friends.push( this.createFriend(this.friendInputName, "user-man") )

            console.table(this.friends);
        },


        createFriend( username, genre, lastMessage = "", history = [] )
        {
            return {
                username: username,
                lastMessage: lastMessage,
                date: "",
                genre: genre,
                history: history
            }
        },


        deleteFriend( username )
        {
            // alert(username)
            this.friends.forEach( (user, index) =>{
                if (user.username == username)
                {
                    this.friends.splice(index, 1)
                }
            })

            console.table(this.friends);
        },  

        userExists(username)
        {
            for ( var friend of this.friends )
            {
                if (friend.username == username)
                {
                    return true;
                }
            }

            return false;
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