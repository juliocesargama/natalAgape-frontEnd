<template>
    <div class="container mt-5 mb-3">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Relatório de Roupas e Calçados</h3>
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
                        <h6 class="text-center">Total de crianças: {{ totalChildren }}</h6>
                    </div>
                    <hr>

                    <div class="table-responsive" v-show="childrenWithContributionList.length > 0">
                        <table class="table table-striped table-hover caption-top">
                            <caption class="text-center">
                                <h5>Crianças com doações</h5>
                            </caption>
                            <thead>
                                <tr>
                                    <th><b>Responsável</b></th>
                                    <th><b>Criança</b></th>
                                    <th><b>Líder</b></th>
                                    <th><b>Cor</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="child in childrenWithContributionList" :key="child.childName">
                                    <td>{{ child.responsibleName }}</td>
                                    <td>{{ child.childName }}</td>
                                    <td>{{ child.leaderName }}</td>
                                    <td>{{ translateColor(child.leaderColor) }}</td>

                                </tr>
                            </tbody>
                        </table>
                        <div class="text-end">
                            <button class="btn btn-success" @click="exportchildrenWithContributionReport">Exportar
                                Relatório</button>
                        </div>
                        <hr>
                    </div>

                    <div class="table-responsive" v-show="childrenWithPendingContributionList.length > 0">
                        <table class="table table-striped table-hover caption-top mt-3">
                            <caption class="text-center">
                                <h5>Crianças com doações pendentes</h5>
                            </caption>
                            <thead>
                                <tr>
                                    <th><b>Responsável</b></th>
                                    <th><b>Criança</b></th>
                                    <th><b>Doador</b></th>
                                    <th><b>Telefone do Doador</b></th>
                                    <th><b>Líder</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="child in childrenWithPendingContributionList" :key="child.childName">
                                    <td>{{ child.responsibleName }}</td>
                                    <td>{{ child.childName }}</td>
                                    <td>{{ child.sponsorName }}</td>
                                    <td>{{ child.sponsorPhone }}</td>
                                    <td>{{ child.leaderName }}</td>

                                </tr>
                            </tbody>
                        </table>
                        <div class="text-end">
                            <button class="btn btn-success"
                                @click="exportchildrenWithPendingContributionReport">Exportar
                                Relatório</button>
                        </div>
                        <hr>
                    </div>

                    <div class="table-responsive" v-show="childrenWithNoContributionList.length > 0">
                        <table class="table table-striped table-hover caption-top mt-3">
                            <caption class="text-center">
                                <h5>Crianças sem doações</h5>
                            </caption>
                            <thead>
                                <tr>
                                    <th><b>Responsável</b></th>
                                    <th><b>Criança</b></th>
                                    <th><b>Bairro</b></th>
                                    <th><b>Líder</b></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="child in childrenWithNoContributionList" :key="child.childName">
                                    <td>{{ child.responsibleName }}</td>
                                    <td>{{ child.childName }}</td>
                                    <td>{{ child.neighborhoodName }}</td>
                                    <td>{{ child.leaderName }}</td>

                                </tr>
                            </tbody>
                        </table>
                        <div class="text-end">
                            <button class="btn btn-success" @click="exportchildrenWithNoContributionReport">Exportar
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

import type { ChildWithContribution } from '@/models/reports/child-contribution/child_with_contribution';
import type { ChildWithNoContribution } from '@/models/reports/child-contribution/child_without_contribution.ts';
import type { ChildWithPendingContribution } from '@/models/reports/child-contribution/child_with_pending_contribution';

export default {
    name: 'FoodContributionReportView',
    components: { PieChart },
    data() {
        return {
            campaigns: [] as campaign[],
            selectedCampaign: null as number | null,

            childWithContribution: 0,
            childWithNoContribution: 0,
            childWithPendingContribution: 0,
            totalChildren: 0,
            childrenWithContributionList: [] as ChildWithContribution[],
            childrenWithNoContributionList: [] as ChildWithNoContribution[],
            childrenWithPendingContributionList: [] as ChildWithPendingContribution[],

            loadChart: false,
            chartData: null as { labels: string[]; datasets: {data: number[]; backgroundColor: string[]; }[] } | null,
            chartOptions: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Relação de Doações de Roupas e Calçados',
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
                axios.get(`/api/child-contribution/report/${this.selectedCampaign}`)
                    .then((response) => {
                        this.childWithContribution = response.data.childWithContribution;
                        this.childWithNoContribution = response.data.childWithNoContribution;
                        this.childWithPendingContribution = response.data.childWithPendingContribution;
                        this.totalChildren = response.data.totalChildren;

                        this.childrenWithContributionList = response.data.childrenWithContributionList;
                        this.childrenWithNoContributionList = response.data.childrenWithNoContributionList;
                        this.childrenWithPendingContributionList = response.data.childrenWithPendingContributionList;

                        this.chartData = {
                            labels: ['Crianças com doações', 'Crianças sem doações', 'Crianças com doações pendentes'],
                            datasets: [{
                                data: [
                                    this.childWithContribution,
                                    this.childWithNoContribution,
                                    this.childWithPendingContribution
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
        exportchildrenWithContributionReport() {
            const doc = new jsPDF('l', 'pt', 'a4');

            // Title
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Crianças com Doações', 40, 40);

            // Subtitle
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 40, 60);

            // Table data
            const tableData = this.childrenWithContributionList.map(item => [
                item.responsibleName,
                item.childName,
                item.leaderName,
                this.translateColor(item.leaderColor),
            ]);

            // AutoTable
            autoTable(doc, {
                head: [['Responsável','Criança', 'Líder', 'Cor']],
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

            doc.save('criancas-com-contribuição.pdf');

        },
        exportchildrenWithNoContributionReport() {
            const doc = new jsPDF('l', 'pt', 'a4');

            // Title
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Crianças sem Doações', 40, 40);

            // Subtitle
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 40, 60);

            // Table data
            const tableData = this.childrenWithNoContributionList.map(item => [
                item.responsibleName,
                item.childName,
                item.neighborhoodName,
                item.leaderName,
            ]);

            // AutoTable
            autoTable(doc, {
                head: [['Responsável','Criança', 'Bairro', 'Líder']],
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

            doc.save('criancas-sem-contribuição.pdf');

        },
        exportchildrenWithPendingContributionReport() {
            const doc = new jsPDF('l', 'pt', 'a4');

            // Title
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text('Crianças com Doações Pendentes', 40, 40);

            // Subtitle
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 40, 60);

            // Table data
            const tableData = this.childrenWithPendingContributionList.map(item => [
                item.responsibleName,
                item.childName,
                item.sponsorName,
                item.sponsorPhone,
                item.leaderName,
            ]);

            // AutoTable
            autoTable(doc, {
                head: [['Responsável','Criança', 'Doador', 'Telefone do Doador', 'Líder']],
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

            doc.save('criancas-com-contribuição-pendente.pdf');

        },
    },
}
</script>