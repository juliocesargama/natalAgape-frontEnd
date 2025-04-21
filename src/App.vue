<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const navLinks = ref<NodeListOf<Element>>()

const closeMobileMenu = () => {
  if (window.innerWidth < 992) { // Check if mobile view
    const navbarToggler = document.querySelector('.navbar-toggler')
    const navbarCollapse = document.querySelector('.navbar-collapse')

    if (navbarCollapse?.classList.contains('show')) {
      navbarToggler?.dispatchEvent(new Event('click'))
    }
  }
}
</script>

<template>
  <header>

    <div class="wrapper">
      <nav class="navbar navbar-expand-lg bg-success navbar-dark">
        <div class="container">
          <RouterLink class="navbar-brand" to="/" aria-current="Página Inicial"><b>
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
                  <RouterLink class="dropdown-item" to="/neighborhood" aria-current="Bairros">Cadastrar Bairros
                  </RouterLink>
                </ul>
              </li>

              <RouterLink class="nav-link" to="/leader" aria-current="Lideres"><b>Lideres</b></RouterLink>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false"><b>Doações</b></a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <RouterLink class="dropdown-item" to="/sponsor" aria-current="Doadores">Doadores</RouterLink>
                  <RouterLink class="dropdown-item" to="/food-contribution" aria-current="Cestas Básicas">Cestas Básicas
                  </RouterLink>
                  <RouterLink class="dropdown-item" to="/child-contribution" aria-current="Roupas">Roupas e Calçados
                  </RouterLink>
                </ul>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false"><b>Campanhas</b></a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <RouterLink class="dropdown-item" to="/campaign" aria-current="Campanhas">Nova Campanha</RouterLink>
                  <li>
                    <hr class="drop-divider">
                  </li>
                  <a class="nav-link disabled text-muted" href="#" tabindex="-1" aria-disabled="true">Relatórios</a>
                  <RouterLink class="dropdown-item" to="/food-contribution/report" aria-current="Relatório de Doações">
                    Cestas Básicas</RouterLink>
                </ul>
              </li>

              <RouterLink class="nav-link" to="/about" aria-current="Sobre"><b>Sobre</b></RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.navbar-toggler:focus {
  box-shadow: 0 0 0 0.1rem rgba(255, 255, 255, 0.5);
}

@media (max-width: 991.98px) {
  .navbar-nav {
    padding-top: 1rem;
  }

  .nav-link {
    padding: 0.5rem 1rem;
  }
}
</style>
