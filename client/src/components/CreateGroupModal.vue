<template> 
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-gren" id="exampleModalLabel">Criar novo grupo</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="text" class="form-control mb-3" placeholder="Nome do grupo...">
                
                <h5>Membros</h5>
                {{selectedContacts}}
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
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-green">Criar</button>
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
            selectedContacts: [],
        }
    },

    // lista de check inputs ( selecionados ou não )

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
        }
    }
}
</script>
