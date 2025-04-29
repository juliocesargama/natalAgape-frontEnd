<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Líderes
                    <RouterLink to="/leader/create" class="btn btn-dark float-end" aria-describedby="Botão para incluir novo líder">Novo Líder</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th><b>Nome</b></th>
                            <th><b>Telefone</b></th>
                            <th><b>Ações</b></th>
                        </tr>
                    </thead>
                    <tbody v-if="leaders.length > 0">
                        <tr v-for="leader in leaders" :key="leader.leaderId">
                            <td>{{ leader.leaderName }}</td>
                            <td>{{ leader.leaderPhone }}</td>
                            <td><RouterLink :to="{path: '/leader/'+leader.leaderId +'/edit'}" class="btn btn-success" aria-describedby="Botão para alterar o líder">Alterar</RouterLink></td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3">Carregando Líderes...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import { type Leader } from "../models/leader";

export default {

    name: 'leader-view',
    data() {
        return {
            leaders: [] as Leader[]
        }
    },
    mounted() {
        this.getLeaders();
    },
    methods: {
        getLeaders() {
            var url = 'api/leadership';
            return axios.get(url).then(result => this.leaders = result.data);
        }
    },
}
</script>

