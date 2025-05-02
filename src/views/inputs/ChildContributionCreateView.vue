<template>
    <div class="container mt-5">
        <div class="card mb-3">
            <div class="card-header">
                <h3 aria-label="Cadastro de nova doação de roupas e calçados">Nova Doação de Roupas e Calçados</h3>
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
                    <div class="form-check mt-3">
                        <label for="campaignId" class="form-label">Campanha*</label>
                        <select v-model="model.campaignId" class="form-control selectpicker show-tick" id="campaignId"
                            title="Selecione uma campanha...">
                            <option v-for="campaign in campaigns" :value="campaign.campaignId"> {{ campaign.campaignYear
                            }}
                                |
                                {{ campaign.campaignChurch }}</option>
                        </select>
                        <label for="sponsorId" class="form-label">Doador*</label>
                        <select v-model="model.sponsorId" data-live-search="true"
                            class="form-control selectpicker show-tick" id="sponsorId" title="Selecione um doador...">
                            <option v-for="sponsor in sponsors" :value="sponsor.sponsorId">{{ sponsor.sponsorName }}
                            </option>
                        </select>
                        <label for="leaderId" class="form-label">Líder*</label>
                        <select v-model="model.leaderId" data-live-search="true"
                            class="form-control selectpicker show-tick" id="leaderId" title="Selecione um líder...">
                            <option v-for="leader in leaders" :value="leader.leaderId">{{ leader.leaderName }}
                            </option>
                        </select>
                        <label for="childId" class="form-label">Criança*</label>
                        <select v-model="model.childId" data-live-search="true"
                            class="form-control selectpicker show-tick" id="childId" title="Selecione uma criança...">
                            <option v-for="child in children" :value="child.childId">{{ child.childName }}
                            </option>
                        </select>
                        
                        <label for="wasDelivered" class="form-label">A doação já foi realizada?*</label>
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
                        <RouterLink to="/child-contribution" class="btn btn-secondary ms-2">Voltar</RouterLink>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <p class="text-muted">* Campos obrigatórios</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { child } from '@/models/child';
import { Leader } from '@/models/Leader';
import { campaign } from '@/models/Campaign';
import { sponsor } from '@/models/Sponsor';
import axios from 'axios';
export default {
    name: 'ChildContributionCreateView',
    data() {
        return {
            campaigns: [] as campaign[],
            sponsors: [] as sponsor[],
            leaders: [] as Leader[],
            children: [] as Child[],
            errorList: [] as string[],
            model: {
                campaignId: null,
                sponsorId: null,
                childId: null,
                leaderId: null,
                wasDelivered: false,
                acceptance: null,
                observation: '',
            },
        };
    },
    mounted() {
        this.getCampaigns();
        this.getSponsors();
        this.getLeaders();
        this.getChildren();
    },
    methods: {
        validateForm() {
            this.errorList = [];
            if (!this.model.campaignId) {
                this.errorList.push('Selecione uma campanha.');
            }
            if (!this.model.sponsorId) {
                this.errorList.push('Selecione um doador.');
            }
            if (!this.model.childId) {
                this.errorList.push('Selecione uma criança.');
            }
            if (!this.model.leaderId) {
                this.errorList.push('Selecione um líder.');
            }
            if (this.model.wasDelivered && !this.model.donationDate) {
                this.errorList.push('Preencha a data da doação.');
            }
            if (this.errorList.length === 0) {
                this.saveContribution();
            }
        },
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
        getChildren() {
            var $this = this;
            var url = "/api/child";
            axios.get(url)
                .then((response) => {
                    this.children = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    $this.errorList.push("Erro ao carregar crianças");
                });
        },
        saveContribution() {
            var $this = this;
            var url = "/api/child-contribution";
            axios.post(url, {
                campaignId: this.model.campaignId,
                sponsorId: this.model.sponsorId,
                leaderId: this.model.leaderId,
                childId: this.model.childId,
                wasDelivered: this.model.wasDelivered,
                acceptance: this.model.acceptance,
                observation: this.model.observation,
            })
                .then((response) => {
                    if (response.status === 200) {
                        this.$router.push('/child-contribution');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    $this.errorList.push("Erro ao salvar doação");
                });
        },
        clearDonationDate() {
            this.model.donationDate = null;
        }
    },
};
</script>