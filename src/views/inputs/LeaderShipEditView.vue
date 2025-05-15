<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Alteração de líder existente">Alterar Líder</h3>
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
                   <label aria-label="Nome do Líder">Nome do líder*</label>
                    <input type="text" v-model="model.leader.leaderName" class="form-control" aria-describedby="Campo de texto para o nome do líder">
                    <label aria-label="Telefone do líder">Telefone*</label>
                    <input type="text" v-model="model.leader.leaderPhone" class="form-control" aria-describedby="Campo de texto para o telefone do líder">

                                        <!-- Dropdown para leaderRole </select>-->
                                        <label for="leaderRole">Perfil*</label>
                    <select v-model="model.leader.leaderRole" class="form-select form-control">
                        <option disabled value="">Selecione...</option>
                        <option value="ADMIN">Administrador do Sistema</option>
                        <option value="LEADER">Usuário</option>
                    </select>

                    <label for="leaderColor">Cor*</label>
                        <select v-model="model.leader.leaderColor" class="form-select form-control">
                            <option disabled value="">Selecione...</option>
                            <option value="RED">Vermelho</option>
                            <option value="BLUE">Azul</option>
                            <option value="GREEN">Verde</option>
                            <option value="YELLOW">Amarelo</option>
                            <option value="ORANGE">Laranja</option>
                            <option value="PURPLE">Roxo</option>
                            <option value="PINK">Rosa</option>
                            <option value="BROWN">Marrom</option>
                            <option value="BLACK">Preto</option>
                            <option value="WHITE">Branco</option>
                        </select>    
                        
                        <label aria-label="Usuário">Email(Login)*</label>
                    <input type="text" v-model="model.leader.userName" class="form-control"
                        aria-describedby="Campo de texto para o nome do usuário">
                    <label aria-label="Senha">Senha*</label>
                    <input type="password" v-model="model.leader.password" class="form-control"
                        aria-describedby="Campo de texto para a senha do usuário">                        
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-success m-2" aria-describedby="Botão para alterar os novos dados do líder">Alterar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary" aria-describedby="Botão para cancelar o formulário">Cancelar</button>
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

    name: 'leaderEditView',
    data() {
        return {
            errorList: [] as string[],
            model: {
                leader: {
                    leaderId: '',
                    leaderName: '',
                    leaderPhone: '',
                    leaderRole: '',
                    leaderColor: '',
                    userName: '',   
                    password: ''
                }
            }
        }

    },
    mounted() {
        this.getLeader()
    },
methods: {
    editLeader() {
        const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
        const url = '/api/leadership/' + this.$route.params.id;

        // Prepara o payload, omitindo a senha se ela não foi alterada
        const payload: {
            leaderId: string | string[];
            leaderName: string;
            leaderPhone: string;
            leaderColor: string;
            leaderRole: string;
            userName: string;
            password?: string;
        } = {
            leaderId: this.$route.params.id,
            leaderName: this.model.leader.leaderName,
            leaderPhone: this.model.leader.leaderPhone,
            leaderColor: this.model.leader.leaderColor,
            leaderRole: this.model.leader.leaderRole,
            userName: this.model.leader.userName,
        };

        if (this.model.leader.password) {
            payload.password = this.model.leader.password; // Inclui a senha apenas se foi alterada
        }

        axios.put(url, payload, {
            headers: {
                Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        })
        .then(() => {
            this.$router.push('/leader');
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                this.errorList.push("Ocorreu um erro ao salvar o líder, verifique o preenchimento de todos os campos e tente novamente.");
            } else if (error.response && error.response.status === 500) {
                this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
            } else {
                this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
            }
        });
    },
    getLeader() {
        const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
        const url = '/api/leadership/' + this.$route.params.id;

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
            }
        })
        .then(result => {
            this.model.leader.leaderName = result.data.leaderName;
            this.model.leader.leaderPhone = result.data.leaderPhone;
            this.model.leader.leaderColor = result.data.leaderColor;
            this.model.leader.leaderRole = result.data.leaderRole;
            this.model.leader.userName = result.data.userName;
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                this.errorList.push("Ocorreu um erro ao buscar o líder, verifique o preenchimento de todos os campos e tente novamente.");
            } else if (error.response && error.response.status === 500) {
                this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
            } else {
                this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
            }
        });
    },
    cancelForm() {
        this.$router.push('/leader');
    },
    checkForm: function (e: any) {
        this.errorList = [];

        if (this.model.leader.leaderName === '') {
            this.errorList.push('O nome do líder é obrigatório.');
        }
        if (this.model.leader.leaderPhone === '') {
            this.errorList.push('O telefone do líder é obrigatório.');
        }
        if (this.model.leader.leaderColor === '') {
            this.errorList.push('Selecione uma cor para o líder.');
        }
        if (!this.errorList.length) {
            this.editLeader();
        }
    }
}
}
</script>