<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg bg-success navbar-dark" v-if="isLoggedIn">

        <div class="container">
          <RouterLink class="navbar-brand" to="/home" aria-current="Página Inicial"><b>
              <h2>Ágape</h2>
            </b></RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto mb-2 mb-lg-0">

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false"><b>Famílias</b></a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <RouterLink class="dropdown-item" to="/family" aria-current="Famílias">Cadastrar Famílias</RouterLink>
                  <RouterLink v-if="userRole === 'ROLE_ADMIN'" class="dropdown-item" to="/neighborhood"
                    aria-current="Bairros">Cadastrar Bairros
                  </RouterLink>
                </ul>
              </li>

              <RouterLink v-if="userRole === 'ROLE_ADMIN'" class="nav-link" to="/leader" aria-current="Lideres">
                <b>Lideres</b>
              </RouterLink>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false"><b>Doações</b></a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <RouterLink v-if="userRole === 'ROLE_ADMIN'" class="dropdown-item" to="/sponsor"
                    aria-current="Doadores">Cadastrar Doadores</RouterLink>
                  <li>
                    <hr class="drop-divider">
                  </li>
                  <a class="nav-link disabled text-muted" href="#" tabindex="-1" aria-disabled="true">Cadastrar
                    Doações</a>
                  <RouterLink class="dropdown-item" to="/food-contribution" aria-current="Cestas Básicas">Cestas Básicas
                  </RouterLink>
                  <RouterLink class="dropdown-item" to="/child-contribution" aria-current="Roupas">Roupas e Calçados
                  </RouterLink>
                </ul>
              </li>

              <li v-if="userRole === 'ROLE_ADMIN'" class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false"><b>Campanhas</b></a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <RouterLink class="dropdown-item" to="/campaign" aria-current="Campanhas">Cadastrar Campanha
                  </RouterLink>
                  <li>
                    <hr class="drop-divider">
                  </li>
                  <a class="nav-link disabled text-muted" href="#" tabindex="-1" aria-disabled="true">Relatórios</a>
                  <RouterLink class="dropdown-item" to="/food-contribution/report"
                    aria-current="Relatório de Doações de Cestas Básicas">
                    Cestas Básicas</RouterLink>
                  <RouterLink class="dropdown-item" to="/child-contribution/report"
                    aria-current="Relatório de Doações de Roupas e Calçados">
                    Roupas e Calçados</RouterLink>
                </ul>
              </li>

              <RouterLink class="nav-link" to="/about" aria-current="Sobre"><b>Sobre</b></RouterLink>
              <RouterLink v-if="isLoggedIn" class="nav-link" to="/" @click.prevent="logout" aria-current="Sobre">
                <b>Sair</b>
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
      <nav class="navbar navbar-expand-lg bg-success navbar-dark" v-else>
        <div class="container">
          <RouterLink class="navbar-brand" to="/" aria-current="Página Inicial"><b>
              <h2>Ágape</h2>
            </b></RouterLink>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>


<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { getUserRole } from '@/utils/auth.js';
import { isLoggedIn, updateAuthState } from '@/utils/authstate.ts';

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: isLoggedIn,
      userRole: getUserRole(),
    }
  },
  watch: {
    isLoggedIn(loginValue) {
      this.isLoggedIn = loginValue;
      this.getUserRole();
    }
  },
  methods: {
    getUserRole() {
      this.userRole = getUserRole();
    },
    closeMobileMenu() {
      if (window.innerWidth < 992) { // Check if mobile view
        const navbarToggler = document.querySelector('.navbar-toggler')
        const navbarCollapse = document.querySelector('.navbar-collapse')

        if (navbarCollapse?.classList.contains('show')) {
          navbarToggler?.dispatchEvent(new Event('click'))
        }
      }
    },
    logout() {
      var $this = this;
      localStorage.removeItem("jwtToken"); // Remove o token JWT
      localStorage.removeItem("loginRole"); // Remove o papel do usuário, se armazenado
      updateAuthState(false); // Atualiza o estado de login global
      this.userRole = null; // Limpa o papel do usuário""
      $this.$router.push('/'); // Redireciona para a página inicial
    }
  }
}
</script>

