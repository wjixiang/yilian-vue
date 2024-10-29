import { createRouter,createWebHistory } from "vue-router";
import doc from "@/components/doc.vue";

const routes = [
    {
        path: '/document/:id',
        name: 'DocumentViewer',
        component: doc,
    }
]

const router = createRouter({  
    history: createWebHistory(),  
    routes,  
  });  
  
export default router;  