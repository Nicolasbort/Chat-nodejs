<template>
    <div class="container d-flex justify-content-center align-items-middle h-auto">
        <div class="form-signin p-4 shadow rounded w-50 mt-5">
            <form id="form-login" action="#" @submit.prevent="handleSubmit()">

                <h1 class="mb-3 text-center text-green display-3">
                    <i class="fa fa-viruses"></i>
                    CoronaChat
                </h1>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" v-model="inputTextUsername" placeholder="Insira seu nome" required>
                </div>
                <div v-bind:class="showError ? '' : 'd-none'" class="alert alert-danger text-center" role="alert">
                    {{ msgError }}
                </div>
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="mb-3 text-center text-green">Escolha um avatar</h3>
                    </div>
                    <div class="col-3 mb-3" v-for="n in 10" :key="n">
                        <label class="d-flex justify-content-center">
                            <input type="radio" name="image-selector" v-model="imageUrl" :value="n" checked>
                            <img class="image-responsive h-75 w-75" :src="require(`../assets/avatar_${n}.png`)">
                        </label>
                    </div>
                </div>
                <button class="w-100 btn btn-outline-green align-items-center" type="submit">
                    Entrar
                </button>
                            
            </form>
        </div>


    </div>
</template>

<script>
export default {
    name: 'Login',

    data() {
        return {
            inputTextUsername:  '',
            imageUrl:           '1',

            msgError: "",
            showError: false,
        }
    },

    methods: {
        handleSubmit()
        {
            let inputUser = {
                username: this.inputTextUsername,
                imageUrl: this.imageUrl
            }

            this.$emit('userLoginSubmit', inputUser);
        }
    }
}
</script>


<style scoped>
    /* HIDE RADIO */
    [type=radio] { 
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* IMAGE STYLES */
    [type=radio] + img {
        cursor: pointer;
        transition: all 125ms ease-in-out;
    }

    /* CHECKED STYLES */
    [type=radio]:checked + img {
        box-shadow: 0px 1px 15px 6px #2a9d8f;
        border-radius: 100%;
    }

    [type=radio]:not(:checked) + img {
        -webkit-filter: grayscale(90%); /* Safari 6.0 - 9.0 */
        filter: grayscale(90%);
    }
</style>