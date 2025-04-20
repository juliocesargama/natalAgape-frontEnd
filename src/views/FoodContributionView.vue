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
                                <th><b>Ano</b></th>
                                <th><b>Doador</b></th>
                                <th><b>Família</b></th>
                                <th><b>Entregue</b></th>
                                <th><b>Ações</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="foodContribution in foodContributions" :key="foodContribution.id">
                                <td>{{ foodContribution.campaignYear}}</td>
                                <td>{{ foodContribution.sponsorName }}</td>
                                <td>{{ foodContribution.responsibleName }}</td>
                                <td>{{ setWasDelivered(foodContribution.wasDelivered) }}</td>
                                <td>
                                    <RouterLink :to="{path: '/food-contribution/'+foodContribution.id+'/edit'}" class="btn btn-success">Alterar</RouterLink>
                                </td>
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
            foodContributions: [] as foodContribution[]
        }
    },
    mounted() {
        this.getFoodContributions();
    },
    methods: {
        getFoodContributions() {
            var url = 'api/food-contribution';
            return axios.get(url).then(result => this.foodContributions = result.data);
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