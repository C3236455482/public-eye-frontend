import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '../components/HomePage.vue';  // 假设你有一个 App 组件
import EventTimeline from '../components/EventTimeline.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',  // 使用 HTML5 History 模式
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage
        },
        // 更多路由可以在这里添加
        {
            path: '/EventTimeline',
            name: 'EventTimeline',
            component: EventTimeline,
            props: true
        }
    ]
});
