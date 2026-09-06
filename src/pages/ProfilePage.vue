<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();

function sair() {
  authStore.logout();
  void router.push("/");
}
</script>

<template>
  <q-page padding>
    <div class="text-center q-mb-lg">
      <q-avatar size="100px">
        <img :src="authStore.usuario?.fotoPerfil" />
      </q-avatar>
      <div class="text-h5 q-mt-sm">{{ authStore.usuario?.nome }}</div>
      <div class="text-caption text-grey-7">{{ authStore.usuario?.bio }}</div>
    </div>

    <q-list bordered separator>
      <q-item-label header>Minhas Habilidades</q-item-label>
      <q-item v-for="hab in authStore.usuario?.habilidades" :key="hab.nome">
        <q-item-section>{{ hab.nome }}</q-item-section>
        <q-item-section side>
          <q-badge color="primary">{{ hab.nivel }}</q-badge>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item-label header>Interesses</q-item-label>
      <q-item v-for="int in authStore.usuario?.interesses" :key="int.nome">
        <q-item-section>{{ int.nome }}</q-item-section>
        <q-item-section side>
          <q-badge color="secondary">{{ int.nivel }}</q-badge>
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn
      color="negative"
      label="Sair"
      class="full-width q-mt-lg"
      @click="sair"
    />
  </q-page>
</template>
