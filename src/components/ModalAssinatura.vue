<!-- filepath: src/components/ModalAssinatura.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('fechar')">
    <div class="modal-content">
      <img :src="imagemUrl" alt="Assinatura" class="img-fluid" />
      <button class="btn btn-secondary mt-3" @click="$emit('fechar')">Fechar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalAssinatura",
  props: {
    imagemUrl: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 90vw;
  max-height: 90vh;
}
.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>