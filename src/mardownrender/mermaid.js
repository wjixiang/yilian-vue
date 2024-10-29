import { marked } from "marked";


const renderer = {
    code(code) {
        if (code.lang === "mermaid") {
            return `<div class='mermaid'>${code.svg.svg}</div>`

        }else if(code.lang=="ad-note"){
            return `<div class='ad-note'>
            ${code.text}
            <div>`
        }
    }
  };
  
marked.use({ renderer });