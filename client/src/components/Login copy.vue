<template>
    <div class="container">
        <main class="form-signin p-4 bg-light shadow-lg rounded">
            <form id="form-login" action="#" @submit.prevent="login">

                <h1 class="mb-3 text-center text-primary">Chat</h1>
                <div class="form-floating mb-3">
                    <input type="text" v-model="username" class="form-control" placeholder="Nome de usuário" required>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        <h5 class="text-center text-danger" v-bind:class="showError ? '' : 'd-none'">{{ msgError }}</h5>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <h3 class="mb-3 text-center text-primary">Selecione</h3>
                    </div>
                    <div class="col-6">
                        <label class="d-flex justify-content-center">
                            <input type="radio" name="genre-selector" v-model="genre" value="user-woman" checked>
                            <img :src="require(`../assets/user-man.png`)">
                        </label>
                    </div>

                    <div class="col-6">
                        <label class="d-flex justify-content-center">
                            <input type="radio" name="genre-selector" v-model="genre" value="user-woman">
                            <img :src="require(`../assets/user-woman.png`)">
                        </label>
                    </div>
                </div>
                <button class="w-100 btn btn-primary" type="submit">Entrar</button>
                            
            </form>
        </main>
    </div>
</template>

<script>
import axios from 'axios'

const serverURL = "http://localhost:3000"

export default {
    name: 'Login',

    data() {
        return {
            username: "",
            genre: "user-woman",
            showError: false,
            msgError: "Usuário já existe"
        }
    },

    methods: {
        async login() {
            if (!this.username){
                alert("Usuário vazio!");
                return
            }

            let proxy = await this.usernameExists(this.username);

            this.showError = Object.assign({}, proxy).data;

            if (!this.showError)
            {
                if (await this.saveUser())
                {
                    window.location.href = `/chat?username=${this.username}&genre=${this.genre}`
                }

                this.msgError = "Falha ao salvar o usuário no banco";
                this.showError = true;
            }
        },

        async usernameExists(username)
        {
            return await axios.get(`${serverURL}/username_exists`, {
                params: {
                    username: username
                }
            })
        },

        async saveUser()
        {
            const data = {
                username: this.username,
                genre: this.genre,
                groups: []
            }

            const options = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            return await axios.post(`${serverURL}/add`,  JSON.stringify( data ), options)
        }
    }
}
</script>


<style scoped>
    html,body {
    height: 100%;
    }

    img {
        max-width: 50%;
    }

    img:hover {
        cursor: pointer;
        opacity: 0.8;
    }


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
    }

    /* CHECKED STYLES */
    [type=radio]:checked + img {
        border: 2px solid #007bff;
        border-radius: 40px;
        opacity: 0.8;
        /* outline: 2px solid #f00; */
    }

    .container {
        height: 600px !important;
        display: grid !important;
        place-items: center !important;
    }

    .form-signin {
    width: 100%;
    max-width: 400px;
    margin: auto;
    }

    .form-signin .checkbox {
    font-weight: 400;
    }

    .form-signin .form-floating:focus-within {
    z-index: 2;
    }

    .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    }

    .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    }

</style>