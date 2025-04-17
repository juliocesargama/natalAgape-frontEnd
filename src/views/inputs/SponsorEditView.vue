<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Alteração de doador existente">Alterar Doador</h3>
            </div>
            <div class="card-body">

                <ul class="alert alert-danger" v-if="errorList.length > 0">
                    <div class="mb-0 ms-3">
                        <ul>
                            <li v-for="error in errorList">{{ error }}</li>
                        </ul>
                    </div>
                </ul>
                <div class="mb-3">
                   <label aria-label="Nome do doador">Nome do doador</label>
                    <input type="text" v-model="model.sponsor.sponsorName" class="form-control" aria-describedby="Campo de texto para o nome do doador">
                    <label aria-label="Telefone do doador">Telefone</label>
                    <input type="text" v-model="model.sponsor.sponsorPhone" class="form-control" aria-describedby="Campo de texto para o telefone do doador">
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-success m-2" aria-describedby="Botão para alterar os novos dados do doador">Alterar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary" aria-describedby="Botão para cancelar o formulário">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {

    name: 'sponsorEditView',
    data() {
        return {
            errorList: [] as string[],
            model: {
                sponsor: {
                    sponsorName: '',
                    sponsorPhone: ''
                }
            }
        }

    },
    mounted() {
        this.getSponsor()
    },
    methods: {
        editSponsor() {
            var $this = this;
            var url = '/api/sponsor/' + this.$route.params.id
            axios.put(url, {
                sponsorId: this.$route.params.id,
                sponsorName: this.model.sponsor.sponsorName,
                sponsorPhone: this.model.sponsor.sponsorPhone,
            })
            .then(result => {
                    this.$router.push('/sponsor')
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        $this.errorList.push("Ocorreu um erro ao salvar o doador, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        getSponsor() {
            var $this = this;
            var url = '/api/sponsor/' + this.$route.params.id
            axios.get(url)
                .then(result => {
                    this.model.sponsor.sponsorName = result.data.sponsorName
                    this.model.sponsor.sponsorPhone = result.data.sponsorPhone
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        $this.errorList.push("Ocorreu um erro ao buscar o doador, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        cancelForm() {
            this.$router.push('/sponsor')
        },
        checkForm: function (e: any) {
            this.errorList = [];


            if (this.model.sponsor.sponsorName == '') {
                this.errorList.push('O nome do doador é obrigatório.');
            }
            if (this.model.sponsor.sponsorPhone == '') {
                this.errorList.push('O telefone do doador é obrigatório.');
            }
            if(!this.errorList.length){
                this.editSponsor();
            };
        }
    }

}
</script>