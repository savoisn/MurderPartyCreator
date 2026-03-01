import { createRouter, createWebHistory } from "vue-router";
import ScenarioList from "../views/ScenarioList.vue";
import ScenarioCreate from "../views/ScenarioCreate.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/scenarios", component: ScenarioList },
    { path: "/scenarios/new", component: ScenarioCreate },
  ],
});

export default router;
