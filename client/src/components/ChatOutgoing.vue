<template>
    <div class="d-flex align-items-top justify-content-end">
    <div class="me-2 position-relative end-0" style="max-width: 75%">
        <p v-if="/\p{Extended_Pictographic}/u.test(message)" class="bg-green rounded text-break text-white p-2 mb-0 fs-3">
            {{ message }}
        </p>
        <p v-else class="bg-green rounded text-white text-break p-2 mb-0">
            {{ message }}
        </p>
        <small class="text-muted float-end">{{ lastMessageDate }}</small>
    </div>
    </div>
</template>


<script>
export default {
    name: 'ChatOutgoing',

    props: {
        message: String,
        lastMessageDate: String
    }
}
</script>