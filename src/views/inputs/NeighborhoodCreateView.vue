<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Cadastro de novo Bairro">Novo Bairro</h3>
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
                    <label aria-label="Nome do Bairro">Bairro*</label>
                    <input type="text" v-model="model.neighborhood.neighborhoodName" class="form-control"
                        aria-describedby="Campo de texto para o bairro">
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-success m-2"
                        aria-describedby="Botão para salvar o bairro">Salvar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary"
                        aria-describedby="Botão para cancelar o cadastro">Cancelar</button>
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

    name: 'neighborhoodCreateView',
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
    methods: {
        saveNeighborhood() {
            var $this = this;
            var url = '/api/neighborhood'
            axios.post(url, {
                neighborhoodName: this.model.neighborhood.neighborhoodName
            })
                .then(result => {
                    this.$router.push('/neighborhood')
                })
                .catch(function (error) {
                    if (error.response.status == 400) {
                        $this.errorList.push("Ocorreu um erro ao salvar o bairro, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        cancelForm() {
            this.$router.push('/neighborhood')
        },
        checkForm: function (e: any) {
            this.errorList = [];

            if (this.model.neighborhood.neighborhoodName == '') {
                this.errorList.push('O nome é obrigatório.');
            }

            if (!this.errorList.length) {
                this.saveNeighborhood();
            };
        }
    }
}
</script>