<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Alteração de família existente">Alterar Família</h3>
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
                   <label aria-label="Nome do Responsável">Nome do Responsável</label>
                    <input type="text" v-model="model.family.responsibleName" class="form-control" aria-describedby="Campo de texto para o nome do doador">
                    <label aria-label="Telefone do doador">Telefone</label>
                    <input type="text" v-model="model.family.phoneNumber" class="form-control" aria-describedby="Campo de texto para o telefone do responsável">
                    <label aria-label="Endereço da família">Endereço</label>
                    <input type="text" v-model="model.family.address" class="form-control" aria-describedby="Campo de texto para o endereço da família">
                    <label aria-label="Bairro da família">Bairro</label>
                    <select v-model="model.family.neighborhoodId" class="form-select form-control" aria-describedby="Campo de seleção para bairro da família">
                        <option disabled value="">Selecione...</option>
                        <option v-for="neighborhood in neighborhoods" :key="neighborhood.neighborhoodId" :value="neighborhood.neighborhoodId">
                            {{ neighborhood.neighborhoodName }} </option>
                        </select>
                    <label aria-label="Observações">Observações</label>
                    <input type="text" v-model="model.family.observation" class="form-control" aria-describedby="Campo de texto para observações">
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-primary m-2" aria-describedby="Botão para alterar os novos dados da família">Alterar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary" aria-describedby="Botão para cancelar o formulário">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { Neighborhood } from '@/models/neighborhood';
import axios from 'axios';

export default {

    name: 'familyEditView',
    data() {
        return {
            errorList: [] as string[],
            neighborhoods: [] as Neighborhood[],
            model: {
                family: {
                    familyId: '',
                    responsibleName: '',
                    phoneNumber: '',
                    address: '',
                    neighborhoodId: '',
                    observation: ''
                }
            }
        }

    },
    mounted() {
        this.getNeighborhoods();
        this.getFamily()
    },
    methods: {
        editfamily() {
            var $this = this;
            var url = '/api/family/' + this.$route.params.id
            axios.put(url, {
                familyId: this.$route.params.id,
                responsibleName: this.model.family.responsibleName,
                phoneNumber: this.model.family.phoneNumber,
                address: this.model.family.address,
                neighborhoodId: this.model.family.neighborhoodId,
                observation: this.model.family.observation
            })
            .then(result => {
                    this.$router.push('/family')
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        $this.errorList.push("Ocorreu um erro ao salvar a família, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        getFamily() {
            var $this = this;
            var url = '/api/family/' + this.$route.params.id
            axios.get(url)
                .then(result => {
                    this.model.family.responsibleName = result.data.responsibleName
                    this.model.family.phoneNumber = result.data.phoneNumber
                    this.model.family.address = result.data.address
                    this.model.family.neighborhoodId = result.data.neighborhoodId
                    this.model.family.observation = result.data.observation
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        $this.errorList.push("Ocorreu um erro ao buscar a família, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
            getNeighborhoods() {
                var $this = this;
                var url = '/api/neighborhood'
                axios.get(url)
                    .then(result => {
                        this.neighborhoods = result.data;
                    })
                    .catch(function (error) {
                        if (error.response && error.response.status == 500) {
                            $this.errorList.push("Erro ao carregar os bairros. Tente novamente mais tarde.");
                        } else {
                            $this.errorList.push("Erro desconhecido ao carregar os bairros.");
                        }
                    });
            },
        cancelForm() {
            this.$router.push('/family')
        },
        checkForm: function (e: any) {
            this.errorList = [];


            if (this.model.family.responsibleName == '') {
                this.errorList.push('O nome do responsável é obrigatório.');
            }
            if (this.model.family.phoneNumber == '') {
                this.errorList.push('O telefone do responsável é obrigatório.');
            }
            if (this.model.family.address == '') {
                this.errorList.push('O endereço é obrigatório.');
            }
            if (this.model.family.neighborhoodId == '') {
                this.errorList.push('O bairro é obrigatório.');
            }
            if(!this.errorList.length){
                this.editfamily();
            };
        }
    }

}
</script>