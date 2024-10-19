<script setup>
import { defineProps, watch } from 'vue';
import axios from 'axios';
import {load_doc} from '@/loadDoc';
import { ref,computed } from 'vue';
import { marked } from 'marked';  
import { mapState,mapActions,useStore} from 'vuex';

const props = defineProps({
    DBID: {
        type: String,
        Required: true
    }
})

const data = ref(await load_doc(props.DBID))


watch(
    ()=>props.DBID,
    async (newVal)=>{
        data.value = await load_doc(newVal)
    },
    {
        immediate:true
    }
)


const renderedMarkdown = computed(() => {  
      return marked(data.value.history[0].content);  
});

const store = useStore()
const openInteralLink=async (event)=>{
    if (event.target.tagName === 'A') {  
        const linktitle =  event.target.getAttribute('linktitle');
        
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
    <div class="document h-full">
        <div class="content px-5">
            <div v-html="renderedMarkdown" @click="openInteralLink"></div>
        </div>
    </div>
</template>

<style scoped>
.custom-list {  
    margin-left: 20px; /* 自定义列表样式 */  
  }  
</style>