import Main from '@/components/main'
import parentView from '@/components/parent-view'


export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },

  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      //hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          //hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },

  {
    path: '/category',
    name: '业务中心',
    meta: {
      icon: 'md-cloud-upload',
      title: '业务中心'
    },
    component: Main,
    children: [
      {
        path: 'data_center',
        name: 'data_center',
        meta: {
          icon: 'md-podium',
          title: 'data_center',
          showAlways: true
        },
        component: parentView,
        children: [
          {
            path: '产品类型',
            name: '产品类型',
            meta: {
              icon: 'ios-home',
              title: '产品类型'
            },
            component: () => import('@/view/projects/category/idcs.vue')
          },
          {
            path: 'region', // 必须项
            name: '地域管理', // 必须项，后面缓存页面需要用到，且这个name是唯一的
            meta: {
              title: '地域',
              icon: 'ios-globe',
              //hideInMenu: true // 是否在左侧菜单中隐藏，默认为false
            },
            component: () => import('@/view/projects/category/region.vue')
          },
          {
            path: '业务类型',
            name: '业务类型',
            meta: {
              icon: 'ios-cart',
              title: '业务类型'
            },
            component: () => import('@/view/projects/category/racks.vue')
          },

          {
            path: 'servers',
            name: 'servers',
            meta: {
              icon: 'logo-tux',
              title: 'servers'
            },
            component: () => import('@/view/projects/category/servers.vue')
          },
          {
            path: '/category/servers/:id',
            name: 'server_detail',
            meta: {
              hideInMenu: true,
              icon: 'ios-document',
              title: 'server_detail'
            },
            component: () => import('@/view/projects/category/server_detail.vue')
          },
          {
            path: 'sshusers',
            name: 'sshusers',
            meta: {
              icon: 'ios-person',
              title: 'sshusers'
            },
            component: () => import('@/view/projects/category/sshusers.vue')
          }

        ]
      },
      {
        path: 'business_info',
        name: 'business_info',
        meta: {
          icon: 'ios-globe',
          title: 'business_info',
          showAlways: true
        },
        component: parentView,
        children: [
          {
            path: 'businesslines',
            name: 'businesslines',
            meta: {
              icon: 'ios-git-network',
              title: 'businesslines'
            },
            component: () => import('@/view/projects/category/businesslines.vue')
          },
          {
            path: 'projects',
            name: 'projects',
            meta: {
              icon: 'ios-cube',
              title: 'projects'
            },
            component: () => import('@/view/projects/category/projects.vue')
          },
          {
            path: '/category/projects/:id',
            name: 'project_detail',
            meta: {
              hideInMenu: true,
              icon: 'ios-document',
              title: 'project_detail'
            },
            component: () => import('@/view/projects/category/project_detail.vue')
          },
          {
            path: '/category/webssh/:server_id/:user_id',
            name: 'webssh_detail',
            meta: {
              hideInMenu: true,
              icon: 'ios-document',
              title: 'webssh_detail'
            },
            component: () => import('@/view/projects/category/webssh_detail.vue')
          },
          
          /* 其他路由 */

        ]
      }

    ]
  },

  {
    path: '/account',
    name: 'account',
    meta: {
      icon: 'md-person',
      title: 'account'
    },
    component: Main,
    children: [
      {
        path: 'users',
        name: 'users',
        meta: {
          icon: 'ios-person',
          title: 'users'
        },
        component: () => import('@/view/projects/account/users.vue')
      },
      {
        path: 'groups',
        name: 'groups',
        meta: {
          icon: 'ios-people',
          title: 'groups'
        },
        component: () => import('@/view/projects/account/groups.vue')
      }
    ]
  },



]
