import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from './login/Login.vue'
import User from './user/user.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: () => import("./Home.vue"),
    name: '入口',
    hidden: true,
    //redirect: 'user',
    iconCls: 'fa fa-id-card-o',
    /*children: [
      {path: '/page4', component: Page4, name: '页面4'},
      {path: '/page5', component: Page5, name: '页面5'}
    ]*/
  }, {
    path: '/login',
    name: 'login',
    component: Login,
    hidden: true
  }, {
    path: '/user',
    name: 'user',
    component: User,
    leaf: true,//只有一个节点
    iconCls: 'fa fa-user'
  }
  ]
})
