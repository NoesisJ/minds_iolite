<!-- components/chat/SearchResults.vue -->
<template>
  <div class="mt-4 border-l-4 border-[#c96442] p-4 bg-[#2a2a2a]/50 rounded-lg">
    <div class="flex items-center gap-2 mb-3">
      <Globe class="w-5 h-5 text-[#c96442]" />
      <span class="font-medium">联网搜索结果</span>
      <button
        @click="toggleExpand"
        class="ml-auto text-xs text-gray-400 hover:text-[#c96442]"
      >
        {{ isExpanded ? "折叠" : "展开" }}
      </button>
    </div>

    <div v-if="isExpanded" class="space-y-3">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="p-3 rounded-lg bg-[#353535] hover:bg-[#404040] transition-colors overflow-hidden"
      >
        <a :href="result.url" target="_blank" class="block group/search">
          <div class="flex items-start gap-2">
            <span class="text-xs text-[#c96442] truncate"
              >{{ result.rank }}.</span
            >
            <div>
              <h3
                class="font-medium group-hover/search:text-[#c96442] duration-200 truncate max-w-lg"
              >
                {{ result.title }}
              </h3>
              <p class="text-sm text-gray-400 mt-1 line-clamp-2 truncate">
                {{ result.abstract }}
              </p>
              <div class="mt-2 text-xs text-gray-500 truncate">
                {{ formatDomain(result.url) }}
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Globe } from "lucide-vue-next";

interface SearchResult {
  title: string;
  abstract: string;
  url: string;
  rank: number;
}

defineProps<{
  results: SearchResult[];
}>();

const isExpanded = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const formatDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch {
    return url;
  }
};
</script>
