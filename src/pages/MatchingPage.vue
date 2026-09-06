<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useMatchStore } from "@/stores/matchStore";
import { storeToRefs } from "pinia";
import MatchCard from "@/components/MatchCard.vue";
import { useSwipe } from "@/composables/useSwipe";

const $q = useQuasar();
const matchStore = useMatchStore();
const { candidatos, carregando } = storeToRefs(matchStore);

const indexAtual = ref(0);
const candidatoAtual = computed(() => candidatos.value[indexAtual.value]);

function deslizarEsquerda() {
  if (!candidatoAtual.value) return;
  $q.notify({
    type: "info",
    message: `${candidatoAtual.value.nome} foi pulado`
  });
  matchStore.removerCandidato(candidatoAtual.value.id);
}

function deslizarDireita() {
  if (!candidatoAtual.value) return;
  $q.notify({
    type: "positive",
    message: `Você curtiu ${candidatoAtual.value.nome}!`
  });
  matchStore.removerCandidato(candidatoAtual.value.id);
}

const { currentX, start, move, end } = useSwipe(
  deslizarEsquerda,
  deslizarDireita
);

onMounted(async () => {
  await matchStore.inicializar();
});
</script>

<template>
  <q-page padding class="match-page flex flex-center column q-pb-xl">
    <div v-if="carregando" class="row justify-center">
      <q-spinner color="primary" size="48px" />
    </div>

    <div
      v-else-if="candidatoAtual"
      class="match-card-container relative-position"
      @touchstart="start"
      @touchmove="move"
      @touchend="end"
      @mousedown="start"
      @mousemove="move"
      @mouseup="end"
    >
      <MatchCard :user="candidatoAtual" :offset-x="currentX" />

      <div class="match-actions">
        <q-btn
          class="match-action match-action--reject"
          round
          unelevated
          size="lg"
          icon="close"
          @click="() => deslizarEsquerda()"
        />
        <q-btn
          class="match-action match-action--accept"
          round
          unelevated
          size="lg"
          icon="favorite"
          @click="() => deslizarDireita()"
        />
      </div>
    </div>

    <q-banner
      v-else
      rounded
      class="bg-blue-grey-1 text-blue-grey-9 text-center q-mt-xl"
    >
      Não há mais estudantes compatíveis no momento.
      <template #action>
        <q-btn
          flat
          label="Recarregar"
          color="blue-grey-9"
          @click="() => { void matchStore.inicializar() }"
        />
      </template>
    </q-banner>
  </q-page>
</template>

<style scoped>
.match-page {
  background:
    radial-gradient(circle at top, rgba(79, 70, 229, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

.match-card-container {
  width: 100%;
  max-width: 420px;
  height: 500px;
  touch-action: none;
  position: relative;
  padding-bottom: 90px;
}

.match-actions {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  width: min(260px, calc(100% - 32px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5;
}

.match-action {
  width: 74px !important;
  height: 74px !important;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.match-action:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 22px 36px rgba(15, 23, 42, 0.22);
}

.match-action:active {
  transform: scale(0.96);
}

.match-action--reject {
  background: linear-gradient(135deg, #fca5a5 0%, #ef4444 100%);
  color: white;
}

.match-action--accept {
  background: linear-gradient(135deg, #6ee7b7 0%, #10b981 100%);
  color: white;
}
</style>
