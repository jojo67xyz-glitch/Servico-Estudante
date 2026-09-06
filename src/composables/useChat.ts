import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import type { NovaMensagemInput } from "@/models/Message";

export function useChat() {
  const route = useRoute();
  const chatStore = useChatStore();
  const authStore = useAuthStore();

  const novoTexto = ref("");
  const enviando = ref(false);

  const { mensagensPorMatch, carregando } = storeToRefs(chatStore);

  // CORREÇÃO CRÍTICA: Casting seguro para rotas automáticas
  const matchId = computed(() => (route.params as any).id as string);

  const mensagens = computed(
    () => mensagensPorMatch.value[matchId.value] || []
  );

  const temHistorico = computed(() => mensagens.value.length > 0);
  const estaCarregando = computed(() => carregando.value[matchId.value]);

  async function enviarMensagem(): Promise<void> {
    if (!novoTexto.value.trim() || !matchId.value || enviando.value) return;

    enviando.value = true;
    try {
      const dados: NovaMensagemInput = {
        matchId: matchId.value,
        remetenteId: authStore.usuario?.id || "anonimo",
        tipo: "texto",
        conteudo: novoTexto.value.trim()
      };

      await chatStore.adicionarMensagem(matchId.value, dados);
      novoTexto.value = "";
    } catch (erro) {
      console.error("Falha ao enviar mensagem:", erro);
    } finally {
      enviando.value = false;
    }
  }

  async function carregarHistorico(): Promise<void> {
    if (matchId.value && !estaCarregando.value) {
      await chatStore.carregarHistorico(matchId.value);
      chatStore.marcarComoLidas(matchId.value);
    }
  }

  function handleEnter(e: KeyboardEvent): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void enviarMensagem();
    }
  }

  // CORREÇÃO CRÍTICA: Watcher também usa casting seguro
  watch(
    () => (route.params as any).id,
    (novoId, antigoId) => {
      if (novoId && novoId !== antigoId) {
        void carregarHistorico();
      }
    },
    { immediate: true }
  );

  return {
    novoTexto,
    enviando,
    mensagens,
    temHistorico,
    estaCarregando,
    matchId,
    enviarMensagem,
    carregarHistorico,
    handleEnter
  };
}
