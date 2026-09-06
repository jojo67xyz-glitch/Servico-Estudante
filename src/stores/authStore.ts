import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/models/User";
import {
  fazerLogin,
  obterSessaoAtual,
  fazerLogout,
  criarConta
} from "@/services/authService";

export const useAuthStore = defineStore("auth", () => {
  const usuario = ref<User | null>(obterSessaoAtual());
  const carregando = ref(false);
  const estaLogado = computed(() => !!usuario.value);

  async function login(email: string, password: string) {
    carregando.value = true;
    try {
      usuario.value = await fazerLogin(email, password);
    } finally {
      carregando.value = false;
    }
  }

  async function registar(nome: string, email: string, password: string) {
    carregando.value = true;
    try {
      usuario.value = await criarConta(nome, email, password);
    } finally {
      carregando.value = false;
    }
  }

  function logout() {
    fazerLogout();
    usuario.value = null;
  }

  return { usuario, carregando, estaLogado, login, registar, logout };
});
