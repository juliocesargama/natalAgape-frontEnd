<template>
  <div>
    <h1>Gerenciamento de Child</h1>
    <router-link to="/child/create">
      <button>Adicionar Child</button>
    </router-link>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Gênero</th>
          <th>Data de Nascimento</th>
          <th>Roupas</th>
          <th>Sapatos</th>
          <th>Imagem</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="child in child" :key="child.childId">
          <td>{{ child.childId }}</td>
          <td>{{ child.childName }}</td>
          <td>{{ child.gender }}</td>
          <td>{{ child.birthDate }}</td>
          <td>{{ child.clothes }}</td>
          <td>{{ child.shoes }}</td>
          <td>
            <img :src="child.pictureUrl" alt="Imagem" v-if="child.pictureUrl" width="50" />
          </td>
          <td>
            <router-link :to="`/child/edit/${child.childId}`">
              <button>Editar</button>
            </router-link>
            <button @click="deleteChild(child.childId)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { child } from '@/models/child';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      child: [] as Child[],
    };
  },
  methods: {
    async fetchChild() {
      try {
        const response = await axios.get('/api/child');
        this.child = response.data;
      } catch (error) {
        console.error('Erro ao buscar child:', error);
      }
    },
    async deleteChild(id: number) {
      try {
        await axios.delete(`/api/child/${id}`);
        this.fetchChild();
      } catch (error) {
        console.error('Erro ao excluir child:', error);
      }
    },
  },
  mounted() {
    this.fetchChild();
  },
});
</script>