export const internalLink = {  
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