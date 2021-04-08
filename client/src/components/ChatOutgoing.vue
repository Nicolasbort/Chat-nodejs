<template>
    <div class="outgoing_msg">
        <div class="sent_msg">
            <p>{{ message }}</p>
            <span class="time_date">{{ date }}</span>
        </div>
    </div>
</template>


<script>
export default {
    name: 'ChatOutgoing',

    props: {
        message: String,
        date: String
    }
}
</script>