<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Cadastro de novo líder">Novo Líder</h3>
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
        
                    <label aria-label="Nome do Líder">Nome</label>
                    <input type="text" v-model="model.leader.leaderName" class="form-control" aria-describedby="Campo de texto para o nome do líder">
                    <label aria-label="Telefone do líder">Telefone</label>
                    <input type="text"  v-model="model.leader.leaderPhone" class="form-control" aria-describedby="Campo de texto para o telefone do líder">


<!-- Dropdown para leaderRole 
<label for="leaderRole">Leader Role</label>
<select id="leaderRole" v-model="model.leader.leaderRole" required>
  <option v-for="role in leaderRoles" :key="role" :value="role">
    {{ role }}
  </option>
</select>-->




                        <label for="leaderColor">Cor</label>
                        <select v-model="model.leader.leaderColor" class="form-select form-control">
                            <option disabled value="">Selecione...</option>
                            <option value="RED">VERMELHO</option>
                            <option value="BLUE">AZUL</option>
                            <option value="GREEN">VERDE</option>
                            <option value="YELLOW">AMARELO</option>
                            <option value="ORANGE">LARANJA</option>
                            <option value="PURPLE">ROXO</option>
                            <option value="PINK">ROSA</option>
                            <option value="BROWN">MARRON</option>
                            <option value="BLACK">PRETO</option>
                            <option value="WHITE">BRANCO</option>
                        </select>

                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-primary m-2" aria-describedby="Botão para salvar o líder">Salvar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary" aria-describedby="Botão para cancelar o cadastro">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { LeaderRole } from '@/models/leader';



export default {

    name: 'leadershipCreateView',
data() {
    return {
        errorList: [] as string[],
        model: {
            leader: {
                leaderId: '',
                leaderName: '',
                leaderPhone: '',
                leaderRole: 'LEADER',
                leaderColor: ''
            }
        },
        leaderRoles: Object.values(LeaderRole)
    };
},
    methods: {
        saveLeader() {
            var $this = this;
            var url = '/api/leadership'
            axios.post(url,{
                leaderId : this.model.leader.leaderId,
                leaderName : this.model.leader.leaderName,
                leaderPhone : this.model.leader.leaderPhone,
                leaderRole: this.model.leader.leaderRole,
                leaderColor: this.model.leader.leaderColor})
            .then(result => {
                this.$router.push('/leader')
            })
            .catch(function (error){
    if (!error.response) {
        $this.errorList.push("Erro de conexão com o servidor. Verifique sua conexão com a internet.");
    } else if (error.response.status == 400) {
        $this.errorList.push("Ocorreu um erro ao salvar o líder, verifique o preenchimento de todos os campos e tente novamente.");
    } else if (error.response.status == 500) {
        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
    } else {
        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
    }
            });
        },
        cancelForm() {
            this.$router.push('/leadership')
        },
        checkForm: function (e: any) {
            this.errorList = [];

            if (this.model.leader.leaderName == '') {
                this.errorList.push('O nome do líder é obrigatório.');
            }
            if (this.model.leader.leaderPhone == '') {
                this.errorList.push('O telefone do líder é obrigatório.');
            }
            if (this.model.leader.leaderColor == '') {
                this.errorList.push('Seleciona uma cor para o líder.');
            }

            if(!this.errorList.length){
                this.saveLeader();
            }
        },

    }
};
</script>