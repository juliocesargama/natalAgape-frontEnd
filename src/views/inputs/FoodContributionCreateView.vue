<template>
    <div class="container mt-5">
        <div class="card mb-3">
            <div class="card-header">
                <h3 aria-label="Cadastro de nova doação de cestas básicas">Nova Doação de Cestas Básicas</h3>
            </div>
            <div class="card-body mb-0">
                <ul class="alert alert-danger" v-if="errorList.length > 0">
                    <div class="mb-0 ms-3">
                        <ul>
                            <li v-for="error in errorList">{{ error }}</li>
                        </ul>
                    </div>
                </ul>
                <div class="container">
                    <label for="campaignId" class="form-label">Campanha</label>
                    <select v-model="model.campaignId" class="form-control selectpicker show-tick" id="campaignId"
                        title="Selecione uma campanha...">
                        <option v-for="campaign in campaigns" :value="campaign.campaignId"> {{ campaign.campaignYear }}
                            |
                            {{ campaign.campaignChurch }}</option>
                    </select>
                    <label for="sponsorId" class="form-label">Doador</label>
                    <select v-model="model.sponsorId" data-live-search="true"
                        class="form-control selectpicker show-tick" id="sponsorId" title="Selecione um doador...">
                        <option v-for="sponsor in sponsors" :value="sponsor.sponsorId">{{ sponsor.sponsorName }}
                        </option>
                    </select>
                    <label for="familyId" class="form-label">Família</label>
                    <select v-model="model.familyId" data-live-search="true" class="form-control selectpicker show-tick"
                        id="familyId" title="Selecione uma família...">
                        <option v-for="family in families" :value="family.familyId">{{ family.responsibleName }}
                        </option>
                    </select>
                    <label for="leaderId" class="form-label">Líder</label>
                    <select v-model="model.leaderId" data-live-search="true" class="form-control selectpicker show-tick"
                        id="leaderId" title="Selecione um líder...">
                        <option v-for="leader in leaders" :value="leader.leaderId">{{ leader.leaderName }}
                        </option>
                    </select>

                    <div class="form-check mt-3">
                        <label for="paidInSpecies" class="form-label">Foi/Será pago em dinheiro?</label>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="paidInSpecies" id="paidInSpeciesYes"
                                :value="true" v-model="model.paidInSpecies">
                            <label class="form-check-label" for="paidInSpeciesYes">
                                Sim
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="paidInSpecies" id="paidInSpeciesNo"
                                :value="false" v-model="model.paidInSpecies">
                            <label class="form-check-label" for="paidInSpeciesNo">
                                Não
                            </label>
                        </div>
                    </div>

                    <div class="form-check mt-3">
                        <label for="wasDelivered" class="form-label">A doação já foi realizada?</label>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="wasDeliveredYes" id="wasDeliveredYes"
                                :value="true" v-model="model.wasDelivered">
                            <label class="form-check-label" for="wasDelivered">
                                Sim
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="wasDeliveredNo" id="wasDeliveredNo"
                                :value="false" v-model="model.wasDelivered" @change="clearDonationDate">
                            <label class="form-check-label" for="wasDelivered">
                                Não
                            </label>
                        </div>
                    </div>

                    <div class="container" v-show="model.wasDelivered">
                        <label for="donationDate" class="form-label">Data da doação</label>
                        <input type="date" v-model="model.donationDate" class="form-control" id="donationDate">
                        <div class="form-text">Ao preencher a data em que a doação foi realizada, será dada como
                            concluída.</div>
                    </div>

                    <label for="observation" class="form-label mt-3">Observação</label>
                    <textarea v-model="model.observation" class="form-control" id="observation" rows="2"></textarea>
                    <div class="mt-3">
                        <button type="button" class="btn btn-success" @click="validateForm()">Salvar</button>
                        <RouterLink to="/food-contribution" class="btn btn-secondary ms-2">Voltar</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { campaign } from '@/models/campaign';
