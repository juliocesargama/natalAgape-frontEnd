<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Campanhas
                    <RouterLink to="/campaign/create" class="btn btn-dark float-end" aria-describedby="Botão para incluir nova campanha">Nova Campanha</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th><b>Ano</b></th>
                            <th><b>Igreja</b></th>
                            <th><b>Alimento por Família</b></th>
                            <th><b>Ações</b></th>
                        </tr>
                    </thead>
                    <tbody v-if="campaigns.length > 0">
                        <tr v-for="campaign in campaigns" :key="campaign.campaignId">
                            <td>{{ campaign.campaignYear }}</td>
                            <td>{{ campaign.campaignChurch }}</td>
                            <td>{{ campaign.foodDonationPerFamily }}</td>
                            <td><RouterLink :to="{path: '/campaign/'+campaign.campaignId +'/edit'}" class="btn btn-success" aria-describedby="Botão para alterar a campanha">Alterar</RouterLink></td>
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
import { type campaign } from "../models/campaign";

export default {

    name: 'campaign-view',
    data() {
        return {
            campaigns: [] as campaign[],
            statusMessage: 'Carregando Campanhas...'
        }
    },
    mounted() {
        this.getcampaigns();
    },
    methods: {
        getcampaigns() {
            var url = 'api/campaign';
            return axios.get(url).then(result => {
                if (result.data.length > 0) {
                    this.campaigns = result.data;
                    this.statusMessage = '';
                } else {
                    this.statusMessage = 'Nenhuma campanha encontrada.';
                }
            }).catch(() => {
                this.statusMessage = 'Erro ao carregar campanhas, tente novamente mais tarde.';
            });
        }
    },
}
</script>

