<template>
    <div class="container mt-5 mb-3">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Cestas Básicas
                    <RouterLink to="/food-contribution/create" class="btn btn-dark float-end"
                        aria-describedby="Botão para incluir nova doação de cestas básicas">Nova Doação</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th><b>Doador</b></th>
                                <th><b>Família</b></th>
                                <th><b>Entregue</b></th>
                                <th><b>Ações</b></th>
                            </tr>
                        </thead>
                        <tbody v-if="foodContributions.length > 0">
                            <tr v-for="foodContribution in foodContributions" :key="foodContribution.id">
                                <td>{{ foodContribution.sponsorName }}</td>
                                <td>{{ foodContribution.responsibleName }}</td>
                                <td>{{ setWasDelivered(foodContribution.wasDelivered) }}</td>
                                <td>
                                    <RouterLink :to="{path: '/food-contribution/'+foodContribution.id+'/edit'}" class="btn btn-success">Alterar</RouterLink>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5">{{ statusMessage }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { foodContribution } from '@/models/food_contribution';
import axios from 'axios';
export default {
    name: 'FoodContributionView',
    data() {
        return {
            foodContributions: [] as foodContribution[],
            statusMessage: 'Carregando Doações...'
        }
    },
    mounted() {
        this.getFoodContributions();
    },
    methods: {
        getFoodContributions() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = 'api/food-contribution';

            return axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then(result => {
                if (result.data.length > 0) {
                    this.foodContributions = result.data;
                    this.statusMessage = '';
                } else {
                    this.statusMessage = 'Nenhuma doação encontrada.';
                }
            })
            .catch(() => {
                this.statusMessage = 'Erro ao carregar doações, tente novamente mais tarde.';
            });
        },
        setWasDelivered(wasDelivered: string | boolean) {
            switch (wasDelivered) {
                case true:
                    return "Sim";
                case false:
                    return "Não";
                default:
                    return "Não Informado";
            }
        },
    },
}
</script>