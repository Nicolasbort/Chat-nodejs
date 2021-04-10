<template>
    <div class="toast position-absolute fade align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
        <div :class="`toast-header bg-${toastType} text-white`">
            <i :class="toastIcon"></i>
            <strong class="ms-3 me-auto">Aviso</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            {{ toastMessage }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toast',

    data() {
        return {
            toastIcon: 'fa fa-info'
        }
    },

    props: {
        toastType: String,
        toastMessage: String,
    },

    watch:{
        toastType: function(newVal){
            switch(newVal){
                case 'info':
                    this.toastIcon = 'fa fa-info'
                break;
                case 'danger':
                    this.toastIcon = 'fa fa-exclamation'
                break;
                case 'success':
                    this.toastIcon = 'fa fa-check'
                break;
            }
        }
    }
}
</script>

<style scoped>
    .toast {
        left: 41%;
        top: 5%;
        z-index: 7000;
    }
</style>