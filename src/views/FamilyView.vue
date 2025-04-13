<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Famílias
                    <RouterLink to="/family/create" class="btn btn-primary float-end" aria-describedby="Botão para incluir nova família">Nova Família</RouterLink>
                </h3>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th><b>Nome do Responsável</b></th>
                            <th><b>Bairro</b></th>
                            <th><b>Filiação</b></th>
                            <th><b>Ações</b></th>
                        </tr>
                    </thead>
                    <tbody v-if="families.length > 0">
                        <tr v-for="family in families" :key="family.familyId">
                            <td>{{ family.responsibleName }}</td>
                            <td>{{ family.neighborhoodName }}</td>
                            <td>{{ getChildrenNames(family.children) }}</td>  
                            <td><RouterLink :to="{path: '/family/'+family.familyId +'/edit'}" class="btn btn-primary" aria-describedby="Botão para alterar a família">Alterar</RouterLink></td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3">Carregando Famílias...</td>
                        </tr>
                    </tbody>
                </table>
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
            families: [] as family[]
        }
    },
    mounted() {
        this.getFamilies();
    },
    methods: {
        getChildrenNames(children: { childName: string }[]) {
            return children.map(child => child.childName).join(', \n');
        },
        getFamilies() {
            var url = 'api/family';
            return axios.get(url).then(result => this.families = result.data);
        }
    },
}
</script>

