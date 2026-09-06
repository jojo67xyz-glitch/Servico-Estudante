import { ref } from "vue";
import { defineStore } from "pinia";
import type { Message, NovaMensagemInput } from "@/models/Message";
import {
  obterHistorico,
  enviarMensagem as serviceEnviar
} from "@/services/chatService";

export const useChatStore = defineStore("chat", () => {
  const mensagensPorMatch = ref<Record<string, Message[]>>({});
  const carregando = ref<Record<string, boolean>>({});

  function obterMensagens(matchId: string): Message[] {
    return mensagensPorMatch.value[matchId] || [];
  }

  async function carregarHistorico(matchId: string) {
    if (carregando.value[matchId]) return;
    carregando.value[matchId] = true;
    try {
      const msgs = await obterHistorico(matchId);
      mensagensPorMatch.value[matchId] = msgs;
    } finally {
      carregando.value[matchId] = false;
    }
  }

  async function adicionarMensagem(matchId: string, nova: NovaMensagemInput) {
    const msgEnviada = await serviceEnviar(nova);
    if (!mensagensPorMatch.value[matchId]) {
      mensagensPorMatch.value[matchId] = [];
    }
    mensagensPorMatch.value[matchId].push(msgEnviada);
  }

  function marcarComoLidas(matchId: string) {
    const msgs = mensagensPorMatch.value[matchId];
    if (msgs) msgs.forEach(m => (m.lida = true));
  }

  return {
    mensagensPorMatch,
    carregando,
    obterMensagens,
    carregarHistorico,
    adicionarMensagem,
    marcarComoLidas
  };
});
