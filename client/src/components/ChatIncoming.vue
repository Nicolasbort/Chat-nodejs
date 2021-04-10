<template> 
    <div class="d-flex align-items-top justify-content-start mb-1">
        <div class="ms-2 position-relative end-0" style="max-width: 75%">
            <p v-if="chatType == 'groups'" class="mb-0 text-muted">
                <b>{{from}}</b>
            </p>
            <p v-if="/\p{Extended_Pictographic}/u.test(message)" class="bg-light rounded text-break p-2 mb-0 fs-2">
                {{ message }}
            </p>
            <p v-else class="bg-light rounded text-break p-2 mb-0">
                {{ message }}
            </p>
            <small class="text-muted float-start">{{ lastMessageDate }}</small>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatIncoming',

    props: {
        message: String,
        lastMessageDate: String,
        from: String,
        chatType: String
    }
}
</script>
