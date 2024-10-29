import TexParser from "mathjax-full/js/input/tex/TexParser";
import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from 'mathjax-full/js/input/tex.js';  
import { CHTML } from 'mathjax-full/js/output/chtml.js';  
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';  
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';  

// 创建适配器和注册处理器
const adaptor = liteAdaptor();  
RegisterHTMLHandler(adaptor);  

export const latexrender = (str)=>{
    const tex = new TeX();  
    const chtml = new CHTML({ fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2' });  
    
    // 创建MathJax文档
    const html = mathjax.document('', { InputJax: tex, OutputJax: chtml });  
    
    // 渲染LaTeX公式
    
    const node = html.convert(str, { display: true });  
    
    // 获取渲染后的HTML
    return adaptor.outerHTML(node);  
}


export const latex_block = {
    name: 'latex_block',
    level: 'inline',
    start(src){
        return src.indexOf('$$');
    },
    tokenizer(src){
        const rule = /\$\$(.*?)\$\$/; 
        const match = rule.exec(src);
        if(match){
            // console.log(src)
            console.log(match)
            return{
                type:'embed',
                mode:'latex_block',
                raw:match[0],
                text:match[1],
            }
        }
    },

    render(token){
        console.log(token.text)
        return latexrender(token.text)
    }
} 

export const latex_inline = {
    name: 'latex_inline',
    level: 'inline',
    start(src){
        return src.indexOf('$');
    },
    tokenizer(src){
        const rule = /\$(.+?)\$/; 
        const match = rule.exec(src);
        if(match){
            console.log(match)
            return{
                type:'latex-inline',
                // latex:match[1]
            }
        }
    },
    render(token){
        // return latexrender(token.latex)
    }
} 