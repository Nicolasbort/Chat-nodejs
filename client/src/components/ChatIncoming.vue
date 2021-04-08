<template>
    <div class="incoming_msg">
        <div class="incoming_msg_img"> 
            <img class="image-responsive w-100" :src="require(`../assets/${imageName}`)" alt="user image">
        </div>
        <div class="received_msg">
            <div class="received_withd_msg">
                <p>{{ message }}</p>
                <span class="time_date">{{ date }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatIncoming',

    props: {
        imageName: String,
        message: String,
        date: String
    }
}
</script>
