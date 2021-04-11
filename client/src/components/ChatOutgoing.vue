<template>
    <div class="d-flex align-items-top mb-2 justify-content-end show-slide-right">
        <div class="me-2 position-relative end-0" style="max-width: 75%">
            <p v-if="/\p{Extended_Pictographic}/u.test(message)" class="bg-green message-emoji rounded text-break text-white p-2 mb-0 fs-3">
                <span>  
                    {{ message }}
                </span>
            </p>
            <p v-else class="bg-green rounded text-white text-break p-2 mb-0">
                {{ message }}
            </p>
            <small class="text-muted float-end message-date">{{ lastMessageDate }}</small>
        </div>
    </div>
</template>


<script>
export default {
    name: 'ChatOutgoing',

    props: {
        message: String,
        lastMessageDate: String,
    },
}
</script>