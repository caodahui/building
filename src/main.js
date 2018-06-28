import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
// import Mock from './mock'
import 'font-awesome/css/font-awesome.min.css'
import './axios'
// Mock.bootstrap();

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path === '/login') {
        Vue.prototype.axios.post('/user/loginout', {guid: sessionStorage.getItem('guid')}).then((result) => {
            sessionStorage.removeItem('guid');
            next({path: '/login'});
        })
    }
    let user = sessionStorage.getItem('guid');
    if (!user && to.path !== '/login') {
        next({path: '/login'})
    } else {
        next()
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

