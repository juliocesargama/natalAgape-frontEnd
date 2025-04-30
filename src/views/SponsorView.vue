<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Doadores
                    <RouterLink to="/sponsor/create" class="btn btn-dark float-end" aria-describedby="Botão para incluir novo doador">Novo Doador</RouterLink>
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
                    <tbody v-if="sponsors.length > 0">
                        <tr v-for="sponsor in sponsors" :key="sponsor.sponsorId">
                            <td>{{ sponsor.sponsorName }}</td>
                            <td>{{ sponsor.sponsorPhone }}</td>
                            <td><RouterLink :to="{path: '/sponsor/'+sponsor.sponsorId +'/edit'}" class="btn btn-success" aria-describedby="Botão para alterar o doador">Alterar</RouterLink></td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3">{{ statusMessage }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import { type sponsor } from "../models/sponsor";

export default {

    name: 'sponsor-view',
    data() {
        return {
            sponsors: [] as sponsor[],
            statusMessage: 'Carregando Doadores...'
        }
    },
    mounted() {
        this.getsponsors();
    },
    methods: {
        getsponsors() {
            var url = 'api/sponsor';
            return axios.get(url).then(result => {
                if (result.data.length > 0) {
                    this.sponsors = result.data;
                    this.statusMessage = '';
                } else {
                    this.statusMessage = 'Nenhum doador encontrado.';
                }
            }).catch(() => {
                this.statusMessage = 'Erro ao carregar doadores, tente novamente mais tarde.';
            });
        }
    },
}
</script>

