import { marked } from "marked";
import markedKatex from "marked-katex-extension";

import axios from "axios";
import {load_doc} from '@/loadDoc';

import { internalLink } from "./internallink";
import mermaid from "mermaid";




const embed = {
    name: 'embed',
    level: 'inline',
    start(src){
        return src.indexOf('![');
    },
    tokenizer(src) {  
        const rule = /^!\[\[(.+?)\]\]/; // 正则表达式匹配 [[链接]]  
        const match = rule.exec(src);  
        // console.log(match)
        if (match) {  
            //提取后缀对embed进行分类
            const suffix = match[1].match(/\.([^.]+)$/)
            // console.log(suffix)
            if(suffix==null){//embed md
                return {  
                    type: 'embed',  
                    mode: 'md',
                    raw: match[0],  
                    href: match[1], // 提取链接文本  
                    dbid:'',
                    embed_content: '',
                };  
            }else if(['png','jpg','svg'].includes(suffix[1])){
                return{
                    type: 'embed',  
                    mode: 'img',
                    raw: match[0],  
                    href: match[1], // 提取链接文本  
                    dbid:'',
                    embed_content: '',
                }
            }
        }  
        return false; // 返回 false 使用默认处理  
    },  
    renderer(token) {  
        //${marked.parse(token.embed_content)}
        // console.log(token.type)
        if(token.mode=='md'){
            if(token.dbid!=null){
                return `<div class="embed">
                ${token.embed_content}
                </div>`;  
            }else{
                return `<div class="embed-inactivated">
                    <p>卡片暂未创建</p>
                </div>`;  
            }
        }else if(token.mode=='img'){
            return `<img src="${import.meta.env.VITE_API_URL+"/api/img/"+encodeURIComponent(token.href)}"></img>`
        }else if(token.mode=='latex_block'){
            console.log(token.text)
            return `<p>这是个latex</p>`
        }
    }
}

const callout = {
    name: 'callout',
    level: 'block',
    start(src){
        return src.indexOf('> \[\!PDF\|');
    },
    tokenizer(src){
        const rule = /^> \[!PDF\|\w+\][^\n]+\n(>[^\n]+\n)+/;// /\$\$(.*?)\$\$/
        const match = rule.exec(src);
        // console.log(match)
        if(match){
            const contentList = match[0].split('\n> ')
            return{
                type: 'callout',  
                raw: match[0],  
                contentList:contentList,
                title:contentList[0].replace('> [!PDF|note] ',''),
                content:''
            }
        }
    },
    renderer(token){
        return  `<div class='pdf-quote'>
            <div class='quote-title'${token.title}</div>
            ${token.content}
        </div>`
    }
}


const walkTokens = async(token)=> {
    if (token.type==='code'){
        if(token.lang=='mermaid'){
            token.svg = await mermaid.render('mermaid',token.text)
            console.log(token.svg)
        }
        // console.log(token)
    }

    if (token.type==='callout'){
        token.title= await marked.parse(token.title)
        token.content = await marked.parse(token.contentList[1])
    }

    if (token.type === 'internalLink') {
        const DBID = await axios.get(import.meta.env.VITE_API_URL+"/api/titletodbid/"+encodeURIComponent(token.href))
            .then((res)=>{
                if(res.data.status==200){
                    // console.log(res.data.res._id)
                    return  res.data.res._id
                }else{
                    return null
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        token.dbid = DBID
    }

    if(token.type==='embed'){
        if(token.mode=='md'){
            token.dbid = await axios.get(import.meta.env.VITE_API_URL+"/api/titletodbid/"+encodeURIComponent(token.href))
            .then((res)=>{
                if(res.data.status==200){
                    // console.log(res.data.res._id)
                    return  res.data.res._id
                }else{
                    return null
                }
            })
            .catch((error)=>{
                console.log(error)
                return null;
            })
    
            if (token.dbid!=null ){
                const file = await load_doc(token.dbid)
                token.embed_content = await marked.parse(file.history[0].content)
                // console.log(token.embed_content)
            }
        }
    }
}

const options = {
    throwOnError: false,
    output:'mathml'
  };

marked.use(markedKatex(options))

export default marked.use({
    extensions:[callout,embed,internalLink],
    // renderer,
    async:true,
    walkTokens,
})

// console.log(marked.parse("$$e = mc^2$$"))