<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Crianças
                    <RouterLink to="/child/create" class="btn btn-primary float-end" aria-describedby="Botão para incluir nova criança">Adicionar Criança</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th><b>Nome da Criança</b></th>
                            <th><b>Data de Nascimento</b></th>
                            <th><b>Ações</b></th>
                        </tr>
                    </thead>
                    <tbody v-if="child.length > 0">
                        <tr v-for="child in child" :key="child.childId">
                            <td>{{ child.childName }}</td>
                            <td>{{ child.birthDate }}</td>
                            <td><RouterLink :to="{path: '/child/'+child.childId +'/edit'}" class="btn btn-primary" aria-describedby="Botão para alterar os dados da criança">Alterar</RouterLink></td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="4">Carregando Crianças...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import { type child } from "../models/child";

export default {

    name: 'child-view',
    data() {
        return {
            child: [] as child[]
        }
    },
    mounted() {
        this.getChild();
    },
    methods: {
        getChild() {
            var url = 'api/child';
            return axios.get(url).then(result => this.child = result.data);
        }
    },
}
</script>