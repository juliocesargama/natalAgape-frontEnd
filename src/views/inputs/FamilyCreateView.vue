<template>
    <div class="container mt-5">
        <div class="card mb-3" v-show="enableFamily">
            <div class="card-header">
                <h3 aria-label="Cadastro de nova família">Nova Família</h3>
            </div>
            <div class="card-body mb-0">
                <ul class="alert alert-danger" v-if="errorList.length > 0">
                    <div class="mb-0 ms-3">
                        <ul>
                            <li v-for="error in errorList">{{ error }}</li>
                        </ul>
                    </div>
                </ul>
                <div class="container" v-show="enableFamily">
                    <label aria-label="Nome do Responsável">Nome do Responsável</label>
                    <input type="text" v-model="model.family.responsibleName" class="form-control"
                        aria-describedby="Campo de texto para o nome do responsável">
                    <label aria-label="Telefone do responsável">Telefone</label>
                    <input type="text" v-model="model.family.phoneNumber" class="form-control"
                        aria-describedby="Campo de texto para o telefone do responsável">
                    <label aria-label="Endereço da família">Endereço</label>
                    <input type="text" v-model="model.family.address" class="form-control"
                        aria-describedby="Campo de texto para o endereço da família">
                    <label aria-label="Bairro da família">Bairro</label>
                    <select v-model="model.family.neighborhoodId" class="form-select form-control"
                        aria-describedby="Campo de texto para bairro da família">
                        <option disabled value="">Selecione...</option>
                        <option v-for="neighborhood in neighborhoods" :key="neighborhood.neighborhoodId"
                            :value="neighborhood.neighborhoodId">
                            {{ neighborhood.neighborhoodName }} </option>
                    </select>
                    <label aria-label="Observações">Observações</label>
                    <input type="text" v-model="model.family.observation" class="form-control"
                        aria-describedby="Campo de texto para observações">
                    <div class="container mt-3">
                        <div class="row">
                            <div class="d-grid col-6 mx-auto">
                                <button type="button" @click="checkFamilyForm()" class="btn btn-success ms-2 me-2"
                                    aria-describedby="Botão para salvar a família">Salvar Família</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card ms-3 me-3 mb-3" v-show="enableChild">
            <div class="card-header">
                <h4 aria-label="Cadastro de nova criança">Nova Criança</h4>
            </div>
            <div class="card-body">
                <ul class="alert alert-danger" v-if="errorList.length > 0">
                    <div class="mb-0 ms-3">
                        <ul>
                            <li v-for="error in errorList">{{ error }}</li>
                        </ul>
                    </div>
                </ul>
                <div class="row g-12">
                    <div class="col-4">
                        <img name="profile-picture" :src="imageObjectUrl || defaultImage" alt="Imagem de Criança"
                            class="float-start img-fluid img-thumbnail" aria-describedby="Imagem da criança">
                    </div>
                    <div class="col">
                        <label aria-label="Nome da Criança">Nome da Criança</label>
                        <input type="text" v-model="model.child.childName" class="form-control"
                            aria-describedby="Campo de texto para o nome da criança">
                        <label aria-label="Sexo da Criança">Sexo</label>
                        <select v-model="model.child.gender" class="form-select form-control">
                            <option disabled value="">Selecione...</option>
                            <option value="MALE">Masculino</option>
                            <option value="FEMALE">Feminino</option>
                        </select>
                        <label aria-label="Data de Nascimento da Criança">Data de Nascimento</label>
                        <input type="date" v-model="model.child.birthDate" class="form-control"
                            aria-describedby="Campo de texto para a data de nascimento da criança">
                        <label aria-label="Tamanho da Roupa">Tamanho da Roupa</label>
                        <input type="text" v-model="model.child.clothes" class="form-control"
                            aria-describedby="Campo de texto para o tamanho da roupa">
                        <label aria-label="Tamanho do Calçado">Tamanho do Calçado</label>
                        <input type="text" v-model="model.child.shoes" class="form-control"
                            aria-describedby="Campo de texto para o tamanho do calçado">
                        <label aria-label="Foto da criança">Foto da Criança</label>
                        <div class="input-group mb-3">
                            <input type="file" accept="image/*" ref="fileInput" class="form-control" id="inputGroupFile">
                            <label class="input-group-text" @click="uploadPicture">Upload</label>
                        </div>
                    </div>
                </div>
                <div class="float-end">
                    <button type="button" @click="checkChildForm()" class="btn btn-success m-2"
                        aria-describedby="Botão para salvar a criança">Salvar
                        Criança</button>
                    <button type="reset" @click="enableChild = false, enableAddChild = true" class="btn btn-secondary"
                        aria-describedby="Botão para cancelar o cadastro">Cancelar</button>
                </div>
            </div>
        </div>
        <div class="card ms-3 me-3 mb-3" v-show="enableAddChild">
            <div class="card-header">
                <h4 aria-label="Família">Família Atual</h4>
            </div>
            <div class="card-body">
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th><b>Responsável</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ model.family.responsibleName }}</td>
                            </tr>
                        </tbody>
                        <thead v-show="model.children.length > 0">
                            <tr>
                                <th><b>Crianças cadastradas</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="child in model.children" :key="child.childId">
                                <td>{{ child.childName }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="row m-3">
                    <div class="d-grid gap-2 col-6 mx-auto">
                        <button type="button" @click="enableChild = true, enableAddChild = false, enableFamily = false"
                            :disabled="!enableAddChild" class="btn btn-dark"
                            aria-describedby="Botão para adicionar criança">Adicionar Criança</button>
                    </div>
                    <div class="d-grid gap-2 col-6 mx-auto">
                        <button type="button" @click="abortFormSubmission" class="btn btn-danger"
                            aria-describedby="Botão para finalizar cadastro">Finalizar Cadastro</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import type { child } from '@/models/child';
import type { Neighborhood } from '@/models/neighborhood';
import axios from 'axios';
import { onUnmounted } from 'vue';

export default {

    name: 'familyCreateView',
    data() {
        return {
            errorList: [] as string[],
            neighborhoods: [] as Neighborhood[],
            imageObjectUrl: null as string | null,
            defaultImage: new URL('@/assets/profile.jpg', import.meta.url).href,
            model: {
                family: {
                    familyId: '',
                    responsibleName: '',
                    phoneNumber: '',
                    address: "",
                    neighborhoodId: 0,
                    observation: '',
                },
                child: {
                    childId: 0,
                    childName: '',
                    gender: '',
                    birthDate: '',
                    clothes: '',
                    shoes: '',
                    pictureUrl: '' as string | undefined,
                    familyId: 0,
                },
                children: [] as child[],
            },
            enableFamily: true,
            enableChild: false,
            enableAddChild: false
        }

    },
    mounted() {
        this.getNeighborhoods();
    },
    methods: {
        saveFamily() {
            var $this = this;
            var url = '/api/family'
            axios.post(url, {
                responsibleName: this.model.family.responsibleName,
                phoneNumber: this.model.family.phoneNumber,
                address: this.model.family.address,
                neighborhoodId: this.model.family.neighborhoodId,
                observation: this.model.family.observation
            })
                .then(result => {
                    this.model.family.familyId = result.data.familyId
                    this.model.family.responsibleName = result.data.responsibleName
                    this.model.family.phoneNumber = result.data.phoneNumber
                    this.model.family.address = result.data.address
                    this.model.family.neighborhoodId = result.data.neighborhoodId
                    this.model.family.observation = result.data.observation
                })
                .catch(function (error) {
                    if (error.response.status == 400) {
                        $this.errorList.push("Ocorreu um erro ao salvar a família, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        saveChild() {
            var $this = this;
            var url = '/api/child'
            axios.post(url, {
                childName: this.model.child.childName,
                gender: this.model.child.gender,
                birthDate: this.model.child.birthDate,
                clothes: this.model.child.clothes,
                shoes: this.model.child.shoes,
                pictureUrl: this.model.child.pictureUrl,
                familyId: this.model.family.familyId
            }).catch(function (error) {
                if (error.response.status == 400) {
                    $this.errorList.push("Ocorreu um erro ao salvar a criança, verifique o preenchimento de todos os campos e tente novamente.")
                } else if (error.response.status == 500) {
                    $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                } else {
                    $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                }
            }).finally(() => {
                this.getFamily(this.model.family.familyId);
                this.clearChildForm();
            })
        },
        getNeighborhoods() {
            var $this = this;
            var url = '/api/neighborhood'
            axios.get(url)
                .then(result => {
                    this.neighborhoods = result.data
                })
        },
        getFamily(id: string) {
            this.model.children = []
            var $this = this;
            var url = '/api/family/' + id
            axios.get(url)
                .then(result => {
                    this.model.family.responsibleName = result.data.responsibleName
                    this.model.family.phoneNumber = result.data.phoneNumber
                    this.model.family.address = result.data.address
                    this.model.family.neighborhoodId = result.data.neighborhoodId
                    this.model.family.observation = result.data.observation
                    this.model.children = result.data.children
                })
        },
        abortFormSubmission() {
            this.$router.push('/family')
        },
        checkFamilyForm: function () {
            this.errorList = [];

            if (this.model.family.responsibleName == '') {
                this.errorList.push('O nome do responsável é obrigatório.');
            }
            if (this.model.family.phoneNumber == '') {
                this.errorList.push('O telefone é obrigatório.');
            }
            if (this.model.family.address == '') {
                this.errorList.push('O endereço é obrigatório.');
            }
            if (this.model.family.neighborhoodId == 0) {
                this.errorList.push('O bairro é obrigatório.');
            }

            if (!this.errorList.length) {
                this.saveFamily();
                this.enableAddChild = true;
                this.enableFamily = false;
            };
        },
        checkChildForm: function () {
            this.errorList = [];

            if (this.model.child.childName == '') {
                this.errorList.push('O nome da criança é obrigatório.');
            }
            if (this.model.child.gender == '') {
                this.errorList.push('O sexo é obrigatório.');
            }
            if (this.model.child.birthDate == '') {
                this.errorList.push('A data de nascimento é obrigatória.');
            }

            if (!this.errorList.length) {
                this.saveChild();
                this.enableAddChild = true;
                this.enableChild = false;
            }
        },
        clearChildForm: function () {
            this.model.child.childId = 0;
            this.model.child.childName = '';
            this.model.child.birthDate = '';
            this.model.child.gender = '';
            this.model.child.clothes = '';
            this.model.child.shoes = '';
            this.model.child.pictureUrl = undefined;
            this.model.child.familyId = 0;

            (this.$refs.fileInput as HTMLInputElement).value = '';
            this.imageObjectUrl = this.defaultImage;

        },
        uploadPicture: function () {
            const input = document.getElementById('inputGroupFile') as HTMLInputElement;

            if (input.files && input.files[0]) {
                const file = input.files[0];
                const formData = new FormData();
                formData.append('file', file);

                axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        this.model.child.pictureUrl = response.data;
                        this.loadImageFromApi();
                    })
                    .catch(error => {
                        console.error('Erro ao fazer upload da imagem:', error);
                    });
            } else {
                console.error('Nenhum arquivo selecionado.');
            }
        },
        async loadImageFromApi() {
            try {
                const response = await axios.get('/api/upload/open/' + this.model.child.pictureUrl, {
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
        },
    }
}
</script>