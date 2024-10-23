import { marked } from "marked";
import client from "./axios"
import axios from "axios";
import {load_doc} from '@/loadDoc';


const internalLink = {  
    name: 'internalLink',  
    level: 'inline', // 指定为行内扩展  
    start(src) {  
        // const link = src.indexOf('[[')
        // const embed = src.indexOf('![[')
        return src.indexOf(/\[\[/); // 查找 [[ 的位置  
    },  
    tokenizer(src) {  
        const rule = /^(?<!\!)\[\[(.+?)\]\]/; // 正则表达式匹配 [[链接]]  
        // console.log(src)
        const match = rule.exec(src);  
        if (match) {  
            return {  
                type: 'internalLink',  
                raw: match[0],  
                href: match[1], // 提取链接文本  
                dbid: '',
            };  
        }  
        return false; // 返回 false 使用默认处理  
    },  
    renderer(token) {  
        // console.log(token.type)
        return `<a class="internal-link" href="#" linktitle="${token.href}" dbid="${token.dbid}">${token.href}</a>`; // 渲染为 <a> 元素  
    }  
};

const embed = {
    name: 'embed',
    level: 'inline',
    start(src){
        return src.indexOf('![');
    },
    tokenizer(src) {  
        const rule = /^!\[\[(.+?)\]\]/; // 正则表达式匹配 [[链接]]  
        const match = rule.exec(src);  
        if (match) {  
            //提取后缀对embed进行分类
            const suffix = match[1].match(/\.([^.]+)$/)
            console.log(suffix)
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
        const rule = /^> \[!PDF\|note\][^\n]+\n(>[^\n]+\n)+/;; 
        const match = rule.exec(src);
        // console.log(match)
        if(match){
            return{
                type: 'callout',  
                raw: match[0],  
                text: match[1], // 提取链接文本  
            }
        }
    },
    renderer(token){
        const contentList = token.raw.split('\n> ')
        const title = contentList[0].replace('> [!PDF|note] ','')
        console.log(contentList)
        return  `<div class='pdf-quote'>
            <div class='quote-title'${marked.parseInline(title)}</div>
            ${contentList[1]}
        </div>`
    }
}

const walkTokens = async(token)=> {
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

const renderer = {
    internalLink({token}){
        console.log(token)

    }
}

export default marked.use({
    // tokenizer,
    extensions:[callout,embed,internalLink,],
    // renderer,
    async:true,
    walkTokens,
})