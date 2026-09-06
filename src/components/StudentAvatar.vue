<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    nome: string;
    fotoUrl?: string | null;
    avaliacao?: number;
    tamanho?: "sm" | "md" | "lg";
    mostrarNota?: boolean;
  }>(),
  {
    tamanho: "md",
    mostrarNota: false,
    avaliacao: 0
  }
);

const sizeMap = { sm: "40px", md: "56px", lg: "80px" };
const avatarSize = computed(() => sizeMap[props.tamanho]);

const notaColor = computed(() => {
  if (props.avaliacao >= 4.5) return "positive";
  if (props.avaliacao >= 3.5) return "warning";
  return "negative";
});

const iniciais = computed(() => {
  const nome = props.nome.trim();
  const partes = nome ? nome.split(/\s+/).filter(Boolean) : [];

  if (partes.length === 0) return "?";

  const primeira = partes[0]?.charAt(0) ?? "?";
  if (partes.length === 1) return primeira.toUpperCase();

  const ultima = partes[partes.length - 1]?.charAt(0) ?? "?";
  return `${primeira}${ultima}`.toUpperCase();
});
</script>

<template>
  <div class="relative-position inline-block">
    <q-avatar :size="avatarSize" color="primary" text-color="white">
      <img v-if="fotoUrl" :src="fotoUrl" :alt="nome" />
      <span v-else class="text-weight-bold">{{ iniciais }}</span>
    </q-avatar>

    <q-badge
      v-if="mostrarNota && avaliacao > 0"
      floating
      rounded
      :color="notaColor"
      class="q-pa-xs text-caption"
      style="bottom: -2px; right: -4px"
    >
      {{ avaliacao.toFixed(1) }}
    </q-badge>
  </div>
</template>
