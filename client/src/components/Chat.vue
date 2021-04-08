<template>
    <div class="container">
        <h3 class=" text-center">Messaging</h3>
        <div class="messaging">
            <div class="inbox_msg">
                <div class="inbox_people">
                    <!-- <div class="headind_srch"> -->
                        <div class="row my-3 mx-2">
                            <div class="col-4">
                                <div class="recent_heading text-center">
                                    <h4>{{ user.username }}</h4>
                                </div>
                            </div>
                            <div class="col-6">
                                <!-- <div class="srch_bar w-100">
                                    <div class="stylish-input-group">
                                        <input type="text" class="search-bar w-100" placeholder="Search" >
                                        <span class="input-group-addon">
                                            <button type="button"> <i class="fa fa-search" ></i> </button>
                                        </span>
                                    </div>
                                </div> -->
                                <div class="srch_bar w-100">
                                    <div class="stylish-input-group">
                                        <input v-model="friendInputName" type="text" class="search-bar w-100" placeholder="Novo amigo" >
                                    </div>
                                </div>

                            </div>
                            <div class="col-2 text-center">
                                <button v-on:click="addNewFriend()" type="button" class="btn btn-primary" ><i class="fa fa-plus-circle" ></i></button>
                            </div>
                        </div>
                    <!-- </div> -->
                    <div class="inbox_chat">

                        <div v-for="(value, index) in friends" :key="index" :id="`friend-${index}`" v-on:click="changeCurrenChat($event)">

                            <ChatList v-if="index == indexChatAtual" :isActive="true" :username="value.username" :lastMessage="value.lastMessage" :date="value.date" :imageName="`${value.genre}.png`"/>

                            <ChatList v-else :isActive="false" :username="value.username" :lastMessage="value.lastMessage" :date="value.date" :imageName="`${value.genre}.png`"/>

                        </div>

                    </div>
                </div>
                <div class="mesgs">
                    <div class="msg_history">

                        <div v-for="(value, index) in friends[indexChatAtual].history" :key="index">
                        
                            <ChatIncoming v-if="value.isIncoming" :message="value.message" :date="value.date" :imageName="`${user.genre}.png`" />

                            <ChatOutgoing v-else :message="value.message" :date="value.date" />

                        </div>   

                    </div>

                    <ChatInput @sendMessage="sendMessageSocket" />
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChatIncoming from "./ChatIncoming";
import ChatOutgoing from "./ChatOutgoing";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";

const Events = {
    USER_LOGIN:"USER_LOGIN",
    USER_DISCONNECTED: "USER_DISCONNECTED",
    MESSAGE_SENT: "MESSAGE_SENT",
    MESSAGE_RECIEVED: "MESSAGE_RECIEVED",
    SEND_MESSAGE_PRIVATE: "SEND_MESSAGE_PRIVATE",
    RECIEVE_MESSAGE_PRIVATE: "RECIEVE_MESSAGE_PRIVATE",
    LOGOUT: "LOGOUT",
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
      
        var that = this
        this.socket.on(Events.RECIEVE_MESSAGE_PRIVATE, data => {

            console.log(`Private message from '${data.from}' containing '${data.message}'`);

            var foundFriend = false;
            for (var i=0; i<that.friends.length; i++)
            {
                if (that.friends[i].username == data.from)
                {
                    that.friends[i].history.push({
                        isIncoming: true,
                        message: data.message,
                        date: data.date
                    })

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

                that.friends.push( that.createFriend(data.from, "user-man", history) )
            }
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
                    date: data.date
                    })

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

            this.friends.push( this.createFriend(this.friendInputName, "user-man") )

            console.table(this.friends);
        },


        createFriend( username, genre, history = [] )
        {
            return {
                username: username,
                lastMessage: "",
                date: "",
                genre: genre,
                history: history
            }
        }


    }
}
</script>



<style>

  .inbox_people {
    background: #f8f8f8 none repeat scroll 0 0;
    float: left;
    overflow: hidden;
    width: 40%; border-right:1px solid #c4c4c4;
  }
  .inbox_msg {
    border: 1px solid #c4c4c4;
    clear: both;
    overflow: hidden;
  }
  .top_spac{ margin: 20px 0 0;}


  .recent_heading {float: left; width:40%;}
  .srch_bar {
    display: inline-block;
    text-align: right;
    width: 60%;
  }
  .headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

  .recent_heading h4 {
    color: #05728f;
    font-size: 21px;
    margin: auto;
  }
  .srch_bar input{ 
    border:1px solid #cdcdcd;
    border-width:0 0 1px 0;
    width:80%;
    padding:2px 0 4px 6px;
    background:none;
  
  }

  .srch_bar .input-group-addon button {
    background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
    border: medium none;
    padding: 0;
    color: #707070;
    font-size: 18px;
  }
  .srch_bar .input-group-addon { margin: 0 0 0 -27px;}

  .chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}
  .chat_ib h5 span{ font-size:13px; float:right;}
  .chat_ib p{ font-size:14px; color:#989898; margin:auto}
  .chat_img {
    float: left;
    width: 11%;
  }
  .chat_ib {
    float: left;
    padding: 0 0 0 15px;
    width: 88%;
  }

  .chat_people{ overflow:hidden; clear:both;}
  .chat_list {
    border-bottom: 1px solid #c4c4c4;
    margin: 0;
    padding: 18px 16px 10px;
  }
  .inbox_chat { height: 550px; overflow-y: scroll;}

  .active_chat{ background:#dfdfdf;}

  .incoming_msg_img {
    display: inline-block;
    width: 6%;
  }
  .received_msg {
    display: inline-block;
    padding: 0 0 0 10px;
    vertical-align: top;
    width: 92%;
  }
  .received_withd_msg p {
    background: #ebebeb none repeat scroll 0 0;
    border-radius: 3px;
    color: #646464;
    font-size: 14px;
    margin: 0;
    padding: 5px 10px 5px 12px;
    width: 100%;
  }
  .time_date {
    color: #747474;
    display: block;
    font-size: 12px;
    margin: 8px 0 0;
  }
  .received_withd_msg { width: 57%;}
  .mesgs {
    float: left;
    padding: 30px 15px 0 25px;
    width: 60%;
  }

  .sent_msg p {
    background: #05728f none repeat scroll 0 0;
    border-radius: 3px;
    font-size: 14px;
    margin: 0; color:#fff;
    padding: 5px 10px 5px 12px;
    width:100%;
  }
  .outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
  .sent_msg {
    float: right;
    width: 46%;
  }
  .input_msg_write input {
    background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
    border: medium none;
    color: #4c4c4c;
    font-size: 15px;
    min-height: 48px;
    width: 100%;
  }

  .type_msg {border-top: 1px solid #c4c4c4;position: relative;}
  .msg_send_btn {
    background: #05728f none repeat scroll 0 0;
    border: medium none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    font-size: 17px;
    height: 33px;
    position: absolute;
    right: 0;
    top: 11px;
    width: 33px;
  }
  .messaging { padding: 0 0 50px 0;}
  .msg_history {
    height: 516px;
    overflow-y: auto;
  }
</style>