<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { CreateScenarioInput } from "../types/scenario";
import { createScenario } from "../api/scenarios";

const router = useRouter();
const submitting = ref(false);
const error = ref("");

const form = ref<CreateScenarioInput>({
  title: "",
  description: "",
  setting: "",
  difficulty: "medium",
  minPlayers: 4,
  maxPlayers: 12,
});

async function handleSubmit() {
  submitting.value = true;
  error.value = "";
  try {
    const input: CreateScenarioInput = {
      title: form.value.title,
      description: form.value.description,
      difficulty: form.value.difficulty,
      minPlayers: form.value.minPlayers,
      maxPlayers: form.value.maxPlayers,
    };
    if (form.value.setting) {
      input.setting = form.value.setting;
    }
    await createScenario(input);
    router.push("/scenarios");
  } catch (e: any) {
    error.value = e.message;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">New Scenario</h1>

    <form @submit.prevent="handleSubmit" class="space-y-5 max-w-xl">
      <p v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title *</label>
        <input
          id="title"
          v-model="form.title"
          required
          maxlength="255"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description *</label>
        <textarea
          id="description"
          v-model="form.description"
          required
          rows="4"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="setting" class="block text-sm font-medium text-gray-700">Setting</label>
        <input
          id="setting"
          v-model="form.setting"
          maxlength="255"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="difficulty" class="block text-sm font-medium text-gray-700">Difficulty</label>
        <select
          id="difficulty"
          v-model="form.difficulty"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="minPlayers" class="block text-sm font-medium text-gray-700">Min Players</label>
          <input
            id="minPlayers"
            v-model.number="form.minPlayers"
            type="number"
            min="2"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="maxPlayers" class="block text-sm font-medium text-gray-700">Max Players</label>
          <input
            id="maxPlayers"
            v-model.number="form.maxPlayers"
            type="number"
            min="2"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="submitting"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ submitting ? "Creating..." : "Create Scenario" }}
        </button>
        <RouterLink
          to="/scenarios"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>
