<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Alteração de campanha existente">Alterar Campanha</h3>
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
                    <label aria-label="Ano da Campanha">Ano*</label>
                    <input type="number" min="2025" max="2075" v-model="model.campaign.campaignYear"
                        class="form-control" aria-describedby="Campo de texto para o ano da campanha">
                    <label aria-label="Nome da igreja ou campanha">Nome da Igreja/Campanha*</label>
                    <input type="text" v-model="model.campaign.campaignChurch" class="form-control"
                        aria-describedby="Campo de texto para o nome da igreja">
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-success m-2"
                        aria-describedby="Botão para alterar os novos dados da campanha">Alterar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary"
                        aria-describedby="Botão para cancelar o formulário">Cancelar</button>
                </div>
            </div>
            <div class="card-footer">
                <p class="text-muted">* Campos obrigatórios</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {

    name: 'campaignEditView',
    data() {
        return {
            errorList: [] as string[],
            model: {
                campaign: {
                    campaignYear: 0,
                    campaignChurch: ''
                }
            }
        }

    },
    mounted() {
        this.getCampaign()
    },
    methods: {
        editCampaign() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = '/api/campaign/' + this.$route.params.id;

            axios.put(url, {
                campaignId: this.$route.params.id,
                campaignYear: this.model.campaign.campaignYear,
                campaignChurch: this.model.campaign.campaignChurch
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then(() => {
                this.$router.push('/campaign');
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    this.errorList.push("Ocorreu um erro ao salvar a campanha, verifique o preenchimento de todos os campos e tente novamente.");
                } else if (error.response && error.response.status === 500) {
                    this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
                } else {
                    this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
                }
            });
        },
        getCampaign() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = '/api/campaign/' + this.$route.params.id;

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then(result => {
                this.model.campaign.campaignYear = result.data.campaignYear;
                this.model.campaign.campaignChurch = result.data.campaignChurch;
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    this.errorList.push("Ocorreu um erro ao buscar a campanha, verifique o preenchimento de todos os campos e tente novamente.");
                } else if (error.response && error.response.status === 500) {
                    this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
                } else {
                    this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
                }
            });
        },
        cancelForm() {
            this.$router.push('/campaign')
        },
        checkForm: function (e: any) {
            this.errorList = [];

            if (this.model.campaign.campaignYear < 2025 || this.model.campaign.campaignYear > 2075) {
                this.errorList.push('O ano da campanha é inválido.');
            }
            if (this.model.campaign.campaignChurch == '') {
                this.errorList.push('A igreja responsável pela campanha é obrigatória.');
            }
            if (!this.errorList.length) {
                this.editCampaign();
            };
        }
    }

}
</script>