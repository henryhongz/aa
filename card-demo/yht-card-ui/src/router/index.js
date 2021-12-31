import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err);
// }

const routes = [
  {
    path: '/update',
    name: 'Update',
    component: () => import('../views/update')
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../components/TdtMap')
  },
  {
    path: '',
    name: 'MenuLayout',
    component: () => import('../layouts/MenuLayout'),
    children: [
      {
        path: ':projectId',
        name: 'Project',
        component: () => import('../views/project')
      },
      {
        path: ':projectId/:pageId',
        name: 'Page',
        component: () => import('../views/page')
      },
    ]
  },
]

const router = new VueRouter({
  mode: process.env.NODE_ENV === 'production' ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   if (from.query.parkId) to.query.parkId = from.query.parkId;
//   next()
// })


export default router
