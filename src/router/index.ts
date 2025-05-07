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
    path: "/food-contribution",
      name: "food-contribution",
      component: FoodContributionView
    },
    {
      path: "/food-contribution/create",
      name: "food-contribution-create",
      component: FoodContributionCreateView
    },
    {
      path: "/food-contribution/:id/edit",
      name: "food-contribution-edit",
      component: FoodContributionEditView
    },
    {
      path: "/food-contribution/report",
      name: "food-contribution-report",
      component: FoodContributionReportView
    },
    {
      path: "/child-contribution",
      name: "child-contribution",
      component: ChildContributionView
    },
    {
      path: "/child-contribution/create",
      name: "child-contribution-create",
      component: ChildContributionCreateView
    },
    {
      path: "/child-contribution/:id/edit",
      name: "child-contribution-edit",
      component: ChildContributionEditView
    },
    {
      path: "/child-contribution/report",
      name: "child-contribution-report",
      component: ChildContributionReportView
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

export default router;