import type { family } from '@/models/family';
import type { leadership } from '@/models/leadership';
import type { sponsor } from '@/models/sponsor';
import axios from 'axios';

export default {
    name: 'FoodContributionCreateView',
    data() {
        return {
            campaigns: [] as campaign[],
            sponsors: [] as sponsor[],
            families: [] as family[],
            leaders: [] as leadership[],
            errorList: [] as string[],
            model: {
                campaignId: 0,
                sponsorId: 0,
                familyId: 0,
                leaderId: 0,
                wasDelivered: false,
                paidInSpecies: false,
                donationDate: null,
                observation: "",
            }
        };
    },
    mounted() {
        this.getCampaigns();
        this.getSponsors();
        this.getFamilies();
        this.getLeaders();
    },
    methods: {
        getCampaigns() {

            var $this = this;
            var url = "/api/campaign";
            axios.get(url)
                .then((response) => {
                    this.campaigns = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    $this.errorList.push("Erro ao carregar campanhas");
                });
        },
        getSponsors() {
            var $this = this;
            var url = "/api/sponsor";
            axios.get(url)
                .then((response) => {
                    this.sponsors = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    $this.errorList.push("Erro ao carregar doadores");
                });
        },
        getFamilies() {
            var $this = this;
            var url = "/api/family";
            axios.get(url)
                .then((response) => {
                    this.families = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    $this.errorList.push("Erro ao carregar famílias");
                });
        },
        getLeaders() {
            var $this = this;
            var url = "/api/leadership";
            axios.get(url)
                .then((response) => {
                    this.leaders = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    $this.errorList.push("Erro ao carregar líderes");
                });
        },
        saveContribution() {

            console.log(this.model);

            var $this = this;
            var url = "/api/food-contribution";
            axios.post(url, {
                campaignId: this.model.campaignId,
                sponsorId: this.model.sponsorId,
                familyId: this.model.familyId,
                leaderId: this.model.leaderId,
                wasDelivered: this.model.wasDelivered,
                paidInSpecies: this.model.paidInSpecies,
                donationDate: this.model.donationDate,
                observation: this.model.observation,
            })
                .then(() => {
                    this.$router.push('/food-contribution');
                })
                .catch(function (error) {
                    if (error.response.status === 403) {
                        $this.errorList.push("A família já atingiu a quantidade de doações permitidas nesta campanha.");
                    } else {
                        $this.errorList.push("Erro ao salvar doação, verifique os dados e tente novamente.");
                    }
                });
        },
        validateForm() {
            console.log(this.model.donationDate);
            console.log(this.model.wasDelivered);

            this.errorList = [];
            if (this.model.campaignId === 0) {
                this.errorList.push("Selecione uma campanha");
            }
            if (this.model.sponsorId === 0) {
                this.errorList.push("Selecione um doador");
            }
            if (this.model.familyId === 0) {
                this.errorList.push("Selecione uma família");
            }
            if (this.model.leaderId === 0) {
                this.errorList.push("Selecione um líder");
            }
            
            if (this.model.wasDelivered && this.model.donationDate !== null) {
                const today = new Date();
                const donationDate = new Date(this.model.donationDate);
                if (donationDate > today) {
                    this.errorList.push("A data da doação não pode ser maior que a data atual");
                }
            }
            if (this.model.wasDelivered && this.model.donationDate === null) {
                this.errorList.push("Preencha a data da doação");
            }
            if (this.model.wasDelivered === false) {
                this.model.donationDate = null;
            }
            if (this.model.paidInSpecies === null) {
                this.errorList.push("Selecione se a doação foi ou será paga em dinheiro");
            }
            if (this.model.wasDelivered === null) {
                this.errorList.push("Selecione se a doação já foi realizada");
            }
            if (!this.errorList.length) {
                this.saveContribution();
            }
        },
        clearDonationDate() {
            this.model.donationDate = null;
        },
    },
};
</script>