import Home from '@/views/Home.vue'
import { createWebHistory } from 'vue-router'
import { createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/information',
        name: 'Information',
        component: () => import('../views/Information.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router