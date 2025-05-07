<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Ágape</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="userRole === 'ROLE_ADMIN'">
              <RouterLink class="nav-link" to="/admin">Administração</RouterLink>
            </li>
            <li class="nav-item" v-if="userRole === 'ROLE_USER'">
              <RouterLink class="nav-link" to="/user">Usuário</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { getUserRole } from "@/utils/auth";
  
  export default {
    data() {
      return {
        userRole: getUserRole(),
      };
    },
  };
  </script>