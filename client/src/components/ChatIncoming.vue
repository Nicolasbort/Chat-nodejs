<template>
    <!-- <div class="d-flex align-items-top w-100">
        <img :src="require(`../assets/${imageName}`)" alt="User image" style="width:32px;height:32px;">
        <div class="ms-2 w-100">
        <p class="bg-light rounded text-break p-2 mb-0" style="max-width:75%;">
            {{ message }}
        </p>
        <small class="text-muted">{{ date }}</small>
        </div>
    </div> -->
    
    
    <div class="d-flex align-items-top justify-content-start mb-1">
        <div class="ms-2 position-relative end-0" style="max-width: 75%">
            <p class="bg-light rounded text-break p-2 mb-0">
                {{ message }}
            </p>
            <small class="text-muted float-start">{{ date }}</small>
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
