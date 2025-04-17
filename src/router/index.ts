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
import LeadershipView from "@/views/LeadershipView.vue";
import LeadershipCreateView from "@/views/inputs/LeadershipCreateView.vue";
import LeadershipEditView from "@/views/inputs/LeadershipEditView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/campaign",
      name: "campaign",
      component: CampaignView
    },
    {
        path: "/campaign/create",
        name: "campaign-create",
        component: CampaignCreateView
    },
    {
        path: "/campaign/:id/edit",
        name: "campaign-edit",
        component: CampaignEditView
    },
    {
      path: "/neighborhood",
      name: "neighborhood",
      component: NeighborhoodView,
    },
    {
        path: "/neighborhood/create",
        name: "neighborhood-create",
        component: NeighborhoodCreateView,
    },
    {
        path: "/neighborhood/:id/edit",
        name: "neighborhood-edit",
        component: NeighborhoodEditView,
    },
    {
      path: "/sponsor",
      name: "sponsor",
      component: SponsorView,
    },
    {
      path: "/sponsor/create",
      name: "sponsor-create",
      component: SponsorCreateView,
    },
    {
      path: "/sponsor/:id/edit",
      name: "sponsor-edit",
      component: SponsorEditView,
    },
    {
      path: "/family",
      name: "family",
      component: FamilyView
    },
    {
      path: "/family/create",
      name: "family-create",
      component: FamilyCreateView
    },
    {
      path: "/family/:id/edit",
      name: "family-edit",
      component: FamilyEditView
    },
    {
      path: "/leader",
      name: "leader",
      component: LeadershipView,
    },
    {
      path: "/leader/create",
      name: "leader-create",
      component: LeadershipCreateView,
    },
    {
      path: "/leader/:id/edit",
      name: "leader-edit",
      component: LeadershipEditView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
