import { marked } from "marked";
import client from "./axios"

const tokenizer = {
    link(src){
        const match = src.match(/^\[\[.*?\]\]/);
        if(match){
            // console.log(match.input)
            const innerText = match[0].replace('[[','').replace(']]','')

            return {
                type: 'link',
                raw: match[0],
                text: innerText,
                around: match.input.split(match[0])

            }
        }
    }
}

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

export default marked.use({tokenizer,renderer})