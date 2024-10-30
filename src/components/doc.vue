<script setup>  
import { ref, computed, watch, onMounted } from 'vue';  
import axios from 'axios';  
import { load_doc } from '@/loadDoc';  
import { marked } from 'marked';  
import { useRouter, useRoute } from 'vue-router';  
import mermaid from "mermaid";  


mermaid.initialize({ startOnLoad: false });  

const route = useRoute();  
const router = useRouter();  

const data = ref(null);  
const rmd = ref(null);  
const loading = ref(true); // 添加加载状态  

const loadData = async (DBID) => {  
    loading.value = true; // 开始加载  
    try {  
        data.value = await load_doc(DBID); // 加载新的文档  
        console.log(data.value)
        rmd.value = await marked.parse(data.value.history[0].content); // 解析新的文档内容  
    } catch (error) {  
        console.error('Error loading document:', error);  
    } finally {  
        loading.value = false; // 加载完成  
    }  
};  

onMounted(async () => {  
    console.log(route.params.DBID)
    await loadData(route.params.DBID); // 加载初始文档  
});  

// 监听路由参数变化  
watch(  
    () => route.params.DBID, // 监听路由参数变化  
    async (newId) => {  
        if (newId) {  
            await loadData(newId); // 加载新的文档  
        }  
    },  
    { immediate: true }  
);  

// 计算属性 - 获取标题  
const title = computed(() => {  
    return data.value ? data.value.history[0].title : ''; // 确保在数据加载后返回标题  
});  

// 计算属性 - 渲染的Markdown  
const renderedMarkdown = computed(() => {  
    return rmd.value;  
});  

const openInteralLink = async (event) => {  
    if (event.target.tagName === 'A') {  
        const linktitle = event.target.getAttribute('linktitle');  
        axios.get(import.meta.env.VITE_API_URL + "/api/titletodbid/" + encodeURIComponent(linktitle))  
            .then((res) => {  
                if (res.data.status == 200) {  
                    const DBID = res.data.res._id;  
                    router.push({ path: `/wiki/${DBID}` }); // 使用新的路由  
                } else {  
                    console.log(res.data.status);  
                }  
            })  
            .catch((error) => {  
                console.log(error);  
            });  
        event.preventDefault(); // 阻止默认行为  
    }  
};  
</script>  

<template>  
    <div class="document h-full overflow-auto">  
        <div class="p-5 font-bold text-4xl text-blue-700">  
            {{ title }} <!-- 确保 title 已定义并有效 -->  
        </div>  
        <div class="content px-5">  
            <div v-if="loading">Loading...</div> <!-- 显示加载指示器 -->  
            <div v-else v-html="renderedMarkdown" @click="openInteralLink" ref="docdv"></div>  
        </div>  
    </div>  
</template>  

<style scoped>  
.custom-list {  
    margin-left: 20px; /* 自定义列表样式 */  
}  
</style>