<template>
    <div class="container mt-3 mb-3">
        <div class="card" v-show="enableEditFamily">
            <div class="card-header">
                <h3 aria-label="Alteração de família existente">Alterar Família</h3>
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
                    <label aria-label="Nome do Responsável">Nome do Responsável</label>
                    <input type="text" v-model="model.family.responsibleName" class="form-control"
                        aria-describedby="Campo de texto para o nome do doador">
                    <label aria-label="Telefone do doador">Telefone</label>
                    <input type="text" v-model="model.family.phoneNumber" class="form-control"
                        aria-describedby="Campo de texto para o telefone do responsável">
                    <label aria-label="Endereço da família">Endereço</label>
                    <input type="text" v-model="model.family.address" class="form-control"
                        aria-describedby="Campo de texto para o endereço da família">
                    <label aria-label="Bairro da família">Bairro</label>
                    <select v-model="model.family.neighborhoodId" class="form-select form-control"
                        aria-describedby="Campo de seleção para bairro da família">
                        <option disabled value="">Selecione...</option>
                        <option v-for="neighborhood in neighborhoods" :key="neighborhood.neighborhoodId"
                            :value="neighborhood.neighborhoodId">
                            {{ neighborhood.neighborhoodName }} </option>
                    </select>
                            <!-- Dropdown para Selecionar Líder -->
        
          <label for="leader">Líder</label>
          <select v-model="model.family.leaderId" class="form-select form-control" aria-describedby="Campo de seleção do líder responsável
          pela família">
            <option disabled value="">Selecione um líder...</option>
            <option v-for="leader in leaders" :key="leader.leaderId" :value="leader.leaderId">
              {{ leader.leaderName }}
            </option>
          </select>
         
                    <label aria-label="Observações">Observações</label>
                    <input type="text" v-model="model.family.observation" class="form-control"
                        aria-describedby="Campo de texto para observações">
                </div>
                <div class="col d-flex justify-content-end m-3">
                    <button type="button" @click="checkForm" class="btn btn-success"
                        aria-describedby="Botão para alterar os novos dados da família">Alterar Família</button>
                </div>
                <div v-show="model.children.length > 0">
                    <div class="card-header mt-4 mb-0 me-3 ms-3">
                        <h5 aria-label="Listagem de crianças cadastradas">Crianças</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped mb-3">
                                <thead>
                                    <tr>
                                        <th><b>Nome da Criança</b></th>
                                        <th><b>Roupa</b></th>
                                        <th><b>Calçado</b></th>
                                        <th><b>Ações</b></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="child in model.children" :key="child.childId">
                                        <td>{{ child.childName }}</td>
                                        <td>{{ child.clothes }}</td>
                                        <td>{{ child.shoes }}</td>
                                        <td>
                                            <button class="btn btn-success m-1"
                                                @click="getChild(child), enableEditChild = true, enableAddChild = false, enableEditFamily = false"
                                                aria-describedby="Botão para alterar a criança">Alterar</button>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <hr>
                    <div class="d-grid col-6 mx-auto">
                        <button type="button" @click="enableAddChild = true, enableEditFamily = false"
                            class="btn btn-dark" aria-describedby="Botão para adicionar criança">Adicionar
                            Criança</button>
                    </div>
                    <div class="d-grid col-6 mx-auto">
                        <button type="reset" @click="cancelForm" class="col btn btn-danger"
                            aria-describedby="Botão para cancelar o formulário">Finalizar Alterações</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card" v-show="enableEditChild || enableAddChild">
            <div class="card-header" v-if="enableAddChild">
                <h3 aria-label="Inclusão de Criança">Adicionar Criança</h3>
            </div>
            <div class="card-header" v-if="enableEditChild">
                <h3 aria-label="Alteração de Criança">Alterar Criança</h3>
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
                            <input type="file" accept="image/*" ref="fileInput" class="form-control"
                                id="inputGroupFile">
                            <label class="input-group-text" @click="uploadPicture">Upload</label>
                        </div>
                    </div>
                </div>
                <div class="float-end">
                    <button type="button" @click="checkChildForm()" class="btn btn-success m-2"
                        aria-describedby="Botão para salvar a criança">Salvar
                        Criança</button>
                    <button type="reset"
                        @click="enableAddChild = false, enableEditChild = false, enableEditFamily = true"
                        class="btn btn-secondary" aria-describedby="Botão para cancelar o cadastro">Cancelar</button>
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
import type { Leader } from '@/models/leader';

