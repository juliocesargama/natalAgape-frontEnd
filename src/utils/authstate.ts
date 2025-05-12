import { ref } from 'vue';

export const isLoggedIn = ref(!!localStorage.getItem('jwtToken')); // Estado reativo para login

export const updateAuthState = (loggedIn: boolean) => {
  isLoggedIn.value = loggedIn;
};