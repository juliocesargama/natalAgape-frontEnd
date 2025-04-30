<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Bairros
                    <RouterLink to="/neighborhood/create" class="btn btn-dark float-end" aria-describedby="Botão para incluir novo bairro">Novo Bairro</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th><b>Nome do Bairro</b></th>
                            <th><b>Ações</b></th>
                        </tr>
                    </thead>
                    <tbody v-if="neighborhoods.length > 0">
                        <tr v-for="neighborhood in neighborhoods" :key="neighborhood.neighborhoodId">
                            <td>{{ neighborhood.neighborhoodName }}</td>
                            <td><RouterLink :to="{path: '/neighborhood/'+neighborhood.neighborhoodId +'/edit'}" class="btn btn-success" aria-describedby="Botão para alterar o bairro">Alterar</RouterLink></td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4">{{ statusMessage }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import { type Neighborhood } from "../models/neighborhood";

export default {

    name: 'neighborhood-view',
    data() {
        return {
            neighborhoods: [] as Neighborhood[],
            statusMessage: 'Carregando Bairros...'
        }
    },
    mounted() {
        this.getNeighborhoods();
    },
    methods: {
        getNeighborhoods() {
            var url = 'api/neighborhood';
            return axios.get(url).then(result => {
                if (result.data.length > 0) {
                    this.neighborhoods = result.data;
                    this.statusMessage = '';
                } else {
                    this.statusMessage = 'Nenhum bairro encontrado.';
                }
            }).catch(() => {
                this.statusMessage = 'Erro ao carregar os bairros, tente novamente mais tarde.';
            });
        }
    },
}
</script>

