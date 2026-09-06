<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import type { Habilidade } from "@/models/User";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const dialogAberto = ref(false);
const biografia = ref("");
const habilidadesTexto = ref("");
const interessesTexto = ref("");
const inputFoto = ref<HTMLInputElement | null>(null);

function abrirEditorBiografia() {
  biografia.value = authStore.usuario?.bio || "";
  dialogAberto.value = true;
}

function escolherFoto() {
  inputFoto.value?.click();
}

async function alterarFoto(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    await authStore.guardarFoto(file);
    $q.notify({ type: "positive", message: "Foto de perfil atualizada" });
  } catch (erro) {
    $q.notify({ type: "negative", message: erro instanceof Error ? erro.message : "Erro ao guardar foto" });
  } finally {
    input.value = "";
  }
}

function abrirEditorCompetencias() {
  habilidadesTexto.value = authStore.usuario?.habilidades.map(item => `${item.nome} (${item.nivel})`).join(", ") || "";
  interessesTexto.value = authStore.usuario?.interesses.map(item => `${item.nome} (${item.nivel})`).join(", ") || "";
  dialogCompetencias.value = true;
}

const dialogCompetencias = ref(false);

function converterLista(valor: string): Habilidade[] {
  return valor.split(",").map(nome => nome.trim()).filter(Boolean).map(nome => ({ nome, nivel: "Intermediário" }));
}

async function guardarCompetencias() {
  try {
    await authStore.guardarPerfil(authStore.usuario?.bio || "", converterLista(habilidadesTexto.value), converterLista(interessesTexto.value));
    dialogCompetencias.value = false;
    $q.notify({ type: "positive", message: "Habilidades e interesses guardados" });
  } catch (erro) {
    $q.notify({ type: "negative", message: erro instanceof Error ? erro.message : "Erro ao guardar" });
  }
}

async function guardarBiografia() {
  try {
    await authStore.guardarPerfil(biografia.value, authStore.usuario?.habilidades || [], authStore.usuario?.interesses || []);
    dialogAberto.value = false;
    $q.notify({ type: "positive", message: "Biografia guardada" });
  } catch (erro) {
    $q.notify({ type: "negative", message: erro instanceof Error ? erro.message : "Erro ao guardar" });
  }
}

function sair() {
  authStore.logout();
  void router.push("/");
}
</script>

<template>
  <q-page padding>
    <div class="text-center q-mb-lg">
      <input ref="inputFoto" type="file" accept="image/*" class="hidden-file-input" @change="alterarFoto" />
      <q-avatar size="100px" class="cursor-pointer" @click="escolherFoto">
        <img :src="authStore.usuario?.fotoPerfil" />
      </q-avatar>
      <div><q-btn flat no-caps color="primary" icon="photo_camera" label="Alterar foto" @click="escolherFoto" /></div>
      <div class="text-h5 q-mt-sm">{{ authStore.usuario?.nome }}</div>
      <div v-if="authStore.usuario?.bio" class="text-caption text-grey-7">
        {{ authStore.usuario.bio }}
      </div>
      <q-btn
        flat
        no-caps
        color="primary"
        :label="authStore.usuario?.bio ? 'Editar biografia' : 'Adicionar biografia'"
        icon="edit"
        class="q-mt-sm"
        @click="abrirEditorBiografia"
      />
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
      outline
      color="primary"
      icon="tune"
      label="Editar habilidades e interesses"
      class="full-width q-mt-md"
      @click="abrirEditorCompetencias"
    />

    <q-btn
      color="negative"
      label="Sair"
      class="full-width q-mt-lg"
      @click="sair"
    />

    <q-dialog v-model="dialogAberto">
      <q-card style="width: min(92vw, 460px)">
        <q-card-section class="text-h6">A sua biografia</q-card-section>
        <q-card-section>
          <q-input
            v-model="biografia"
            outlined
            autofocus
            type="textarea"
            maxlength="500"
            counter
            label="Fale um pouco sobre si"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Guardar" :loading="authStore.carregando" @click="guardarBiografia" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogCompetencias">
      <q-card style="width: min(92vw, 460px)">
        <q-card-section class="text-h6">Habilidades e interesses</q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="habilidadesTexto" outlined label="Habilidades" hint="Separe cada item por vírgula" />
          <q-input v-model="interessesTexto" outlined label="Interesses" hint="Separe cada item por vírgula" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Guardar" :loading="authStore.carregando" @click="guardarCompetencias" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
