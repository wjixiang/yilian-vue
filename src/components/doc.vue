<script setup>
import { defineProps, watch } from 'vue';
import axios from 'axios';
import {load_doc} from '@/loadDoc';
import { ref,computed,onMounted } from 'vue';
import { marked } from 'marked';  
import { mapState,mapActions,useStore} from 'vuex';
import mermaid from "mermaid";

mermaid.initialize({startOnLoad:false})
 
const props = defineProps({
    DBID: {
        type: String,
        Required: true
    }
})

const data = ref(await load_doc(props.DBID))
const rmd = ref(null)
const docdv = ref(null)


watch(
    ()=>props.DBID,
    async (newVal)=>{
        data.value = await load_doc(newVal)
        rmd.value = await marked.parse(data.value.history[0].content) 
        
    },
    {
        immediate:true
    }
)

const title = computed(()=>{
    return (data.value.history[0].title)
})

const renderedMarkdown = computed(() => {  
      return rmd.value
})

const store = useStore()
const openInteralLink=async (event)=>{
    if (event.target.tagName === 'A') {  
        const linktitle =  event.target.getAttribute('linktitle');
        console.log(linktitle)
        // 执行其他逻辑  
        // console.log(linktitle)
        axios.get(import.meta.env.VITE_API_URL+"/api/titletodbid/"+encodeURIComponent(linktitle))
        .then((res)=>{
            if(res.data.status==200){
                const DBID = res.data.res._id
                store.dispatch('updateDBID', DBID);
            }else{
                console.log(res.data.status)
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        // console.log(data)
        // 阻止默认行为  
        event.preventDefault();  
      }  
}


</script>

<template>
    <div class="document h-full overflow-auto">
        <div class="p-5 font-bold text-4xl text-blue-700">
            {{title}}
        </div>
        <div class="content px-5">
            <div v-html="renderedMarkdown" @click="openInteralLink" ref="docdv"></div>
        </div>
    </div>
</template>

<style scoped>
.custom-list {  
    margin-left: 20px; /* 自定义列表样式 */  
  }  
</style>