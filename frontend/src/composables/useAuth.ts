import { ref, computed } from "vue";
import type { User } from "../api/auth";
import { getCurrentUser, logout as apiLogout } from "../api/auth";

const currentUser = ref<User | null>(null);
const loading = ref(false);
const initialized = ref(false);

export function useAuth() {
  async function fetchUser() {
    loading.value = true;
    try {
      currentUser.value = await getCurrentUser();
    } catch {
      currentUser.value = null;
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  }

  async function logout() {
    await apiLogout();
    currentUser.value = null;
  }

  const isAuthenticated = computed(() => !!currentUser.value);
  const isCreator = computed(() => currentUser.value?.role === "creator");

  return {
    currentUser,
    loading,
    initialized,
    isAuthenticated,
    isCreator,
    fetchUser,
    logout,
  };
}
