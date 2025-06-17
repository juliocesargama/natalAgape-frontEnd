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

                    <label for="campaignId" class="form-label">Campanha*</label>
                    <select v-model="model.campaignId" class="form-control selectpicker show-tick" id="campaignId"
                        title="Selecione uma campanha...">
                        <option v-for="campaign in campaigns" :value="campaign.campaignId"> {{ campaign.campaignYear
                        }}
                            |
                            {{ campaign.campaignChurch }}</option>
                    </select>
                    <label for="sponsorId" class="form-label">Doador*</label>
                    <select v-model="model.sponsorId" data-live-search="true" class="form-control selectpicker show-tick"
                        id="sponsorId" title="Selecione um doador...">
                        <option v-for="sponsor in sponsors" :value="sponsor.sponsorId">{{ sponsor.sponsorName }}
                        </option>
                    </select>
                    <label for="leaderId" class="form-label">Líder*</label>
                    <select v-model="model.leaderId" data-live-search="true" class="form-control selectpicker show-tick"
                        id="leaderId" title="Selecione um líder...">
                        <option v-for="leader in leaders" :value="leader.leaderId">{{ leader.leaderName }}
                        </option>
                    </select>
                    <label for="childId" class="form-label">Criança*</label>
                    <div class="row g-3">
                        <div class="col">
                            <select v-model="model.childId" data-live-search="true" class="form-control selectpicker show-tick"
                                id="childId" title="Selecione uma criança...">
                                <option v-for="child in children" :value="child.childId" :key="child.childId"
                                    @click="selectedChild = child" @change="selectedChild = child">{{ child.childName }}
                                </option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalVerCriança"
                                :disabled="!selectedChild.childId" @click="loadImageFromApi">Ver
                                Criança</button>
                        </div>
                    </div>
                    <label for="wasDelivered" class="form-label">A doação "roupa e calçado" já foi realizada?*</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="wasDeliveredYes" id="wasDeliveredYes" :value="true"
                            v-model="model.wasDelivered">
                        <label class="form-check-label" for="wasDeliveredYes">
                            Sim
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="wasDeliveredNo" id="wasDeliveredNo" :value="false"
                            v-model="model.wasDelivered" @change="clearAcceptanceDate">
                        <label class="form-check-label" for="wasDeliveredNo">
                            Não
                        </label>
                    </div>

                    <!-- Novo campo: isToyDelivered -->
                    <label for="isToyDelivered" class="form-label mt-3">A doação de brinquedo já foi realizada?*</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="isToyDeliveredYes" id="isToyDeliveredYes" :value="true"
                            v-model="model.isToyDelivered">
                        <label class="form-check-label" for="isToyDeliveredYes">
                            Sim
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="isToyDeliveredNo" id="isToyDeliveredNo" :value="false"
                            v-model="model.isToyDelivered" @change="clearAcceptanceDate">
                        <label class="form-check-label" for="isToyDeliveredNo">
                            Não
                        </label>
                    </div>

                    <!-- Data da doação (única para ambos os campos) -->
                    <div class="container" v-show="model.wasDelivered || model.isToyDelivered">
                        <label for="acceptanceDate" class="form-label">Data da doação</label>
                        <input type="date" v-model="model.acceptance" class="form-control" id="acceptanceDate">
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
	name: 'ChildContributionCreateView',
	data() {
		return {
			campaigns: [] as campaign[],
			sponsors: [] as sponsor[],
			leaders: [] as Leader[],
			children: [] as child[],
			errorList: [] as string[],
			model: {
				campaignId: null,
				sponsorId: null,
				childId: null,
				leaderId: null,
				wasDelivered: false,
				acceptance: null,
				observation: '',
				isToyDelivered: false
			},
			selectedChild: {} as child,
			imageObjectUrl: null as string | null,
			defaultImage: new URL('@/assets/profile.jpg', import.meta.url).href
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
			if ((this.model.wasDelivered && this.model.isToyDelivered) && !this.model.acceptance) {
				this.errorList.push('Preencha a data da doação.');
			}
			if (this.errorList.length === 0) {
				this.saveContribution();
			}
		},
        getCampaigns() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = "/api/campaign";

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then((response) => {
                this.campaigns = response.data;
            })
            .catch((error) => {
                console.error(error);
                this.errorList.push("Erro ao carregar campanhas.");
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
                console.error(error);
                this.errorList.push("Erro ao carregar doadores.");
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
                console.error(error);
                this.errorList.push("Erro ao carregar líderes.");
            });
        },
        getChildren() {
            const token = localStorage.getItem("jwtToken");
            const url = "/api/child";

            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                this.children = response.data;
            })
            .catch((error) => {
                console.error(error);
                this.errorList.push("Erro ao carregar crianças.");
            });
        },
        saveContribution() {
            const token = localStorage.getItem("jwtToken");
            const url = "/api/child-contribution";

            axios.post(url, {
                campaignId: this.model.campaignId,
                sponsorId: this.model.sponsorId,
                leaderId: this.model.leaderId,
                childId: this.model.childId,
                wasDelivered: this.model.wasDelivered,
                acceptance: this.model.acceptance,
                observation: this.model.observation,
				isToyDelivered: this.model.isToyDelivered
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                this.$router.push('/child-contribution');
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    this.errorList.push("A criança já possui doação cadastrada nesta campanha.");
                } else {
                    this.errorList.push("Erro ao salvar doação, verifique os dados e tente novamente.");
                }
            });
        },
		clearAcceptanceDate() {
			this.model.acceptance = null;
		},
		async loadImageFromApi() {
			if (this.selectedChild.pictureUrl) {
				try {
                    const token = localStorage.getItem("jwtToken");
                    const response = await axios.get('/api/upload/open/' + this.selectedChild.pictureUrl, {
                        responseType: 'blob',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
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
	},
};
</script>