<template>
    <div class="align-self-end w-100" >
        <div class="collapse" id="collapseEmojis">
            <div class="card card-body">
                <div class="row fs-4">
                    <!--First Row-->
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128512;')">&#128512;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128513;')">&#128513;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128514;')">&#128514;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128515;')">&#128515;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128516;')">&#128516;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128517;')">&#128517;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128518;')">&#128518;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128519;')">&#128519;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128520;')">&#128520;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128521;')">&#128521;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128522;')">&#128522;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128523;')">&#128523;</a>
                    <!--Second Row-->
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128524;')">&#128524;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128525;')">&#128525;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128526;')">&#128526;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128527;')">&#128527;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128528;')">&#128528;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128529;')">&#128529;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128530;')">&#128530;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128531;')">&#128531;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128532;')">&#128532;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128533;')">&#128533;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128534;')">&#128534;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128151;')">&#128151;</a>
                    <!--Third Row-->
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#9917;')">&#9917;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#10060;')">&#10060;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#10067;')">&#10067;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#11088;')">&#11088;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#127773;')">&#127773;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128150;')">&#128150;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128178;')">&#128178;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128286;')">&#128286;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128374;')">&#128374;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128585;')">&#128585;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#128761;')">&#128761;</a>
                    <a class="col-1 text-decoration-none" href="#" v-on:click="sendEmoji('&#129302;')">&#129302;</a>
                </div>
            </div>
        </div>
        <div class="input-group">
            <button class="btn btn-outline-secondary " :disabled="isDisabled" v-on:click="toggleCollapse()">
                <i class="fa fa-smile"></i>
            </button>
            <input type="text" class="form-control" v-model="inputText" placeholder="Digite uma mensagem..." ref="inputText" :disabled="isDisabled">
            <button class="btn btn-outline-green" type="button" id="button-addon2" v-on:click="sendMessage()" ref="buttonSend" :disabled="isDisabled">
                <i class="fa fa-paper-plane"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { Collapse } from 'bootstrap'

export default {
    name: 'ChatInput',

    props: {
        isDisabled: Boolean
    },

    data() {
        return {
            inputText: "",
            collapse: {},
        }
    },

    mounted: function(){
        
        let collapseDOM = document.getElementById('collapseEmojis');
        this.collapse = new Collapse(collapseDOM, { toggle: false});
    },

    methods: {
        toggleCollapse(){
            this.collapse.toggle();
        },
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