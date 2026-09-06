import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/models/User";
import {
  fazerLogin,
  obterSessaoAtual,
  fazerLogout,
  criarConta
  , atualizarBiografia
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

  async function guardarBiografia(bio: string) {
    if (!usuario.value) return;
    carregando.value = true;
    try {
      usuario.value = { ...usuario.value, bio: await atualizarBiografia(bio) };
      localStorage.setItem("skillswap:sessao", JSON.stringify(usuario.value));
    } finally {
      carregando.value = false;
    }
  }

  return { usuario, carregando, estaLogado, login, registar, guardarBiografia, logout };
});
