<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Alteração de bairro existente">Alterar Bairro</h3>
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
                    <label aria-label="Nome do bairro">Bairro*</label>
                    <input type="text" v-model="model.neighborhood.neighborhoodName" class="form-control"
                        aria-describedby="Campo texto para inserir novo nome do bairro">
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-success m-2"
                        aria-describedby="Botão para alterar os novos dados do bairro">Alterar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary"
                        aria-describedby="Botão para cancelar o formulário">Cancelar</button>
                </div>
            </div>
            <div class="card-footer">
                <p class="text-muted">* Campo obrigatório</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {

    name: 'neighborhoodEditView',
    data() {
        return {
            errorList: [] as string[],
            model: {
                neighborhood: {
                    neighborhoodName: ''
                }
            }
        }

    },
    mounted() {
        this.getNeighborhood()
    },
    methods: {
    editNeighborhood() {
        const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
        const url = '/api/neighborhood/' + this.$route.params.id;

        axios.put(url, {
            neighborhoodId: this.$route.params.id,
            neighborhoodName: this.model.neighborhood.neighborhoodName,
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        })
        .then(() => {
            this.$router.push('/neighborhood');
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                this.errorList.push("Ocorreu um erro ao salvar o bairro, verifique o preenchimento de todos os campos e tente novamente.");
            } else if (error.response && error.response.status === 500) {
                this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
            } else {
                this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
            }
        });
    },
    getNeighborhood() {
        const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
        const url = '/api/neighborhood/' + this.$route.params.id;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        })
        .then(result => {
            this.model.neighborhood.neighborhoodName = result.data.neighborhoodName;
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                this.errorList.push("Ocorreu um erro ao buscar o bairro, verifique o preenchimento de todos os campos e tente novamente.");
            } else if (error.response && error.response.status === 500) {
                this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
            } else {
                this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
            }
        });
    },
        cancelForm() {
            this.$router.push('/neighborhood')
        },
        checkForm: function (e: any) {
            this.errorList = [];

            if (this.model.neighborhood.neighborhoodName == '') {
                this.errorList.push('O nome do bairro é obrigatório.');
            }
            if (!this.errorList.length) {
                this.editNeighborhood();
            };
        }
    }

}
</script>