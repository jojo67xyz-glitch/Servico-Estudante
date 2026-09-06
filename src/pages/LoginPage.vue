<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const modoRegisto = ref(false);
const nome = ref("");
const email = ref("");
const password = ref("");

async function entrar() {
  try {
    if (modoRegisto.value) {
      await authStore.registar(nome.value, email.value, password.value);
      $q.notify({ type: "positive", message: "Conta criada com sucesso!" });
    } else {
      await authStore.login(email.value, password.value);
      $q.notify({ type: "positive", message: "Bem-vindo ao SkillSwap!" });
    }
    await router.push("/descobrir");
  } catch (erro) {
    $q.notify({
      type: "negative",
      message: erro instanceof Error ? erro.message : "Não foi possível concluir a operação"
    });
  }
}

function alternarModo() {
  modoRegisto.value = !modoRegisto.value;
}
</script>

<template>
  <q-page class="login-page flex flex-center">
    <div class="login-glow login-glow--one" />
    <div class="login-glow login-glow--two" />

    <q-card flat class="login-card q-pa-xl">
      <div class="text-center q-mb-xl">
        <div class="brand-badge">SkillSwap</div>
        <div class="text-h4 text-weight-bold text-dark q-mt-md">
          {{ modoRegisto ? "Crie a sua conta." : "Conecte talento." }}
        </div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">
          Troca de serviços entre estudantes
        </div>
      </div>

      <q-form @submit="() => { void entrar() }" class="q-gutter-md">
        <q-input
          v-if="modoRegisto"
          v-model="nome"
          outlined
          label="Nome completo"
          lazy-rules
          :rules="[val => !!val || 'Campo obrigatório']"
          class="login-input"
        />
        <q-input
          v-model="email"
          outlined
          label="Email acadêmico"
          type="email"
          lazy-rules
          :rules="[val => !!val || 'Campo obrigatório']"
          class="login-input"
        />
        <q-input
          v-model="password"
          outlined
          label="Password"
          type="password"
          lazy-rules
          :rules="[val => val.length >= 6 || 'Use pelo menos 6 caracteres']"
          class="login-input"
        />

        <q-btn
          type="submit"
          :label="modoRegisto ? 'Criar conta' : 'Entrar'"
          class="login-button full-width"
          :loading="authStore.carregando"
        />
      </q-form>

      <div class="login-footer q-mt-lg text-center text-grey-7">
        <button type="button" class="mode-link" @click="alternarModo">
          {{ modoRegisto ? "Já tenho uma conta" : "Ainda não tenho conta" }}
        </button>
      </div>
    </q-card>
  </q-page>
</template>

<style scoped>
.login-page {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(79, 70, 229, 0.22), transparent 25%),
    radial-gradient(circle at bottom right, rgba(20, 184, 166, 0.18), transparent 28%),
    linear-gradient(135deg, #f7f9ff 0%, #eef2ff 40%, #f8fafc 100%);
}

.login-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
}

.login-glow--one {
  width: 220px;
  height: 220px;
  background: rgba(79, 70, 229, 0.24);
  top: 8%;
  left: 12%;
}

.login-glow--two {
  width: 240px;
  height: 240px;
  background: rgba(20, 184, 166, 0.2);
  right: 9%;
  bottom: 10%;
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(92vw, 420px);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.66);
  backdrop-filter: blur(16px);
  box-shadow: 0 35px 60px rgba(31, 41, 55, 0.12);
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(20, 184, 166, 0.12));
  color: #312e81;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-input :deep(.q-field__control) {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
}

.login-button {
  min-height: 52px;
  border-radius: 18px !important;
  background: linear-gradient(135deg, #4f46e5 0%, #1d4ed8 100%);
  box-shadow: 0 18px 30px rgba(79, 70, 229, 0.28);
  color: white;
  font-weight: 700;
}

.login-footer {
  font-size: 0.8rem;
}

.mode-link {
  border: 0;
  background: transparent;
  color: #3730a3;
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px;
}
</style>
