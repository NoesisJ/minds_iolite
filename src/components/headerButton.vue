<template>
  <button
    class="flex items-center justify-center w-9 h-9 rounded-md bg-[var(--material-item-header)] border-none hover:bg-[var(--material-item-bg-hover)]"
    @click="$emit('click')"
  >
    <slot name="icon" />
  </button>
</template>

<script setup lang="ts"></script>
