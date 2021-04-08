<template>
    <li v-bind:class="isActive ? 'active-chat' : '' " class="chat-contact list-group-item d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
            <img :src="require(`../assets/${imageName}`)" alt="User image" style="width:32px;height:32px;">
            <div class="ms-3">
                <h6 class="mb-0">{{ username }}</h6>
                <small class="text-muted">{{ lastMessage }}</small>
            </div>
        </div>
        <small class="text-muted">{{ date }}</small>
    </li>

</template>

<script>
export default {
    name: 'ChatList',

    props: {
        isActive: Boolean,
        username: String,
        lastMessage: String,
        date: String,
        imageName: String
    }
}
</script>


<style scoped>

    .chat-contact:hover {
        cursor: pointer;
        opacity: 0.8;
    }

    .active-chat {
        border-left: 6px solid #2a9d8f;
    }

    .active-chat h6{
        color: #2a9d8f;
        font-weight: bold;
    }

</style>