export default {

    name: 'familyEditView',
    data() {
        return {
            errorList: [] as string[],
            neighborhoods: [] as Neighborhood[],
            imageObjectUrl: null as string | null,
            leaders: [] as Leader[], 
            defaultImage: new URL('@/assets/profile.jpg', import.meta.url).href,
            model: {
                family: {
                    familyId: '',
                    responsibleName: '',
                    phoneNumber: '',
                    address: '',
                    neighborhoodId: '',
                    observation: '',
                    leaderId: '',
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
                children: [] as child[]
            },
            enableEditChild: false,
            enableEditFamily: true,
            enableAddChild: false,
        }

    },
    mounted() {
        this.getNeighborhoods();
        this.getFamily();
        this.getLeaders()
    },
    methods: {
        editfamily() {
            var $this = this;
            var url = '/api/family/' + this.$route.params.id
            axios.put(url, {
                familyId: this.$route.params.id,
                responsibleName: this.model.family.responsibleName,
                phoneNumber: this.model.family.phoneNumber,
                address: this.model.family.address,
                neighborhoodId: this.model.family.neighborhoodId,
                observation: this.model.family.observation,
                leaderId: this.model.family.leaderId
            })
                .then(result => {
                    alert('Família alterada com sucesso!');
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        $this.errorList.push("Ocorreu um erro ao salvar a família, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        getChild(child: child) {
            this.model.child.childId = child.childId;
            this.model.child.childName = child.childName;
            this.model.child.birthDate = child.birthDate;
            this.model.child.clothes = child.clothes || '';
            this.model.child.shoes = child.shoes || '';
            this.model.child.gender = child.gender;
            this.model.child.pictureUrl = child.pictureUrl;
            this.model.child.familyId = Number(this.$route.params.id);

            console.log(this.model.child.familyId);

            this.imageObjectUrl = this.defaultImage;
            if (child.pictureUrl) {
                this.loadImageFromApi();
            } else {
                this.imageObjectUrl = this.defaultImage;
            }
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
                familyId: this.$route.params.id
            }).catch(function (error) {
                if (error.response.status == 400) {
                    $this.errorList.push("Ocorreu um erro ao salvar a criança, verifique o preenchimento de todos os campos e tente novamente.")
                } else if (error.response.status == 500) {
                    $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                } else {
                    $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                }
            }).finally(() => {
                this.getFamily();
                this.clearChildForm();
                this.enableAddChild = false;
                this.enableEditFamily = true;
            })
        },
        editChild() {
            var $this = this;
            var url = '/api/child/' + this.model.child.childId
            axios.put(url, {
                childId: this.model.child.childId,
                childName: this.model.child.childName,
                gender: this.model.child.gender,
                birthDate: this.model.child.birthDate,
                clothes: this.model.child.clothes,
                shoes: this.model.child.shoes,
                pictureUrl: this.model.child.pictureUrl,
                familyId: this.model.child.familyId
            })
                .then(result => {
                    this.enableEditChild = false;
                    this.enableAddChild = false;
                    this.enableEditFamily = true;
                    this.getFamily();
                    this.clearChildForm();
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        $this.errorList.push("Ocorreu um erro ao salvar a criança, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        getFamily() {
            var $this = this;
            var url = '/api/family/' + this.$route.params.id
            axios.get(url)
                .then(result => {
                    this.model.family.responsibleName = result.data.responsibleName
                    this.model.family.phoneNumber = result.data.phoneNumber
                    this.model.family.address = result.data.address
                    this.model.family.neighborhoodId = result.data.neighborhoodId
                    this.model.family.observation = result.data.observation
                    this.model.children = result.data.children,
                    this.model.family.leaderId = result.data.leaderId
                })
                .catch(function (error) {
                    if (error.response.status == 404) {
                        $this.errorList.push("Ocorreu um erro ao buscar a família, verifique o preenchimento de todos os campos e tente novamente.")
                    } else if (error.response.status == 500) {
                        $this.errorList.push("Ocorreu um erro interno no servidor, tente novamente mais tarde.")
                    } else {
                        $this.errorList.push("Ocorreu um erro desconhecido, tente novamente mais tarde.")
                    }
                })
        },
        getNeighborhoods() {
            var $this = this;
            var url = '/api/neighborhood'
            axios.get(url)
                .then(result => {
                    this.neighborhoods = result.data;
                })
                .catch(function (error) {
                    if (error.response && error.response.status == 500) {
                        $this.errorList.push("Erro ao carregar os bairros. Tente novamente mais tarde.");
                    } else {
                        $this.errorList.push("Erro desconhecido ao carregar os bairros.");
                    }
                });
        },
        cancelForm() {
            this.$router.push('/family')
        },
        checkForm: function (e: any) {
            this.errorList = [];

            if (this.model.family.responsibleName == '') {
                this.errorList.push('O nome do responsável é obrigatório.');
            }
            if (this.model.family.phoneNumber == '') {
                this.errorList.push('O telefone do responsável é obrigatório.');
            }
            if (this.model.family.address == '') {
                this.errorList.push('O endereço é obrigatório.');
            }
            if (this.model.family.neighborhoodId == '') {
                this.errorList.push('O bairro é obrigatório.');
            }
            if (this.model.family.leaderId == '') {
                this.errorList.push('O líder é obrigatório.');
            }
            if (!this.errorList.length) {
                this.editfamily();
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
                if (this.model.child.childId > 0) {
                    this.editChild();
                } else {
                    this.saveChild();
                }
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
        getLeaders() {
        var $this = this;
        axios
            .get("/api/leadership") // Endpoint para buscar os líderes
            .then((response) => {
            this.leaders = response.data;
            })
            .catch(function (error) {
                    if (error.response && error.response.status == 500) {
                        $this.errorList.push("Erro ao carregar os líderes. Tente novamente mais tarde.");
                    } else {
                        $this.errorList.push("Erro desconhecido ao carregar os líderes.");
                    }
            });
        }
    }
}
</script>