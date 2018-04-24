import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
import Login from '@/views/Login'
import RoleList from '@/views/RoleList'
import UserList from '@/views/UserList'
import UserDetail from '@/views/UserDetail'
import ModifyPassword from '@/views/ModifyPassword'
import MenuList from '@/views/MenuList'
import MealList from '@/views/MealList'
import OrderList from '@/views/OrderList'

import store from '../store'
import { checkLogin } from '../http/user'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: { requireAuth: false }
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      meta: { requireAuth: true }
    },
    {
      path: '/roleList',
      name: 'RoleList',
      component: RoleList,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/userList',
      name: 'UserList',
      component: UserList,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: UserDetail,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/modifyPassword',
      name: 'ModifyPassword',
      component: ModifyPassword,
      meta: { requireAuth: true }
    },
    {
      path: '/menuList',
      name: 'MenuList',
      component: MenuList,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/mealList',
      name: 'MealList',
      component: MealList,
      meta: { requireAuth: true, requireAdmin: true }
    },
    {
      path: '/orderList',
      name: 'OrderList',
      component: OrderList,
      meta: { requireAuth: true, requireAdmin: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 如果需要拦截
    checkLogin()
      .then(res => {
        if (res.code !== 200) {
          next({
            path: '/',
            query: {
              redirect: to.fullPath
            }
          })
        } else {
          if (to.meta.requireAdmin && res.data.role_id !== 1) {
            next({
              path: '/main'
            })
          }
          next()
        }
      })
      .catch(err => {
        err.message && Message.error(err.message)
        next({
          path: '/',
          query: {
            redirect: to.fullPath
          }
        })
      })
  } else {
    next()
  }
})

export default router
