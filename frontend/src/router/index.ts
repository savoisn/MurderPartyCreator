import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";
import Login from "../views/Login.vue";
import ScenarioList from "../views/ScenarioList.vue";
import ScenarioCreate from "../views/ScenarioCreate.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/scenarios" },
    { path: "/login", component: Login, meta: { public: true } },
    { path: "/scenarios", component: ScenarioList, meta: { requiresAuth: true } },
    {
      path: "/scenarios/new",
      component: ScenarioCreate,
      meta: { requiresAuth: true, requiresCreator: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const { fetchUser, initialized, isAuthenticated, isCreator } = useAuth();

  if (!initialized.value) {
    await fetchUser();
  }

  if (to.meta.public) return true;

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return "/login";
  }

  if (to.meta.requiresCreator && !isCreator.value) {
    return "/scenarios";
  }

  return true;
});

export default router;
