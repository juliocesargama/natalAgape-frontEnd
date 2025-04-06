<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Alteração de dados da criança existente">Alterar Dados da Criança</h3>
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
                    <label aria-label="Nome da Criança">Criança</label>
                    <input type="text" v-model="model.child.childName" class="form-control" aria-describedby="Campo de texto para o nome da criança.">
                    
                    <label aria-label="Gênero da Criança">Gênero</label>
                    <input type="text" v-model="model.child.gender" class="form-control" aria-describedby="Campo de seleção para o gênero da criança.">
                    
       				<label aria-label="Data de Nascimento">Data de Nascimento</label>
                    <input type="text" v-model="model.child.birthDate" class="form-control" aria-describedby="Campo de texto para a data de nascimento da criança.">                    
                    
       				<label aria-label="Roupas">Tamanho da Roupa</label>
                    <input type="text" v-model="model.child.clothes" class="form-control" aria-describedby="Campo de texto para informar o tamanho da roupa da criança.">                                        
                    
       				<label aria-label="Roupas">Tamanho do Calçado</label>
                    <input type="text" v-model="model.child.shoes" class="form-control" aria-describedby="Campo de texto para informar o tamanho do calçado da criança.">     
                    
       				<label aria-label="Roupas">Url da Imagem</label>
                    <input type="text" v-model="model.child.pictureUrl" class="form-control" aria-describedby="Campo de texto para informar o caminho onde a foto está gravada."> 
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-primary m-2" aria-describedby="Botão para alterar os novos dados da criança">Alterar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary" aria-describedby="Botão para cancelar o formulário">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {

    name: 'childEditView',
    data() {
        return {
            errorList: [] as string[],
            model: {
                child: {
                    childName: ''
                }
            }
        }

    },
    mounted() {
        this.getChild()
    },
    methods: {
        saveChild() {
            var $this = this;
            var url = '/api/child'
            axios.put(url, {
                childId: this.$route.params.id,
                childName : this.model.child.childName,
                gender : this.model.child.gender,
                birthDate : this.model.child.birthDate,
                clothes : this.model.child.clothes,
                shoes : this.model.child.shoes,
                pictureUrl : this.model.child.pictureUrl
            })
                .then(result => {
                    this.$router.push('/child')
                })
                .catch(function (error) {
                    if (error.response.status == 400) {
                        $this.errorList.push("Ocorreu um erro ao salvar os dados da criança, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        getChild() {
            var $this = this;
            var url = '/api/child/' + this.$route.params.id
            axios.get(url)
                .then(result => {
                    this.model.child.childName = result.data.childName,
                    this.model.child.gender = result.data.gender,
                    this.model.child.birthDate = result.data.birthDate,
                    this.model.child.clothes = result.data.clothes,
                    this.model.child.shoes = result.data.shoes,
                    this.model.child.pictureUrl = result.data.pictureUrl
                })
                .catch(function (error) {
                    if (error.response.status == 400) {
                        $this.errorList.push("Ocorreu um erro ao buscar os dados da criança, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        cancelForm() {
            this.$router.push('/child')
        },
        checkForm: function (e: any) {
            this.errorList = [];

            if (this.model.child.childName == '') {
                this.errorList.push('O nome da criança é obrigatório.');
            }
            if(!this.errorList.length){
                this.saveChild();
            };
        }
    }

}
</script>