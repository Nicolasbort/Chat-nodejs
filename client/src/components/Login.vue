<template>
    <div class="container">
        <main class="form-signin p-4 bg-light shadow-lg rounded">
            <form id="form-login" action="#" @submit.prevent="handleSubmit()">

                <h1 class="mb-3 text-center text-primary">Chat</h1>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" v-model="username" placeholder="Username">
                </div>
                <div v-bind:class="showError ? '' : 'd-none'" class="alert alert-danger text-center" role="alert">
                    {{ msgError }}
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <h3 class="mb-3 text-center text-primary">Selecione</h3>
                    </div>
                    <div class="col-6">
                        <label class="d-flex justify-content-center">
                            <input type="radio" name="genre-selector" v-model="genre" value="user-man" checked>
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

const Events = {
    USER_LOGIN:"USER_LOGIN",
    USER_DISCONNECTED: "USER_DISCONNECTED",
    MESSAGE_SENT: "MESSAGE_SENT",
    MESSAGE_RECIEVED: "MESSAGE_RECIEVED",
    SEND_MESSAGE_PRIVATE: "SEND_MESSAGE_PRIVATE",
    RECIEVE_MESSAGE_PRIVATE: "RECIEVE_MESSAGE_PRIVATE",
    LOGOUT: "LOGOUT",
    VERIFY_USER: "VERIFY_USER",
    SEND_USER_DATA:"SEND_USER_DATA",
    NEW_USER: "NEW_USER",
}


export default {
    name: 'Login',

    data() {
        return {
            username: '',
            genre: 'user-man',

            msgError: "",
            showError: false,
        }
    },

    props: {
        socket: Object,
        setUser: Function
    },

    created() {

        var that = this;
        this.socket.on(Events.SEND_USER_DATA, data => {

            // Usuario já conectado
            if (!data)
            {
                that.showError = true;
                that.msgError = "Usuário já conectado!";
                return;
            }
            
            that.setUser( data )

            that.$emit('userLoggedIn');
        })
    },

    methods: {
        handleSubmit()
        {
            let data = {
                username: this.username,
                genre: this.genre
            }

            this.socket.emit(Events.USER_LOGIN, data)
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