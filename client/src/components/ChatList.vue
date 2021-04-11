<template>
    <li v-bind:class="isActive ? 'active-chat' : '' " class="chat-contact list-group-item show-fade">
        <i class="fa fa-circle chat-pill text-green position-absolute top-0 end-0 m-1" v-if="showPill"></i>
        <div class="d-flex align-items-center justify-content-between" v-on:click="handleClick(username)">
            <div class="d-flex align-items-center" style="max-width:75%">
                <img :src="require(`../assets/avatar_${imageUrl}.png`)" alt="User image" style="width:32px;height:32px;">
                <div class="ms-3" style="max-width:75%">
                    <h6 class="mb-0">
                        {{ username.charAt(0).toUpperCase() + username.slice(1) }}
                    </h6>
                    <small class="d-inline-block text-muted text-truncate" style="max-width:100%">{{ lastMessage  || '-'}}</small>
                </div>
            </div>
            <small class="text-muted">{{ lastMessageDate || '--:--' }}</small>
        </div>
        <button v-if="imageUrl == '0'" v-on:click="$emit('addNewContactButton', username)" class="btn btn-outline-green">Adicionar aos contatos</button>
    </li>

</template>

<script>
export default {
    name: 'ChatList',
    
    methods: {
        handleClick(username) {
            this.$emit('clickLi', username);
        }
    },

    props: {
        isActive: Boolean,
        username: String,
        lastMessage: String,
        lastMessageDate: String,
        imageUrl: String,
        showPill: Boolean
    }
}
</script>
