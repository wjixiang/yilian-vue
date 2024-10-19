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

const renderer = {  
    list(token) {  //解析ol-ul
        const isOrdered = token.ordered; // 判断是否为有序列表  
        const listClass = 'list'; // 自定义类名  
        const listTag = isOrdered ? 'ol' : 'ul'; // 根据类型选择标签  
        // 使用 token.items 生成列表项，并在每项中调用 this.listitem  
        try{
            return  `<${listTag} class="${listClass+"-"+listTag}">${token.items.map((item) => {
                // console.log("normal",item)
                return this.listitem(item)
            }).join('')}</${listTag}>`
        }catch(error){
            console.log(error)
        }
    },  
    listitem(token) {  
        const itemClass = 'list-item'; // 自定义类名 

        if(token.tokens[1]!=undefined){//存在嵌套
            // console.log(token) 
            return `<li class="${itemClass}">
                    ${marked.parseInline(token.tokens[0].text)}
                    ${this.list(token.tokens[1])}
                </li>`
        }else{//不存在嵌套
            return `<li class="${itemClass}">${marked.parseInline(token.text)}</li>`;  
        }
    },
    link(token){
        const linkClass = 'internal-link'
        return `<a class="${linkClass}" herf="#" linktitle="${token.text}">${token.text}</a>`
    }
};   

const tokenizer = {
    link(src){
        const match = src.match(/\[\[.*?\]\]/g);
        if(match){
            return {
                type: 'link',
                raw: match[0],
                text: match[0].replace('[[','').replace(']]','')

            }
        }
    }
}

marked.use({renderer,tokenizer})

const renderedMarkdown = computed(() => {  
        // console.log( marked.parse(data.value.history[0].content))
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
            const DBID = res.data._id
            store.dispatch('updateDBID', DBID);
        })
        .catch((error)=>{
            console.log(error)
        })
        console.log(data)
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