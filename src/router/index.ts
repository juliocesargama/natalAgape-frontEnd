import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NeighborhoodView from "../views/NeighborhoodView.vue";
import NeighborhoodCreateView from "./../views/inputs/NeighborhoodCreateView.vue";
import NeighborhoodEditView from "@/views/inputs/NeighborhoodEditView.vue";
import CampaignView from "@/views/CampaignView.vue";
import CampaignCreateView from "@/views/inputs/CampaignCreateView.vue";
import CampaignEditView from "@/views/inputs/CampaignEditView.vue";
import SponsorView from "@/views/SponsorView.vue";
import SponsorCreateView from "@/views/inputs/SponsorCreateView.vue";
import SponsorEditView from "@/views/inputs/SponsorEditView.vue";
import FamilyView from "@/views/FamilyView.vue";
import FamilyCreateView from "@/views/inputs/FamilyCreateView.vue";
import FamilyEditView from "@/views/inputs/FamilyEditView.vue";
import FoodContributionView from "@/views/FoodContributionView.vue";
import FoodContributionCreateView from "@/views/inputs/FoodContributionCreateView.vue";
import FoodContributionEditView from "@/views/inputs/FoodContributionEditView.vue";
import FoodContributionReportView from "@/views/reports/FoodContributionReportView.vue";
import LeadershipView from "@/views/LeadershipView.vue";
import LeadershipCreateView from "@/views/inputs/LeadershipCreateView.vue";
import LeadershipEditView from "@/views/inputs/LeaderShipEditView.vue";
import ChildContributionView from "@/views/ChildContributionView.vue";
import ChildContributionCreateView from "@/views/inputs/ChildContributionCreateView.vue";
import ChildContributionEditView from "@/views/inputs/ChildContributionEditView.vue";
import ChildContributionReportView from "@/views/reports/ChildContributionReportView.vue";
import LoginView from "@/views/LoginView.vue";
import { getUserRole } from '@/utils/auth.ts'; // Função para obter o papel do usuário


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true}
    },
    {
      path: "/campaign",
      name: "campaign",
      component: CampaignView,
      meta: { requiresAuth: true}
    },
    {
        path: "/campaign/create",
        name: "campaign-create",
        component: CampaignCreateView, 
        meta: { requiresAuth: true}
    },
    {
        path: "/campaign/:id/edit",
        name: "campaign-edit",
        component: CampaignEditView,
        meta: { requiresAuth: true}
    },
    {
      path: "/neighborhood",
      name: "neighborhood",
      component: NeighborhoodView, 
      meta: { requiresAuth: true}
    },
    {
        path: "/neighborhood/create",
        name: "neighborhood-create",
        component: NeighborhoodCreateView,
        meta: { requiresAuth: true}
    },
    {
        path: "/neighborhood/:id/edit",
        name: "neighborhood-edit",
        component: NeighborhoodEditView,
        meta: { requiresAuth: true}
    },
    {
      path: "/sponsor",
      name: "sponsor",
      component: SponsorView,
      meta: { requiresAuth: true}
    },
    {
      path: "/sponsor/create",
      name: "sponsor-create",
      component: SponsorCreateView,
      meta: { requiresAuth: true}
    },
    {
      path: "/sponsor/:id/edit",
      name: "sponsor-edit",
      component: SponsorEditView,
      meta: { requiresAuth: true}
    },
    {
      path: "/family",
      name: "family",
      component: FamilyView,
      meta: { requiresAuth: true}
    },
    {
      path: "/family/create",
      name: "family-create",
      component: FamilyCreateView,
      meta: { requiresAuth: true}
    },
    {
      path: "/family/:id/edit",
      name: "family-edit",
      component: FamilyEditView,
      meta: { requiresAuth: true}
    },
    {
      path: "/leader",
      name: "leader",
      component: LeadershipView,
      meta: { requiresAuth: true}
    },
    {
      path: "/leader/create",
      name: "leader-create",
      component: LeadershipCreateView,
      meta: { requiresAuth: true}
    },
    {
      path: "/leader/:id/edit",
      name: "leader-edit",
      component: LeadershipEditView,
      meta: { requiresAuth: true}
    },
    {  
    path: "/food-contribution",
      name: "food-contribution",
      component: FoodContributionView,
      meta: { requiresAuth: true}
    },
    {
      path: "/food-contribution/create",
      name: "food-contribution-create",
      component: FoodContributionCreateView,
      meta: { requiresAuth: true}
    },
    {
      path: "/food-contribution/:id/edit",
      name: "food-contribution-edit",
      component: FoodContributionEditView,
      meta: { requiresAuth: true}
    },
    {
      path: "/food-contribution/report",
      name: "food-contribution-report",
      component: FoodContributionReportView,
      meta: { requiresAuth: true}
    },
    {
      path: "/child-contribution",
      name: "child-contribution",
      component: ChildContributionView,
      meta: { requiresAuth: true}
    },
    {
      path: "/child-contribution/create",
      name: "child-contribution-create",
      component: ChildContributionCreateView,
      meta: { requiresAuth: true}
    },
    {
      path: "/child-contribution/:id/edit",
      name: "child-contribution-edit",
      component: ChildContributionEditView,
      meta: { requiresAuth: true}
    },
    {
      path: "/child-contribution/report",
      name: "child-contribution-report",
      component: ChildContributionReportView,
      meta: { requiresAuth: true}
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
  ],
});

// Guarda de rota global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwtToken'); // Verifica se o token existe
  const userRole = getUserRole(); // Obtém o papel do usuário

  if (to.meta.requiresAuth && !token) {
    // Se a rota exigir autenticação e o token não existir, redireciona para o login
    return next('/');
  }

  if (to.meta.role && to.meta.role !== userRole) {
    // Se a rota exigir um papel específico e o usuário não tiver permissão, redireciona
    return next('/');
  }

  next(); // Permite o acesso à rota
});

export default router;
