import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/models/User";
import { obterCandidatos } from "../services/mtchingService";

export const useMatchStore = defineStore("match", () => {
  const candidatos = ref<User[]>([]);
  const carregando = ref(false);
  const inicializada = ref(false);

  const totalCandidatos = computed(() => candidatos.value.length);

  async function inicializar() {
    if (inicializada.value) return;
    carregando.value = true;
    try {
      candidatos.value = await obterCandidatos();
      inicializada.value = true;
    } finally {
      carregando.value = false;
    }
  }

  function removerCandidato(id: string) {
    candidatos.value = candidatos.value.filter(u => u.id !== id);
  }

  return {
    candidatos,
    carregando,
    inicializada,
    totalCandidatos,
    inicializar,
    removerCandidato
  };
});
