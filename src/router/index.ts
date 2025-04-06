import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NeighborhoodView from "../views/NeighborhoodView.vue";
import NeighborhoodCreateView from "./../views/inputs/NeighborhoodCreateView.vue";
import NeighborhoodEditView from "@/views/inputs/NeighborhoodEditView.vue";
import CampaignView from "@/views/CampaignView.vue";
import CampaignCreateView from "@/views/inputs/CampaignCreateView.vue";
import CampaignEditView from "@/views/inputs/CampaignEditView.vue";
import ChildView from '@/views/ChildView.vue';
import ChildCreateView from '@/views/inputs/ChildCreateView.vue';
import ChildEditView from '@/views/inputs/ChildEditView.vue';

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
      path: "/child",
      name: "child",
      component: ChildView,
    },
    {
      path: "/child/create",
      name: "child-create",
      component: ChildCreateView,
    },
    {
      path: "/child/:id/edit",
      name: "child-edit",
      component: ChildEditView,
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
