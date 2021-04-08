<template>
    <div class="chat_list" v-bind:class="isActive ? 'active_chat' : ''">
        <div class="chat_people">
            <div class="chat_img"> 
                <img class="image-responsive w-100" :src="require(`../assets/${imageName}`)" alt="User image">
            </div>
            <div class="chat_ib">
                <h5>
                    {{ username }}
                    <span class="chat_date">{{ date }}</span>
                </h5>
                <p>{{ lastMessage }}</p>
            </div>
        </div>
    </div>
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

    .chat_list:hover {
        cursor: pointer;
        opacity: 0.8;
    }

</style>