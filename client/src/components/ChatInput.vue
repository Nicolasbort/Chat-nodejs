<template>
    <div class="type_msg">
        <div class="input_msg_write">
            <input type="text" v-model="inputText" class="form-control" placeholder="Type a message">
            <button class="msg_send_btn" type="button" v-on:click="sendMessage()"><i class="fa fa-paper-plane-o" ></i></button>
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

    methods: {
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