import { marked } from "marked";
import client from "./axios"
import axios from "axios";


const internalLink = {  
    name: 'internalLink',  
    level: 'inline', // 指定为行内扩展  
    start(src) {  
        return src.indexOf('[['); // 查找 [[ 的位置  
    },  
    tokenizer(src) {  
        const rule = /^\[\[(.+?)\]\]/; // 正则表达式匹配 [[链接]]  
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
        console.log(token.dbid)
        return `<a class="internal-link" href="#" linktitle="${token.href} dbid="${token.dbid}">${token.href}</a>`; // 渲染为 <a> 元素  
    }  
};


const walkTokens = async(token)=> {
    if (token.type === 'internalLink') {
        const DBID = axios.get(import.meta.env.VITE_API_URL+"/api/titletodbid/"+encodeURIComponent(token.href))
            .then((res)=>{
                if(res.data.status==200){
                    console.log(res.data.res._id)
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
}

const renderer = {
    internalLink({token}){
        console.log(token)

    }
}

export default marked.use({
    // tokenizer,
    extensions:[internalLink],
    // renderer,
    async:true,
    walkTokens,
})