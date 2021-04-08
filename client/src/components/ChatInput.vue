<template>
    <div class="align-self-end w-100">
        <div class="input-group">
            <button class="btn btn-outline-secondary " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-smile"></i>
            </button>
            <ul class="dropdown-menu">
                <a class="dropdown-item" href="#" v-on:click="sendEmoji('😀')">😀 Feliz</a>
                <a class="dropdown-item" href="#" v-on:click="sendEmoji('😭')">😭 Triste</a>
                <a class="dropdown-item" href="#" v-on:click="sendEmoji('👽')">👽 Alien</a>
                <a class="dropdown-item" href="#" v-on:click="sendEmoji('💖')">💖 Coração</a>
            </ul>
            <input type="text" class="form-control" v-model="inputText" placeholder="Digite uma mensagem..." ref="inputText">
            <button class="btn btn-outline-green" type="button" id="button-addon2" v-on:click="sendMessage()" ref="buttonSend">
                <i class="fa fa-paper-plane"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatInput',

    data() {
        return {
            inputText: ""
        }
    },

    mounted: function(){
        var callback = this.sendMessage;
        this.$refs.inputText.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                callback();
            }
        });
    },

    methods: {
        sendEmoji(emoji){
            this.$emit('sendMessage', emoji)
        },
        sendMessage() {
            if (!this.inputText) {
                console.log("input vazio")
                return;
            }

            this.$emit('sendMessage', this.inputText)

            this.inputText = "";
        }
    }
}
</script>