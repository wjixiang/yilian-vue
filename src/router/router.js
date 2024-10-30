import { createRouter,createWebHistory } from "vue-router";
import doc from "@/components/doc.vue";

const routes = [
    {  
        path: '/',  
        redirect: '/wiki/670e3bfb7f4b0b1583fc4697' // 重定向  
    },
    {
        path: '/wiki/:DBID',
        name: 'Wiki',
        component: doc,
    }
]

const router = createRouter({  
    history: createWebHistory(),  
    routes,  
  });  
  
export default router;  