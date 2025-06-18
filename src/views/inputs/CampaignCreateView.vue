<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 aria-label="Cadastro de nova campanha">Nova Campanha</h3>
            </div>
            <div class="card-body">

                <ul class="alert alert-danger" v-if="errorList.length > 0">
                    <div class="mb-0 ms-3">
                        <ul>
                            <li v-for="error in errorList">{{ error }}</li>
                        </ul>
                    </div>
                </ul>
                <div class="mb-3">
                    <label aria-label="Ano da Campanha">Ano*</label>
                    <input type="number" min="2025" max="2075" v-model="model.campaign.campaignYear"
                        class="form-control" aria-describedby="Campo de texto para o ano da campanha">
                    <label aria-label="Nome da igreja ou campanha">Nome da Igreja/Campanha*</label>
                    <input type="text" v-model="model.campaign.campaignChurch" class="form-control"
                        aria-describedby="Campo de texto para o nome da igreja">
                    <!-- Novo campo para valor da cesta básica -->
                    <label aria-label="Valor definido para cesta básica">Valor definido para cesta básica*</label>
                    <div class="input-group">
                        <span class="input-group-text">R$</span>
                        <input
                            type="text"
                            v-model="formattedFoodBasketValue"
                            @input="onFoodBasketValueInput"
                            class="form-control text-end"
                            aria-describedby="Campo de texto para o valor da cesta básica"
                            placeholder="0,00"
                        >
                    </div>
                </div>
                <div class="float-end">
                    <button type="button" @click="checkForm" class="btn btn-success m-2"
                        aria-describedby="Botão para salvar a campanha">Salvar</button>
                    <button type="reset" @click="cancelForm" class="btn btn-secondary"
                        aria-describedby="Botão para cancelar o cadastro">Cancelar</button>
                </div>
            </div>
            <div class="card-footer">
                <p class="text-muted">* Campos obrigatórios</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';

function formatCurrencyBRL(value: string | number): string {
    let num = typeof value === 'number' ? value : Number(value.replace(/\D/g, '')) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default {
    name: 'campaignCreateView',
    data() {
        return {
            errorList: [] as string[],
            model: {
                campaign: {
                    campaignId: '',
                    campaignYear: new Date().getFullYear(),
                    campaignChurch: '',
                    foodBasketValue: 0
                }
            },
            formattedFoodBasketValue: ''
        }
    },
    watch: {
        // Atualiza o campo formatado ao carregar valor inicial
        'model.campaign.foodBasketValue': {
            immediate: true,
            handler(newVal) {
                this.formattedFoodBasketValue = formatCurrencyBRL(newVal);
            }
        }
    },
    methods: {
        onFoodBasketValueInput(e: Event) {
            let value = (e.target as HTMLInputElement).value;
            // Remove tudo que não for número
            value = value.replace(/\D/g, '');
            // Converte para centavos e formata
            let num = Number(value) / 100;
            this.model.campaign.foodBasketValue = num;
            this.formattedFoodBasketValue = formatCurrencyBRL(num);
        },
        saveCampaign() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = '/api/campaign';

            axios.post(url, {
                campaignYear: this.model.campaign.campaignYear,
                campaignChurch: this.model.campaign.campaignChurch,
                valueDonation: this.model.campaign.foodBasketValue
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then(() => {
                this.$router.push('/campaign');
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    this.errorList.push("Ocorreu um erro ao salvar a campanha, verifique o preenchimento de todos os campos e tente novamente.");
                } else if (error.response && error.response.status === 500) {
                    this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.");
                } else {
                    this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.");
                }
            });
        },
        cancelForm() {
            this.$router.push('/campaign')
        },
        checkForm: function (e: any) {
            this.errorList = [];

            if (this.model.campaign.campaignYear < 2025 || this.model.campaign.campaignYear > 2075) {
                this.errorList.push('O ano da campanha é inválido.');
            }
            if (this.model.campaign.campaignChurch == '') {
                this.errorList.push('A igreja responsável pela campanha é obrigatória.');
            }
            if (!this.model.campaign.foodBasketValue || this.model.campaign.foodBasketValue <= 0) {
                this.errorList.push('O valor da cesta básica é obrigatório e deve ser maior que zero.');
            }
            if (!this.errorList.length) {
                this.saveCampaign();
            };
        }
    }
}
</script>