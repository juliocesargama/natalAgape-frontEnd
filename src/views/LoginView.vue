<template>
    <div class="container mt-5">
      <div class="card">
        <div class="card-header">
          <h3>Login</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="username" class="form-label">Usuário</label>
              <input v-model="username" type="text" id="username" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Senha</label>
              <input v-model="password" type="password" id="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import {  updateAuthState } from '@/utils/authstate.ts';
  
  export default {
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post("api/auth/login", {
            username: this.username,
            password: this.password,
          });
          const token = response.data.token; // Supondo que o token JWT seja retornado no campo `token`
          localStorage.setItem("jwtToken", token); // Armazena o token no localStorage
          updateAuthState(true); // Atualiza o estado de login global
          this.$router.push("/home"); // Redireciona para a página inicial
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          alert("Credenciais inválidas.");
        }
      },
    },
  };
  </script>