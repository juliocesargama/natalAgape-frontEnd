<template>
    <div class="container mt-5">
        <div class="card mb-3">
            <div class="card-header">
                <h3 aria-label="Alteração de doação de roupas e calçados existente">Alterar Doação de Roupas e Calçados
                </h3>
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
                    <label for="childId" class="form-label" aria-labelledby="Selecione a criança">Criança*</label>
                    <div class="row g-3">
                        <div class="col">
                            <select v-model="model.childId" data-live-search="true"
                                class="form-control selectpicker show-tick" id="childId"
                                title="Selecione uma criança...">
                                <option v-for="child in children" :value="child.childId" @click="selectedChild = child"
                                    @change="selectedChild = child">{{ child.childName }}
                                </option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalVerCriança"
                                :disabled="!selectedChild.childId" @click="loadImageFromApi">Ver
                                Criança</button>
                        </div>
                    </div>
                    <label for="leaderId" class="form-label" aria-labelledby="Selecione o lider">Líder*</label>
                    <select v-model="model.leaderId" data-live-search="true" class="form-control selectpicker show-tick"
                        id="leaderId" title="Selecione um líder...">
                        <option v-for="leader in leaders" :value="leader.leaderId">{{ leader.leaderName }}
                        </option>
                    </select>

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
                                :value="false" v-model="model.wasDelivered" @change="clearAcceptanceDate()">
                            <label class="form-check-label" for="wasDelivered"
                                aria-labelledby="A doação já foi realizada? Não">
                                Não
                            </label>
                        </div>
                    </div>

                    <div class="container" v-show="model.wasDelivered">
                        <label for="acceptance" class="form-label" aria-labelledby="Data da doação">Data da
                            doação</label>
                        <input type="date" v-model="model.acceptance" class="form-control" id="acceptance">
                        <div class="form-text">Ao preencher a data em que a doação foi realizada, será dada como
                            concluída.</div>
                    </div>

                    <label for="observation" class="form-label mt-3" aria-labelledby="Observação">Observação</label>
                    <textarea v-model="model.observation" class="form-control" id="observation" rows="2"></textarea>
                    <div class="float-end mt-3">
                        <button type="button" class="btn btn-success" @click="validateForm()"
                            aria-label="Botão alterar a doação">Alterar</button>
                        <RouterLink to="/child-contribution" class="btn btn-secondary ms-2"
                            aria-label="Cancelar o cadastro">Voltar</RouterLink>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <p class="text-muted">* Campos obrigatórios</p>
            </div>
        </div>
        <div class="modal fade modal-sm-down" id="modalVerCriança" tabindex="-1" aria-labelledby="modalVerCriançaLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalVerCriançaLabel">{{ selectedChild.childName }}, {{
                            calculateAge(selectedChild.birthDate) }} ano(s) de idade</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="clearSelectedChild"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-6">
                                    <p><strong>Sapatos:</strong> {{ setClothesOrShoesValue(selectedChild.shoes) }}</p>
                                </div>
                                <div class="col-6">
                                    <p><strong>Roupas:</strong> {{ setClothesOrShoesValue(selectedChild.clothes) }}</p>
                                </div>
                            </div>
                            <img :src="imageObjectUrl || defaultImage" class="img-fluid" alt="Foto da criança"></img>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal"
                                @click="clearSelectedChild">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { campaign } from '@/models/campaign';
import type { child } from '@/models/child';
import type { Leader } from '@/models/leader';
import type { sponsor } from '@/models/sponsor';
import { onUnmounted } from 'vue';
import axios from 'axios';

export default {
    name: 'ChildContributionEditView',
    data() {
        return {
            campaigns: [] as campaign[],
            sponsors: [] as sponsor[],
            children: [] as child[],
            leaders: [] as Leader[],
            errorList: [] as string[],
            model: {
                campaignId: 0,
                sponsorId: 0,
                leaderId: 0,
                childId: 0,
                wasDelivered: false,
                acceptance: null,
                observation: "",
            },
            selectedChild: {} as child,
            imageObjectUrl: null as string | null,
            defaultImage: new URL('@/assets/profile.jpg', import.meta.url).href
        };
    },
    mounted() {
        this.getCampaigns();
        this.getSponsors();
        this.getChildren();
        this.getLeaders();
        this.getChildContribution();
    },
    methods: {
        getChildContribution() {
            var $this = this;
            var url = "/api/child-contribution/" + this.$route.params.id;
            axios.get(url)
                .then((response) => {
                    this.model = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    $this.errorList.push("Erro ao carregar doação");
                });
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
        validateForm() {
            this.errorList = [];
            if (this.model.campaignId === 0) {
                this.errorList.push("Selecione uma campanha");
            }
            if (this.model.sponsorId === 0) {
                this.errorList.push("Selecione um doador");
            }
            if (this.model.childId === 0) {
                this.errorList.push("Selecione uma criança");
            }
            if (this.model.leaderId === 0) {
                this.errorList.push("Selecione um líder");
            }
            if (this.model.wasDelivered === false) {
                this.model.acceptance = null;
            }
            if (this.model.wasDelivered && this.model.acceptance !== null) {
                const today = new Date();
                const acceptance = new Date(this.model.acceptance);
                if (acceptance > today) {
                    this.errorList.push("A data da doação não pode ser maior que a data atual");
                }
            }

            if (this.model.wasDelivered && this.model.acceptance === null) {
                this.errorList.push("Preencha a data da doação");
            }

            if (this.errorList.length === 0) {
                this.editChildContribution();
            }
        },
        editChildContribution() {
            var $this = this;
            var url = "/api/child-contribution/" + this.$route.params.id;
            axios.put(url, {
                campaignId: this.model.campaignId,
                sponsorId: this.model.sponsorId,
                childId: this.model.childId,
                leaderId: this.model.leaderId,
                wasDelivered: this.model.wasDelivered,
                acceptance: this.model.acceptance,
                observation: this.model.observation
            })
                .then(() => {
                    this.$router.push('/child-contribution');
                })
                .catch(function (error) {
                    if (error.response.status === 403) {
                        $this.errorList.push("A criança já possui doação cadastrada nesta campanha.");
                    } else {
                        $this.errorList.push("Erro ao salvar doação, verifique os dados e tente novamente.");
                    }
                });
        },
        clearAcceptanceDate() {
            this.model.acceptance = null;
        },
        async loadImageFromApi() {
            if (this.selectedChild.pictureUrl) {
                try {
                    const response = await axios.get('/api/upload/open/' + this.selectedChild.pictureUrl, {
                        responseType: 'blob'
                    });

                    // Create object URL from blob
                    const blobUrl = URL.createObjectURL(response.data);
                    this.imageObjectUrl = blobUrl;

                    // Clean up when component is destroyed
                    onUnmounted(() => {
                        URL.revokeObjectURL(blobUrl);
                    });
                } catch (error) {
                    console.error("Image load failed:", error);
                }
            }
        },
        calculateAge(birthDate: string) {
            const today = new Date();
            const birth = new Date(birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        },
        setClothesOrShoesValue(value: any) {
            if (value !== null && value !== undefined && value !== '') {
                return value;
            } else {
                return 'Não informado';
            }
        },
        clearSelectedChild() {
            this.selectedChild = {} as child;
            this.imageObjectUrl = null;
            this.defaultImage = new URL('@/assets/profile.jpg', import.meta.url).href;
        },
    }
}
</script>