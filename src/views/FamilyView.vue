<template>
    <div class="container mt-5 mb-3">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Famílias
                    <RouterLink to="/family/create" class="btn btn-dark float-end"
                        aria-describedby="Botão para incluir nova família">Nova Família</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th><b>Nome do Responsável</b></th>
                            <th><b>Bairro</b></th>
                            <th><b>Crianças</b></th>
                            <th><b>Ações</b></th>
                        </tr>
                    </thead>
                    <tbody v-if="families.length > 0">
                        <tr v-for="family in families" :key="family.familyId">
                            <td>{{ family.responsibleName }}</td>
                            <td>{{ family.neighborhoodName }}</td>
                            <td>{{ family.children.length }}</td>
                            <td>
                                <RouterLink :to="{ path: '/family/' + family.familyId + '/edit' }"
                                    class="btn btn-success me-2" aria-describedby="Botão para alterar a família">Alterar
                                </RouterLink>
                                <button class="btn btn-danger" aria-describedby="Botão para excluir família"
                                    data-bs-toggle="modal" data-bs-target="#modalExcluir"
                                    @click="familyToDelete = family.familyId">Excluir</button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3">{{ statusMessage }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalExcluir" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalExcluiFamilia" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalExcluiFamilia">Excluir Família</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cancelar Exclusão"></button>
                </div>
                <div class="modal-body">
                    Tem certeza que deseja excluir a família e todas as suas crianças?
                    <br>
                    <strong>Essa ação não poderá ser desfeita.</strong>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" @click="deleteFamily(familyToDelete)"
                        data-bs-dismiss="modal">Confirmar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import axios from "axios";
import { type family } from "../models/family";

export default {

    name: 'family-view',
    data() {
        return {
            families: [] as family[],
            statusMessage: 'Carregando Famílias...',
            familyToDelete: 0 as number,
        }
    },
    mounted() {
        this.getFamilies();
    },
    methods: {
        getFamilies() {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = 'api/family';

            return axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then(result => {
                if (result.data.length > 0) {
                    this.families = result.data;
                    this.statusMessage = '';
                } else {
                    this.statusMessage = 'Nenhuma família encontrada.';
                }
            })
            .catch(() => {
                this.statusMessage = 'Erro ao carregar famílias, tente novamente mais tarde.';
            });
        },
        deleteFamily(familyId: number) {
            const token = localStorage.getItem("jwtToken"); // Obtém o token JWT do localStorage
            const url = 'api/family/' + familyId;

            return axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
                }
            })
            .then(() => {
                this.getFamilies();
                this.$router.push({ path: '/family' });
            })
            .catch(() => {
                this.statusMessage = 'Erro ao excluir a família, tente novamente mais tarde.';
            });
        }
    },
}
</script>
