<script setup lang="ts">
import { onMounted } from "vue";
import { useQuasar } from "quasar";
import { useChat } from "@/composables/useChat";
import ChatBubble from "@/components/ChatBubble.vue";

const $q = useQuasar();
const { novoTexto, mensagens, enviarMensagem, handleEnter, carregarHistorico } =
  useChat();

onMounted(() => {
  void carregarHistorico();
});

function abrirVideoChamada() {
  $q.notify({ type: "info", message: "Chamada de vídeo iniciada" });
}

function abrirChamada() {
  $q.notify({ type: "info", message: "Ligação iniciada" });
}
</script>

<template>
  <q-page class="column">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-btn flat round dense icon="arrow_back" to="/chats" />
      <q-toolbar-title>Ana Silva</q-toolbar-title>
      <q-btn flat round dense icon="videocam" @click="abrirVideoChamada" />
      <q-btn flat round dense icon="call" @click="abrirChamada" />
    </q-toolbar>

    <div class="col scroll q-pa-md" style="background: #ece5dd">
      <ChatBubble
        v-for="msg in mensagens"
        :key="msg.id"
        :message="msg"
        :is-me="msg.remetenteId === 'meu-id-unico'"
      />
    </div>

    <q-toolbar class="bg-white shadow-up-2 chat-input-bar">
      <q-input
        v-model="novoTexto"
        outlined
        dense
        placeholder="Digite uma mensagem..."
        @keyup.enter="handleEnter($event)"
        class="col chat-input"
      />
      <q-btn
        class="send-btn"
        round
        dense
        icon="send"
        color="primary"
        @click="() => { void enviarMensagem() }"
        :disable="!novoTexto.trim()"
      />
    </q-toolbar>
  </q-page>
</template>

<style scoped>
.chat-input-bar {
  padding: 10px 12px 14px;
  gap: 10px;
}

.chat-input {
  --q-field-padding: 0 12px;
}

.send-btn {
  width: 48px;
  height: 48px;
  min-width: 48px;
  box-shadow: 0 12px 22px rgba(37, 99, 235, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.send-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(37, 99, 235, 0.3);
}
</style>
