<script setup lang="ts">
import { computed } from "vue";
import type { User } from "@/models/User";

const props = defineProps<{
  user: User;
  offsetX?: number;
}>();

defineEmits<{
  swipeLeft: [];
  swipeRight: [];
}>();

const transformStyle = computed(() => ({
  transform: `translateX(${props.offsetX ?? 0}px) rotate(${(props.offsetX ?? 0) * 0.05}deg)`,
  transition: props.offsetX === 0 ? "transform 0.3s ease" : "none"
}));
</script>

<template>
  <q-card flat class="match-card" :style="transformStyle">
    <q-img :src="user.fotoPerfil" class="match-image">
      <div class="absolute-bottom text-white q-pa-md match-overlay">
        <div class="text-h5 text-weight-bold">{{ user.nome }}</div>
        <div class="text-caption match-bio">{{ user.bio }}</div>

        <div class="row q-mt-sm q-gutter-xs">
          <q-chip size="sm" color="primary" text-color="white" class="match-chip">
            Ensina: {{ user.habilidades[0]?.nome }}
          </q-chip>
          <q-chip size="sm" color="secondary" text-color="white" class="match-chip">
            Quer: {{ user.interesses[0]?.nome }}
          </q-chip>
        </div>
      </div>
    </q-img>
  </q-card>
</template>

<style scoped>
.match-card {
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.38);
  box-shadow: 0 22px 38px rgba(15, 23, 42, 0.15);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.7));
}

.match-image {
  height: 430px;
  border-radius: 28px;
}

.match-overlay {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.7));
}

.match-bio {
  max-width: 92%;
  opacity: 0.85;
  line-height: 1.45;
}

.match-chip {
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  font-weight: 600;
}
</style>
