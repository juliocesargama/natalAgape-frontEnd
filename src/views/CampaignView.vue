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
                            <th><b>Ações</b></th>
                        </tr>
                    </thead>
                    <tbody v-if="campaigns.length > 0">
                        <tr v-for="campaign in campaigns" :key="campaign.campaignId">
                            <td>{{ campaign.campaignYear }}</td>
                            <td>{{ campaign.campaignChurch }}</td>
                            <td><RouterLink :to="{path: '/campaign/'+campaign.campaignId +'/edit'}" class="btn btn-success me-3" aria-describedby="Botão para alterar a campanha">Alterar</RouterLink>
                            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalFecharCampanha" @click="campaignToClose = campaign.campaignId"
                            aria-describedby="Botão para excluir a campanha">Fechar Campanha</button></td>
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

    <div class="modal fade" id="modalFecharCampanha" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalFecharCampanha" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalFecharCampanha">Fechar Campanha</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cancelar Encerramento"></button>
                </div>
                <div class="modal-body">
                    Tem certeza que deseja encerrar a campanha?
                    <br><br>
                    <strong>Essa ação não poderá ser desfeita e novas doações não poderão ser atribuídas nesta campanha.</strong>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" @click="closeCampaign(campaignToClose)"
                        data-bs-dismiss="modal">Confirmar</button>
                </div>
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
            statusMessage: 'Carregando Campanhas...',
            campaignToClose: 0,
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
        },
        closeCampaign(campaignId: number) {
            var url = 'api/campaign/' + campaignId;
            return axios.delete(url).then(result => {
                if (result.status == 200) {
                    this.getcampaigns();
                    this.$router.push({ path: '/campaign' });

                } else if (result.status == 204) {
                    this.statusMessage = 'Nenhuma campanha encontrada.';
                } else {
                    this.statusMessage = 'Erro ao encerrar campanha, tente novamente mais tarde.';
                }
            }).catch(() => {
                this.statusMessage = 'Erro ao encerrar campanha, tente novamente mais tarde.';
            });
        }
    },
}
</script>

