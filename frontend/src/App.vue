<script setup lang="ts">
import { useAuth } from "./composables/useAuth";
import { useRouter } from "vue-router";

const { currentUser, isCreator, logout } = useAuth();
const router = useRouter();

async function handleLogout() {
  await logout();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <RouterLink to="/scenarios" class="text-xl font-bold text-gray-900">
          Murder Party Creator
        </RouterLink>

        <div v-if="currentUser" class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <img
              v-if="currentUser.avatarUrl"
              :src="currentUser.avatarUrl"
              :alt="currentUser.name || 'User'"
              class="w-8 h-8 rounded-full"
            />
            <div class="text-sm">
              <p class="font-medium text-gray-900">
                {{ currentUser.name || currentUser.email }}
              </p>
              <p class="text-xs text-gray-500">
                {{ isCreator ? "Creator" : "Player" }}
              </p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-4xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
