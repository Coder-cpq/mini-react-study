function render(el,container) {
    // 创建元素
    const dom = el.type==='TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(el.type)
    // 设置props
    Object.keys(el.props).forEach(key=>{
        if(key!=='children'){
            dom[key] = el.props[key]
        }
    })
    const children = el.props.children
    children.forEach(child=>{
        render(child,dom)
    })

    container.append(dom)
}
function createTextNode(text){
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}
function createElement(type, props, ...children){
    return {
        type,
        props: {
            ...props,
            children: children.map(child=>{
                return typeof child==='string'?createTextNode(child):child
            })
        }
    }
}

const React = {
    render,
    createElement
}

export default React