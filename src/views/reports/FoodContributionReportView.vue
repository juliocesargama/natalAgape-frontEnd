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

                    <div>
                        <PieChart class="m-3" :chart-data="chartData" :chart-options="chartOptions" v-if="loadChart" />
                    </div>

                    <div class="row mt-3">
                        <h6 class="text-center">Total de famílias: {{ totalActiveFamilies }}</h6>
                    </div>
                    <hr>

                    <div class="table-responsive" v-show="familiesWithContributionList.length > 0">
                        <table class="table table-striped table-hover caption-top">
                            <caption class="text-center">
                                <h5>Famílias com doações</h5>
                            </caption>
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
                        <div class="text-end">
                            <button class="btn btn-success" @click="exportfamiliesWithContributionReport">Exportar
                                Relatório</button>
                        </div>
                        <hr>
                    </div>

                    <div class="table-responsive" v-show="familiesWithPendingContributionList.length > 0">
                        <table class="table table-striped table-hover caption-top mt-3">
                            <caption class="text-center">
                                <h5>Famílias com doações pendentes</h5>
                            </caption>
                            <thead>
                                <tr>
                                    <th><b>Família</b></th>
                                    <th><b>Total de Crianças</b></th>
                                    <th><b>Doador</b></th>
                                    <th><b>Telefone do Doador</b></th>
                                    <th><b>Em Dinheiro</b></th>
                                    <th><b>Líder</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="family in familiesWithPendingContributionList" :key="family.responsibleName">
                                    <td>{{ family.responsibleName }}</td>
                                    <td>{{ family.totalChildren }}</td>
                                    <td>{{ family.sponsorName }}</td>
                                    <td>{{ family.sponsorPhone }}</td>
                                    <td>{{ translatePaidInSpecies(family.paidInSpecies) }}</td>
                                    <td>{{ family.leaderName }}</td>

                                </tr>
                            </tbody>
                        </table>
                        <div class="text-end">
                            <button class="btn btn-success"
                                @click="exportfamiliesWithPendingContributionReport">Exportar
                                Relatório</button>
                        </div>
                        <hr>
                    </div>

                    <div class="table-responsive" v-show="familiesWithNoContributionList.length > 0">
                        <table class="table table-striped table-hover caption-top mt-3">
                            <caption class="text-center">
                                <h5>Famílias sem doações</h5>
                            </caption>
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
                        <div class="text-end">
                            <button class="btn btn-success" @click="exportfamiliesWithNoContributionReport">Exportar
                                Relatório</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import type { campaign } from '@/models/campaign';
import axios from 'axios';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import PieChart from '@/components/PieChart.vue';

import type { FamilyWithContribution } from '@/models/reports/food-contribution/family_with_contribution';
import type { FamilyWithNoContribution } from '@/models/reports/food-contribution/family_without_contribution';
import type { FamilyWithPendingContribution } from '@/models/reports/food-contribution/family_with_pending_contribution';

export default {
    name: 'FoodContributionReportView',
    components: { PieChart },
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

            loadChart: false,
            chartData: null as { labels: string[]; datasets: {data: number[]; backgroundColor: string[]; }[] } | null,
            chartOptions: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Relação de Doações de Cestas Básicas',
                        font: {
                            size: 18
                        }
                    }
                }
            }
        }
    },
    mounted() {
        this.loadChart = false;
        this.getCampaigns();
    },
    methods: {
        getCampaigns() {
            try {
                axios.get('/api/campaign/all')
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
                        this.familiesWithContribution = response.data.familiesWithContribution;
                        this.familiesWithNoContribution = response.data.familiesWithNoContribution;
                        this.familiesWithPendingContribution = response.data.familiesWithPendingContribution;
                        this.totalActiveFamilies = response.data.totalActiveFamilies;

                        this.familiesWithContributionList = response.data.familiesWithContributionList;
                        this.familiesWithNoContributionList = response.data.familiesWithNoContributionList;
                        this.familiesWithPendingContributionList = response.data.familiesWithPendingContributionList;

                        this.chartData = {
                            labels: ['Famílias com doações', 'Famílias sem doações', 'Famílias com doações pendentes'],
                            datasets: [{
                                data: [
                                    this.familiesWithContribution,
                                    this.familiesWithNoContribution,
                                    this.familiesWithPendingContribution
                                ],
                                backgroundColor: [
                                    '#198754',
                                    '#dc3545',
                                    '#ffc107',
                                ],
                            }]
                        };
                        this.loadChart = true;
                    })
                    .catch((error) => {
                        console.error('Erro ao carregar relatório', error);
                    });
            }
        },
        onCampaignChange() {
            this.getReport();
            this.loadChart = false;
            this.chartData = null;
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
        translatePaidInSpecies(paidInSpecies: boolean) {
            switch (paidInSpecies) {
                case true:
                    return 'Sim';
                case false:
                    return 'Não';
                default:
                    return paidInSpecies;
            }
        },
        exportfamiliesWithContributionReport() {
            const doc = new jsPDF('l', 'pt', 'a4');

            // Title
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Famílias com Doações', 40, 40);

            // Subtitle
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 40, 60);

            // Table data
            const tableData = this.familiesWithContributionList.map(item => [
                item.responsibleName,
                item.leaderName,
                this.translateColor(item.leaderColor),
            ]);

            // AutoTable
            autoTable(doc, {
                head: [['Família', 'Líder', 'Cor']],
                body: tableData,
                startY: 80,
                styles: {
                    cellPadding: 5,
                    fontSize: 10,
                    valign: 'middle',
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [25, 135, 84],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 'auto' },
                }
            });

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 20);
            }

            doc.save('familias-com-contribuição.pdf');

        },
        exportfamiliesWithNoContributionReport() {
            const doc = new jsPDF('l', 'pt', 'a4');

            // Title
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Famílias sem Doações', 40, 40);

            // Subtitle
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 40, 60);

            // Table data
            const tableData = this.familiesWithNoContributionList.map(item => [
                item.responsibleName,
                item.neighborhoodName,
                item.totalChildren,
            ]);

            // AutoTable
            autoTable(doc, {
                head: [['Família', 'Bairro', 'Total de Crianças']],
                body: tableData,
                startY: 80,
                styles: {
                    cellPadding: 5,
                    fontSize: 10,
                    valign: 'middle',
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [25, 135, 84],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 'auto' },
                }
            });

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 20);
            }

            doc.save('familias-sem-contribuição.pdf');

        },
        exportfamiliesWithPendingContributionReport() {
            const doc = new jsPDF('l', 'pt', 'a4');

            // Title
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Famílias com Doações Pendentes', 40, 40);

            // Subtitle
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 40, 60);

            // Table data
            const tableData = this.familiesWithPendingContributionList.map(item => [
                item.responsibleName,
                item.totalChildren,
                item.sponsorName,
                item.sponsorPhone,
                this.translatePaidInSpecies(item.paidInSpecies),
                item.leaderName,
            ]);

            // AutoTable
            autoTable(doc, {
                head: [['Família', 'Total de Crianças', 'Doador', 'Telefone do Doador', 'Em Dinheiro', 'Líder']],
                body: tableData,
                startY: 80,
                styles: {
                    cellPadding: 5,
                    fontSize: 10,
                    valign: 'middle',
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [25, 135, 84],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 'auto' },
                    3: { cellWidth: 'auto' },
                    4: { cellWidth: 'auto' },
                    5: { cellWidth: 'auto' },
                }
            });

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 20);
            }

            doc.save('familias-com-contribuição-pendente.pdf');

        },
    },
}
</script>