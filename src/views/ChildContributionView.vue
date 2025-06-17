<template>
    <div class="container mt-5 mb-3">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Roupas e Calçados
                    <RouterLink to="/child-contribution/create" class="btn btn-dark float-end"
                        aria-describedby="Botão para incluir nova doação de roupas e calçados">Nova Doação</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th><b>Doador</b></th>
                                <th><b>Criança</b></th>
                                <th><b>Roupa/Calçado Entregue?</b></th>
                                <th><b>Brinquedo Entregue?</b></th>
                                <th><b>Ações</b></th>
                            </tr>
                        </thead>
                        <tbody v-if="childContributions.length > 0">
                            <tr v-for="childContribution in childContributions" :key="childContribution.id">
                                <td>{{ childContribution.sponsorName }}</td>
                                <td>{{ childContribution.childName }}</td>
                                <td>{{ setWasDelivered(childContribution.wasDelivered) }}</td>
                                <td>{{ setIsToyDelivered(childContribution.toyDelivered) }}</td>
                                <td>
                                    <RouterLink :to="{ path: '/child-contribution/' + childContribution.id + '/edit' }"
                                        class="btn btn-success">Alterar</RouterLink>
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
import type { childContribution } from '@/models/child_contribution';
import axios from 'axios';
export default {
    name: 'ChildContributionView',
    data() {
        return {
            childContributions: [] as childContribution[],
            statusMessage: 'Carregando Doações...'
        }
    },
    mounted() {
        this.getChildContributions();
    },
    methods: {
        getChildContributions() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = '/api/child-contribution';

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then(response => {
                if (response.data.length > 0) {
                    this.childContributions = response.data;
                    this.statusMessage = '';
                } else {
                    this.statusMessage = 'Nenhuma doação encontrada.';
                }
            })
            .catch(error => {
                console.error(error);
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
        setIsToyDelivered(toyDelivered: string | boolean) {
            switch (toyDelivered) {
                case true:
                    return "Sim";
                case false:
                    return "Não";
                default:
                    return "Não Informado";
            }
        },        
    }
}
</script>