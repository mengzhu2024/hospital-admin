// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
import menu from './menu'

/**
 * 基础菜单
 */
// 启用路由
Vue.use(Router);

const routers = [{
    path: '/',
    name: '',
    component: login,
    hidden: true
}, {
    path: '/login',
    name: '登录',
    component: login,
    hidden: true
}, {
    path: '/index',
    name: '首页',
    component: index
}
]
routers[2].children = menu.menus
// 导出路由
export default new Router({
    routes: routers
})
