<template>
  <div>
    <h1>Editar Child</h1>
    <form @submit.prevent="updateChild">
      <input v-model="child.childName" placeholder="Nome" required />
      <input v-model="child.gender" placeholder="Gênero" required />
      <input v-model="child.birthDate" type="date" required />
      <input v-model="child.clothes" placeholder="Roupas" />
      <input v-model="child.shoes" placeholder="Sapatos" />
      <input v-model="child.pictureUrl" placeholder="URL da Imagem" />
      <button type="submit">Atualizar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Child } from '@/models/Child';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      child: {} as Child,
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    const response = await axios.get(`/api/child/${id}`);
    this.child = response.data;
  },
  methods: {
    async updateChild() {
      try {
        await axios.put(`/api/child/${this.child.childId}`, this.child);
        this.$router.push('/child');
      } catch (error) {
        console.error('Erro ao atualizar child:', error);
      }
    },
  },
});
</script>