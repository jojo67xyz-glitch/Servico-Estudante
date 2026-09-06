import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("../pages/LoginPage.vue")
      },
      {
        path: "descobrir",
        name: "matching",
        component: () => import("../pages/MatchingPage.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "chats",
        name: "chats",
        component: () => import("../pages/ChatsPage.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "agenda",
        name: "agenda",
        component: () => import("../pages/AgendaPage.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "perfil",
        name: "perfil",
        component: () => import("../pages/ProfilePage.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "chat/:id",
        name: "chat-detail",
        component: () => import("../pages/ChatDetailPage.vue"),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("../pages/[...path].vue")
  }
];

export default routes;
