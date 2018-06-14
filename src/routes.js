import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Table from './views/nav1/Table.vue'
import user from './views/nav1/user.vue'
import Form from './views/nav1/Form.vue'

let routes = [
    {
        path: '/',
        component: Home,
        name: 'home',
        iconCls: 'el-icon-message',//图标样式class
        redirect: {path: '/user'},
        children: [
            {path: '/user', component: Table, name: '用户管理', iconClass: "fa fa-user-circle-o"},
            {
                path: '/project',
                component: () => import("./views/nav1/project.vue"),
                name: '项目管理',
                iconClass: "fa fa-building"
            },
            {
                path: '/transfer-record',
                component: () => import('./views/nav1/user.vue'),
                name: '进出记录',
                iconClass: "fa fa-exchange"
            },
            {path: '/checkWork', component: user, name: '考勤报表', iconClass: "fa fa-calendar-check-o"},
            {path: '/workTime', component: Form, name: '工时报表', iconClass: "fa fa-times-rectangle-o"},
            {path: '/staffList', component: user, name: '员工列表', iconClass: "fa fa-users"},
        ]
    }, {
        path: '/login',
        component: Login,
        name: 'login',
        hidden: true
    }, {
        path: '/404',
        component: NotFound,
        name: 'NotFound',
        hidden: true
    }, {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;