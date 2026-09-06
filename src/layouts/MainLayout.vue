<script setup lang="ts">
import { ref } from "vue";
const menuAberto = ref(false);

function selecionarPerfil() {
  menuAberto.value = false;
}
</script>

<template>
  <q-layout view="hHh lpR fFf" class="premium-layout">
    <q-header elevated class="premium-header text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="menuAberto = !menuAberto"
          class="gt-sm menu-btn"
        />
        <q-toolbar-title class="text-weight-bold">SkillSwap</q-toolbar-title>

        <q-tabs class="gt-sm premium-tabs" shrink>
          <q-route-tab to="/descobrir" label="Descobrir" icon="explore" />
          <q-route-tab to="/chats" label="Chats" icon="chat_bubble_outline" />
          <q-route-tab to="/agenda" label="Agenda" icon="event" />
          <q-route-tab to="/perfil" exact label="Perfil" icon="person" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="menuAberto" show-if-above bordered :width="240">
      <q-list padding>
        <q-item clickable v-ripple to="/descobrir" exact>
          <q-item-section avatar><q-icon name="explore" /></q-item-section>
          <q-item-section>Descobrir</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/chats">
          <q-item-section avatar
            ><q-icon name="chat_bubble_outline"
          /></q-item-section>
          <q-item-section>Chats</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/agenda">
          <q-item-section avatar><q-icon name="event" /></q-item-section>
          <q-item-section>Agenda</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/perfil" exact @click="selecionarPerfil">
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section>Meu Perfil</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="lt-md premium-footer text-grey-9 shadow-up-3">
      <q-tabs shrink indicator-color="primary" active-color="primary">
        <q-route-tab to="/descobrir" icon="explore" label="Descobrir" />
        <q-route-tab to="/chats" icon="chat_bubble_outline" label="Chats" />
        <q-route-tab to="/agenda" icon="event" label="Agenda" />
        <q-route-tab to="/perfil" exact icon="person" label="Perfil" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<style scoped>
.premium-layout {
  background: transparent;
}

.premium-header {
  background: linear-gradient(135deg, #111827 0%, #1f2937 45%, #312e81 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.18);
}

.menu-btn {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.premium-tabs {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2px 6px;
}

.premium-footer {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px);
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 -12px 28px rgba(15, 23, 42, 0.08);
}
</style>
