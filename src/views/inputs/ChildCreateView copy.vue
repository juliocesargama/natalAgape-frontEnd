<template>
  <div>
    <h1>Criar Child</h1>
    <form @submit.prevent="saveChild">
      <input v-model="child.childName" placeholder="Nome" required />
      <input v-model="child.gender" placeholder="Gênero" required />
      <input v-model="child.birthDate" type="date" required />
      <input v-model="child.clothes" placeholder="Roupas" />
      <input v-model="child.shoes" placeholder="Sapatos" />
      <input v-model="child.pictureUrl" placeholder="URL da Imagem" />
      <button type="submit">Salvar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { child } from '@/models/Child';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      child: {} as Omit<Child, 'childId'>,
    };
  },
  methods: {
    async saveChild() {
      try {
        await axios.post('/api/child', this.child);
        this.$router.push('/child');
      } catch (error) {
        console.error('Erro ao salvar child:', error);
      }
    },
  },
});
</script>