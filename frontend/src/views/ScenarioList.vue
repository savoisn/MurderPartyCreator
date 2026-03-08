<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Scenario } from "../types/scenario";
import { fetchScenarios, deleteScenario } from "../api/scenarios";
import { useAuth } from "../composables/useAuth";

const { isCreator } = useAuth();

const scenarios = ref<Scenario[]>([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    scenarios.value = await fetchScenarios();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

async function handleDelete(id: string) {
  if (!confirm("Delete this scenario?")) return;
  try {
    await deleteScenario(id);
    scenarios.value = scenarios.value.filter((s) => s.id !== id);
  } catch (e: any) {
    error.value = e.message;
  }
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Scenarios</h1>
      <RouterLink
        v-if="isCreator"
        to="/scenarios/new"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        New Scenario
      </RouterLink>
    </div>

    <p v-if="loading" class="text-gray-500">Loading...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else-if="scenarios.length === 0" class="text-center py-12 text-gray-500">
      <p v-if="isCreator">No scenarios yet. Create your first one!</p>
      <p v-else>No scenarios available.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="scenario in scenarios"
        :key="scenario.id"
        class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ scenario.title }}</h2>
            <p class="mt-1 text-sm text-gray-600">{{ scenario.description }}</p>
          </div>
          <button
            v-if="isCreator"
            @click="handleDelete(scenario.id)"
            class="ml-4 text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
        <div class="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
          <span
            :class="difficultyColors[scenario.difficulty]"
            class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {{ scenario.difficulty }}
          </span>
          <span>{{ scenario.minPlayers }}–{{ scenario.maxPlayers }} players</span>
          <span v-if="scenario.setting">{{ scenario.setting }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
