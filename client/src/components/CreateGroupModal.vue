<template> 
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-gren" id="exampleModalLabel">Criar novo grupo</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="text" v-model="groupname" class="form-control mb-3" placeholder="Nome do grupo...">
                
                <div class="row mb-4">
                    <div class="col-12">
                        <h5 class="mb-3 text-center text-green">Escolha um icone</h5>
                    </div>
                    <div class="col-2 mb-3" v-for="n in 6" :key="n">
                        <label class="d-flex justify-content-center">
                            <input type="radio" name="icon-selector" v-model="imageUrl" :value="n">
                            <img class="image-responsive h-75 w-75" :src="require(`../assets/group_${n}.png`)">
                        </label>
                    </div>
                </div>

                <h5 class=" text-center text-green">Selecione os Membros</h5>


                <ul class="list-group flex-fill overflow-auto mh-100">
                    <li 
                    v-for="(contact, username) in contacts" 
                    :key="'key_create_group_contact_'+username" 
                    class="chat-contact list-group-item" 
                    v-on:click="toggleContact(username)" 
                    :id="'li_create_group_contact_'+username">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <img :src="require(`../assets/avatar_${contact.imageUrl}.png`)" alt="User image" style="width:32px;height:32px;">
                                <div class="ms-3">
                                    <h6 class="mb-0">{{ username }}</h6>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnCloseModal">Close</button>
                <button type="button" v-on:click="checkGroupInformation" class="btn btn-outline-green">Criar</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CreateGroupModal',

    data() {
        return {
            groupname:        "",
            imageUrl:         "",
            selectedContacts: [],
        }
    },

    props: {
        id: String,
        contacts: Object
    },
    
    methods: {
        toggleContact( username )
        {
            let liContact = document.getElementById('li_create_group_contact_'+username);
            
            liContact.classList.toggle( 'active-chat' )

            let indexContact = this.selectedContacts.indexOf(username);
            if (indexContact != -1){
                this.selectedContacts.splice(indexContact, 1)
                return;
            }

            this.selectedContacts.push(username);
        },

        checkGroupInformation()
        {
            if ( !this.groupname || !this.imageUrl )
            {
                this.$parent.showToast('info', 'Insira um nome de grupo e um icone')
                return;
            }

            this.$emit("createGroup", this.groupname, this.imageUrl, this.selectedContacts);

            // this.groupname        = "";
            // this.imageUrl         = "";
            // this.selectedContacts = [];
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