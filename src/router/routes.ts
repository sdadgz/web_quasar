import {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{path: '', component: () => import('pages/blog/Blogs.vue')}]
  },

  {
    path: '/blog',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: ':username/blogs', component: () => import('pages/blog/Blogs.vue')},
      {path: ':username/blog/:title', component: () => import('pages/blog/Blog.vue')}
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: 'login', component: () => import('pages/user/Login.vue')},
      {path: ':username', component: () => import('pages/user/User.vue')}
    ],
  },
  {
    path: '/repository',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: ':username', component: () => import('pages/repository/Repository.vue')}
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: '/'
  },
];

export default routes;
