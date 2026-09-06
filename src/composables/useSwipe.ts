import { ref } from "vue";

export function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = ref(0);
  const currentX = ref(0);
  const isDragging = ref(false);

  function start(e: TouchEvent | MouseEvent) {
    isDragging.value = true;
    const touchX = "touches" in e ? e.touches?.[0]?.clientX : undefined;
    startX.value = touchX ?? (e as MouseEvent).clientX;
  }

  function move(e: TouchEvent | MouseEvent) {
    if (!isDragging.value) return;
    const touchX = "touches" in e ? e.touches?.[0]?.clientX : undefined;
    currentX.value = (touchX ?? (e as MouseEvent).clientX) - startX.value;
  }

  function end() {
    if (!isDragging.value) return;
    isDragging.value = false;
    if (currentX.value > 100) onRight();
    else if (currentX.value < -100) onLeft();
    currentX.value = 0;
  }

  return { startX, currentX, isDragging, start, move, end };
}
