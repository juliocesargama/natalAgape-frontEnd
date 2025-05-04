<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Digite seu email"
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <button @click="loginWithGoogle" class="google-login">
        Login com Google
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: "",
        errorMessage: "", // Adicionar mensagem de erro
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: this.email }),
          });
  
          if (!response.ok) {
            throw new Error("Erro ao fazer login");
          }
  
          const data = await response.json();
          localStorage.setItem("authToken", data.token);
          this.$router.push({ name: "home" });
        } catch (error) {
          this.errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
          console.error(error.message);
        }
      },
      loginWithGoogle() {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
      },
    },
  };
  </script>
  
  <style scoped>
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>