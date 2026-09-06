<script setup lang="ts">
import { computed } from "vue";

const matchesAtivos = computed(() => [
  {
    id: "m1",
    nome: "Ana Silva",
    foto: "https://cdn.quasar.dev/img/avatar.png",
    ultimaMsg: "Oi! Podemos marcar?",
    hora: "10:30"
  },
  {
    id: "m2",
    nome: "Carlos Mendes",
    foto: "https://cdn.quasar.dev/img/boy-avatar.png",
    ultimaMsg: "Claro, que tal amanhã?",
    hora: "Ontem"
  }
]);
</script>

<template>
  <q-page>
    <q-list separator>
      <q-item-label header class="bg-grey-2">Conversas Recentes</q-item-label>
      <q-item
        v-for="match in matchesAtivos"
        :key="match.id"
        clickable
        :to="`/chat/${match.id}`"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="match.foto" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ match.nome }}</q-item-label>
          <q-item-label caption lines="1">{{ match.ultimaMsg }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label caption>{{ match.hora }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
