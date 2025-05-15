<template>
    <div class="container mt-5">
        <div class="card mb-3">
            <div class="card-header">
                <h3 aria-label="Alteração de doação de cestas básicas existente">Alterar Doação de Cestas Básicas</h3>
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
                    <label for="campaignId" class="form-label" aria-labelledby="Selecione a campanha">Campanha*</label>
                    <select v-model="model.campaignId" class="form-control selectpicker show-tick" id="campaignId"
                        title="Selecione uma campanha...">
                        <option v-for="campaign in campaigns" :value="campaign.campaignId"> {{ campaign.campaignYear }}
                            |
                            {{ campaign.campaignChurch }}</option>
                    </select>
                    <label for="sponsorId" class="form-label" aria-labelledby="Selecione o doador">Doador*</label>
                    <select v-model="model.sponsorId" data-live-search="true"
                        class="form-control selectpicker show-tick" id="sponsorId" title="Selecione um doador...">
                        <option v-for="sponsor in sponsors" :value="sponsor.sponsorId">{{ sponsor.sponsorName }}
                        </option>
                    </select>
                    <label for="familyId" class="form-label" aria-labelledby="Selecione a família">Família*</label>
                    <select v-model="model.familyId" data-live-search="true" class="form-control selectpicker show-tick"
                        id="familyId" title="Selecione uma família...">
                        <option v-for="family in families" :value="family.familyId">{{ family.responsibleName }}
                        </option>
                    </select>
                    <label for="leaderId" class="form-label" aria-labelledby="Selecione o lider">Líder*</label>
                    <select v-model="model.leaderId" data-live-search="true" class="form-control selectpicker show-tick"
                        id="leaderId" title="Selecione um líder...">
                        <option v-for="leader in leaders" :value="leader.leaderId">{{ leader.leaderName }}
                        </option>
                    </select>

                    <div class="form-check mt-3">
                        <label for="paidInSpecies" class="form-label"
                            aria-labelledby="Doação paga em dinheiro? Seleção">Foi/Será pago em dinheiro?*</label>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="paidInSpecies" id="paidInSpeciesYes"
                                :value="true" v-model="model.paidInSpecies">
                            <label class="form-check-label" for="paidInSpeciesYes"
                                aria-labelledby="Doação paga em dinheiro? Sim">
                                Sim
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="paidInSpecies" id="paidInSpeciesNo"
                                :value="false" v-model="model.paidInSpecies">
                            <label class="form-check-label" for="paidInSpeciesNo"
                                aria-labelledby="Doação paga em dinheiro? Não">
                                Não
                            </label>
                        </div>
                    </div>

                    <div class="form-check mt-3">
                        <label for="wasDelivered" class="form-label"
                            aria-labelledby="A doação já foi realizada? Selecione">A doação já foi realizada?*</label>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="wasDeliveredYes" id="wasDeliveredYes"
                                :value="true" v-model="model.wasDelivered">
                            <label class="form-check-label" for="wasDelivered"
                                aria-labelledby="A doação já foi realizada? Sim">
                                Sim
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="wasDeliveredNo" id="wasDeliveredNo"
                                :value="false" v-model="model.wasDelivered" @change="clearDonationDate">
                            <label class="form-check-label" for="wasDelivered"
                                aria-labelledby="A doação já foi realizada? Não">
                                Não
                            </label>
                        </div>
                    </div>

                    <div class="container" v-show="model.wasDelivered">
                        <label for="donationDate" class="form-label" aria-labelledby="Data da doação">Data da
                            doação</label>
                        <input type="date" v-model="model.donationDate" class="form-control" id="donationDate">
                        <div class="form-text">Ao preencher a data em que a doação foi realizada, será dada como
                            concluída.</div>
                    </div>

                    <label for="observation" class="form-label mt-3" aria-labelledby="Observação">Observação</label>
                    <textarea v-model="model.observation" class="form-control" id="observation" rows="2"></textarea>
                    <div class="float-end mt-3">
                        <button type="button" class="btn btn-success" @click="validateForm()"
                            aria-label="Botão alterar a doação">Alterar</button>
                        <RouterLink to="/food-contribution" class="btn btn-secondary ms-2"
                            aria-label="Cancelar o cadastro">Voltar</RouterLink>
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
import type { campaign } from '@/models/campaign';
import type { family } from '@/models/family';
import type { Leader } from '@/models/leader';
import type { sponsor } from '@/models/sponsor';
import axios from 'axios';


export default {
    name: 'FoodContributionEditView',
    data() {
        return {
            campaigns: [] as campaign[],
            sponsors: [] as sponsor[],
            families: [] as family[],
            leaders: [] as Leader[],
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
        this.getFoodContribution();
    },
    methods: {
        getFoodContribution() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = "/api/food-contribution/" + this.$route.params.id;

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then((response) => {
                this.model = response.data;
            })
            .catch((error) => {
                console.log(error);
                this.errorList.push("Erro ao carregar doação");
            });
        },
        getCampaigns() {
            const token = localStorage.getItem("jwtToken");
            const url = "/api/campaign";

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                this.campaigns = response.data;
            })
            .catch((error) => {
                console.log(error);
                this.errorList.push("Erro ao carregar campanhas");
            });
        },
        getSponsors() {
            const token = localStorage.getItem("jwtToken");
            const url = "/api/sponsor";

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                this.sponsors = response.data;
            })
            .catch((error) => {
                console.log(error);
                this.errorList.push("Erro ao carregar doadores");
            });
        },
        getFamilies() {
            const token = localStorage.getItem("jwtToken");
            const url = "/api/family";

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                this.families = response.data;
            })
            .catch((error) => {
                console.log(error);
                this.errorList.push("Erro ao carregar famílias");
            });
        },
        getLeaders() {
            const token = localStorage.getItem("jwtToken");
            const url = "/api/leadership";

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                this.leaders = response.data;
            })
            .catch((error) => {
                console.log(error);
                this.errorList.push("Erro ao carregar líderes");
            });
        },
        validateForm() {
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
            if (this.model.wasDelivered === false) {
                this.model.donationDate = null;
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

            if (this.model.paidInSpecies === null) {
                this.errorList.push("Selecione se a doação foi paga em dinheiro");
            }

            console.log(this.errorList.length);

            if (this.errorList.length === 0) {
                this.editFoodContribution();
            }
        },
        editFoodContribution() {
            const token = localStorage.getItem("jwtToken");
            const url = "/api/food-contribution/" + this.$route.params.id;

            axios.put(url, {
                campaignId: this.model.campaignId,
                sponsorId: this.model.sponsorId,
                familyId: this.model.familyId,
                leaderId: this.model.leaderId,
                wasDelivered: this.model.wasDelivered,
                paidInSpecies: this.model.paidInSpecies,
                donationDate: this.model.donationDate,
                observation: this.model.observation
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                this.$router.push('/food-contribution');
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    this.errorList.push("A família já possui doação cadastrada nesta campanha.");
                } else {
                    this.errorList.push("Erro ao salvar doação, verifique os dados e tente novamente.");
                }
            });
        },
        clearDonationDate() {
            this.model.donationDate = null;
        }
    }
}
</script>