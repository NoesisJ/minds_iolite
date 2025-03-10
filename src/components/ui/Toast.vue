<template>
  <!-- Toast Container -->
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <!-- Toast Item -->
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="animate-slidein w-72 p-4 rounded-lg shadow-xs flex items-center justify-between transition-all duration-300 relative overflow-hidden"
        :class="[
          toastClass(toast.severity),
          { 'animate-scale': toast.isPulsing },
        ]"
        @mouseenter="pauseToast(toast.id)"
        @mouseleave="resumeToast(toast.id)"
      >
        <!-- Pulse Effect Background -->
        <div
          v-if="toast.isPulsing"
          class="absolute inset-y-0 left-0 w-full bg-green-200/50 animate-pulse"
          :class="{ 'animate-pulse': toast.isPulsing }"
        ></div>

        <!-- Toast Content -->
        <div
          class="flex items-center space-x-2 w-full transition-transform duration-200"
          :class="{ 'scale-95': toast.isClicked }"
          @click="handleClick(toast)"
        >
          <!-- Toast Icon -->
          <span class="toast-icon">
            <component :is="toastIcon(toast.severity)" :size="18" />
          </span>

          <!-- Toast Text -->
          <div class="flex flex-col flex-1 min-w-0">
            <p class="toast-summary font-semibold line-clamp-1">
              {{ toast.summary }}
            </p>
            <p class="toast-detail text-sm line-clamp-3">{{ toast.detail }}</p>
          </div>
        </div>

        <!-- Close Button -->
        <button
          @click="removeToast(toast.id)"
          class="toast-close opacity-70 hover:opacity-100 transition-opacity"
        >
          <X :size="16" />
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-vue-next";

// Toast Item Interface
interface ToastItem {
  id: number;
  severity: "success" | "info" | "warn" | "error";
  summary: string;
  detail: string;
  life?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
  isHovered?: boolean; // Track hover state
  isClicked?: boolean; // Track click state
  isPulsing?: boolean; // Track pulse effect state
}

// State
const toasts = ref<ToastItem[]>([]);
let toastId = 0;

// Add Toast
const add = (toast: Omit<ToastItem, "id">) => {
  const id = toastId++;
  const newToast: ToastItem = {
    ...toast,
    id,
    isHovered: false,
    isClicked: false,
    isPulsing: false,
  };
  toasts.value.push(newToast);

  // Auto-remove toast after life time
  if (toast.life !== 0) {
    newToast.timeoutId = setTimeout(() => removeToast(id), toast.life || 3000);
  }
};

// Remove Toast
const removeToast = (id: number) => {
  const toast = toasts.value.find((toast) => toast.id === id);
  if (toast && toast.timeoutId) {
    clearTimeout(toast.timeoutId);
  }
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

// Pause Toast
const pauseToast = (id: number) => {
  const toast = toasts.value.find((toast) => toast.id === id);
  if (toast) {
    toast.isHovered = true; // Set hover state
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId);
      toast.timeoutId = undefined;
    }
  }
};

// Resume Toast
const resumeToast = (id: number) => {
  const toast = toasts.value.find((toast) => toast.id === id);
  if (toast) {
    toast.isHovered = false; // Reset hover state
    if (toast.life !== 0) {
      toast.timeoutId = setTimeout(() => removeToast(id), toast.life || 3000);
    }
  }
};

// Handle Click
const handleClick = (toast: ToastItem) => {
  toast.isClicked = true;
  toast.isPulsing = true;

  setTimeout(() => {
    toast.isClicked = false;
    toast.isPulsing = false;
    removeToast(toast.id); // Remove toast after animation
  }, 500);
};

// Toast Class
const toastClass = (severity: string) => {
  switch (severity) {
    case "success":
      return "bg-green-100/95 text-green-800";
    case "info":
      return "bg-blue-100/95 text-blue-800";
    case "warn":
      return "bg-yellow-100/95 text-yellow-800";
    case "error":
      return "bg-red-100/95 text-red-800";
    default:
      return "bg-gray-100/95 text-gray-800";
  }
};

// Toast Icon
const toastIcon = (severity: string) => {
  switch (severity) {
    case "success":
      return CheckCircle2;
    case "info":
      return Info;
    case "warn":
      return AlertCircle;
    case "error":
      return AlertCircle;
    default:
      return Info;
  }
};

// Expose add method
defineExpose({ add });
</script>

<style scoped>
@keyframes pulse {
  0% {
    transform: scaleX(0);
    opacity: 1;
  }
  100% {
    transform: scaleX(1);
    opacity: 0;
  }
}

@keyframes scale {
  0% {
    scale: 1;
  }
  40% {
    scale: 0.95;
  }
  100% {
    scale: 1;
  }
}

.animate-pulse {
  animation: pulse 0.5s ease-out;
}

.animate-scale {
  animation: scale 0.5s ease-out;
}
</style>
