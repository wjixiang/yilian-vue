import { marked } from "marked";
import client from "./axios"
import axios from "axios";

// const renderer = {  
//     list(token) {  //解析ol-ul
//         const isOrdered = token.ordered; // 判断是否为有序列表  
//         const listClass = 'list'; // 自定义类名  
//         const listTag = isOrdered ? 'ol' : 'ul'; // 根据类型选择标签  
//         // 使用 token.items 生成列表项，并在每项中调用 this.listitem  
//         try{
//             return  `<${listTag} class="${listClass+"-"+listTag}">${token.items.map((item) => {
//                 // console.log("normal",item)
//                 return this.listitem(item)
//             }).join('')}</${listTag}>`
//         }catch(error){
//             console.log(error)
//         }
//     },  
//     listitem(token) {  
//         const itemClass = 'list-item'; // 自定义类名 
        
//         if(token.tokens[1]!=undefined){//存在嵌套
//             // console.log(token) 
//             return `<li class="${itemClass}">
//                     ${marked.parseInline(token.tokens[0].text)}
//                     ${this.list(token.tokens[1])}
//                 </li>`
//         }else{//不存在嵌套
//             return `<li class="${itemClass}">${marked.parseInline(token.text)}</li>`;  
//         }
//     },
// };   

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
            };  
        }  
        return false; // 返回 false 使用默认处理  
    },  
    renderer(token) {  
        return `<a class="internal-link" href="#" linktitle="${token.href}">${token.href}</a>`; // 渲染为 <a> 元素  
    }  
};

export default marked.use({
    // tokenizer,
    extensions:[internalLink],
    // renderer,
    async:true,
})