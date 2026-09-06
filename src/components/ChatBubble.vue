<script setup lang="ts">
import { computed } from "vue";
import type { Message } from "@/models/Message";

const props = defineProps<{
  message: Message;
  isMe: boolean;
}>();

const bubbleClass = computed(() =>
  props.isMe ? "bg-primary text-white" : "bg-grey-3 text-grey-9"
);
const alignClass = computed(() =>
  props.isMe ? "justify-end" : "justify-start"
);
</script>

<template>
  <div :class="['row', alignClass, 'q-mb-sm']">
    <div
      :class="['q-pa-sm rounded-borders', bubbleClass]"
      style="max-width: 75%"
    >
      <div v-if="message.tipo === 'texto'">{{ message.conteudo }}</div>
      <div
        v-else-if="message.tipo === 'audio'"
        class="row items-center q-gutter-sm"
      >
        <q-icon name="play_arrow" />
        <span>{{ message.duracao }}s</span>
      </div>
      <div v-else>[{{ message.tipo.toUpperCase() }}]</div>
      <div class="text-right text-caption opacity-70 q-mt-xs">
        {{
          new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }}
      </div>
    </div>
  </div>
</template>
