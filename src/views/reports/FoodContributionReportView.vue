<template>
    <div class="container mt-5 mb-3">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Relatório de Cestas Básicas</h3>
            </div>
            <div class="card-body">
                <label for="campaignSelect" class="form-label">Selecione a campanha</label>
                <select id="campaignSelect" class="form-select" v-model="selectedCampaign" @change="onCampaignChange">
                    <option v-for="campaign in campaigns" :key="campaign.campaignId" :value="campaign.campaignId">
                        {{ campaign.campaignYear + ' | ' + campaign.campaignChurch }}
                    </option>
                </select>

                <div class="container" v-show="selectedCampaign">
                    <div class="row mt-3">
                        <div class="col">
                            <h5>Famílias com doações: {{ familiesWithContribution }}</h5>
                        </div>
                        <div class="col">
                            <h5>Famílias sem doações: {{ familiesWithNoContribution }}</h5>
                        </div>
                        <div class="col">
                            <h5>Famílias com doações pendentes: {{ familiesWithPendingContribution }}</h5>
                        </div>
                        <div class="col">
                            <h5>Total de famílias ativas: {{ totalActiveFamilies }}</h5>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-striped table-hover caption-top mt-3">
                            <caption class="text-center"><h5>Famílias com doações</h5></caption>
                            <thead>
                                <tr>
                                    <th><b>Família</b></th>
                                    <th><b>Líder</b></th>
                                    <th><b>Cor</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="family in familiesWithContributionList" :key="family.responsibleName">
                                    <td>{{ family.responsibleName }}</td>
                                    <td>{{ family.leaderName }}</td>
                                    <td>{{ translateColor(family.leaderColor) }}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-striped table-hover caption-top mt-3">
                            <caption class="text-center"><h5>Famílias com doações pendentes</h5></caption>
                            <thead>
                                <tr>
                                    <th><b>Família</b></th>
                                    <th><b>Total de Crianças</b></th>
                                    <th><b>Doador</b></th>
                                    <th><b>Telefone do Doador</b></th>
                                    <th><b>Líder</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="family in familiesWithPendingContributionList" :key="family.responsibleName">
                                    <td>{{ family.responsibleName }}</td>
                                    <td>{{ family.totalChildren }}</td>
                                    <td>{{ family.sponsorName }}</td>
                                    <td>{{ family.sponsorPhone }}</td>
                                    <td>{{ family.leaderName }}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-striped table-hover caption-top mt-3">
                            <caption class="text-center"><h5>Famílias sem doações</h5></caption>
                            <thead>
                                <tr>
                                    <th><b>Família</b></th>
                                    <th><b>Bairro</b></th>
                                    <th><b>Total de Crianças</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="family in familiesWithNoContributionList" :key="family.responsibleName">
                                    <td>{{ family.responsibleName }}</td>
                                    <td>{{ family.neighborhoodName }}</td>
                                    <td>{{ family.totalChildren }}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import type { campaign } from '@/models/campaign';
import axios from 'axios';
import type { FamilyWithContribution } from '@/models/reports/food-contribution/family_with_contribution';
import type { FamilyWithNoContribution } from '@/models/reports/food-contribution/family_without_contribution';
import type { FamilyWithPendingContribution } from '@/models/reports/food-contribution/family_with_pending_contribution';

export default {
    name: 'FoodContributionReportView',
    components: {},
    data() {
        return {
            campaigns: [] as campaign[],
            selectedCampaign: null as number | null,

            familiesWithContribution: 0,
            familiesWithNoContribution: 0,
            familiesWithPendingContribution: 0,
            totalActiveFamilies: 0,
            familiesWithContributionList: [] as FamilyWithContribution[],
            familiesWithNoContributionList: [] as FamilyWithNoContribution[],
            familiesWithPendingContributionList: [] as FamilyWithPendingContribution[],
        };
    },
    mounted() {
        this.getCampaigns();
    },
    methods: {
        getCampaigns() {
            try {
                axios.get('/api/campaign')
                    .then((response) => {
                        this.campaigns = response.data;
                    });
            } catch (error) {
                console.error('Erro ao carregar campanhas', error);
            }
        },
        getReport() {
            if (this.selectedCampaign) {
                axios.get(`/api/food-contribution/report/${this.selectedCampaign}`)
                    .then((response) => {
                        console.log(response.data);
                        this.familiesWithContribution = response.data.familiesWithContribution;
                        this.familiesWithNoContribution = response.data.familiesWithNoContribution;
                        this.familiesWithPendingContribution = response.data.familiesWithPendingContribution;
                        this.totalActiveFamilies = response.data.totalActiveFamilies;

                        this.familiesWithContributionList = response.data.familiesWithContributionList;
                        this.familiesWithNoContributionList = response.data.familiesWithNoContributionList;
                        this.familiesWithPendingContributionList = response.data.familiesWithPendingContributionList;
                    })
                    .catch((error) => {
                        console.error('Erro ao carregar relatório', error);
                    });
            }
        },
        onCampaignChange() {
            this.getReport();
        },
        translateColor(color: string) {
            switch (color) {
                case 'RED':
                    return 'Vermelho';
                case 'BLUE':
                    return 'Azul';
                case 'GREEN':
                    return 'Verde';
                case 'YELLOW':
                    return 'Amarelo';
                case 'ORANGE':
                    return 'Laranja';
                case 'PURPLE':
                    return 'Roxo';
                case 'PINK':
                    return 'Rosa';
                case 'BROWN':
                    return 'Marrom';
                case 'BLACK':
                    return 'Preto';
                case 'WHITE':
                    return 'Branco';
                default:
                    return color;
            }
        },
    },
}
</script>