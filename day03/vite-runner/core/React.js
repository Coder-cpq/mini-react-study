let root = null
function render(el,container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    root = nextWorkOfUnit
    // // 创建元素
    // const dom = el.type==='TEXT_ELEMENT'
    // ? document.createTextNode('')
    // : document.createElement(el.type)
    // // 设置props
    // Object.keys(el.props).forEach(key=>{
    //     if(key!=='children'){
    //         dom[key] = el.props[key]
    //     }
    // })
    // const children = el.props.children
    // children.forEach(child=>{
    //     render(child,dom)
    // })

    // container.append(dom)
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
                const isTextNode = typeof child==='string'||typeof child==='number'
                return isTextNode?createTextNode(child):child
            })
        }
    }
}

let nextWorkOfUnit = null
function workLoop(deadline){
    let shoudYield = false
    while(!shoudYield && nextWorkOfUnit){
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shoudYield = deadline.timeRemaining()<1
    }
    // 全部处理完
    if(!nextWorkOfUnit&&root){
        commitRoot()
    }
    requestIdleCallback(workLoop)
}
function commitRoot(){
    commitWork(root.child)
    root = null
}
function commitWork(fiber){
    if(!fiber) return
    let fiberParent = fiber.parent
    while(!fiberParent.dom){
        fiberParent = fiberParent.parent
    }
    if(fiber.dom){
      fiberParent.dom.append(fiber.dom)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}
function createDom(type){
    console.log(type, 'type')
    return type==='TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
}
function updateProps(dom, props){
    Object.keys(props).forEach(key=>{
        if(key!=='children'){
            dom[key] = props[key]
        }
    })
}
function initChildren(fiber, children){
    let prevChild = null
    children.forEach((child, index)=>{
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            parent: fiber,
            sibling: null,
            dom: null
        }
        if(index===0){
            fiber.child = newFiber
        }else{
            prevChild.sibling = newFiber
        }
        prevChild = newFiber
    })
}
function updateFunctionComponent(fiber){
    const children = [fiber.type(fiber.props)]
    initChildren(fiber, children)
}
function updateHostComponent(fiber){
    if(!fiber.dom){
        // 1.创建dom
        const dom = (fiber.dom = createDom(fiber.type))
        // fiber.parent.dom.append(dom)
        // 2.处理props
        updateProps(dom, fiber.props)
    }
    const children = fiber.props.children
    initChildren(fiber, children)
}
function performWorkOfUnit(fiber){
    const isFunctionComponent = typeof fiber.type === 'function'
    console.log(isFunctionComponent, fiber.type)
    if(isFunctionComponent){
        updateFunctionComponent(fiber)
    }else{
        updateHostComponent(fiber)
    }
    
   
    // 3.转换链表
    
    // 4.返回下一个执行
    if(fiber.child){
        return fiber.child
    }
    // if(fiber.sibling){
    //     return fiber.sibling
    // }
    let nextFiber = fiber
    while(nextFiber){
        if(nextFiber.sibling) return nextFiber.sibling;
        nextFiber = nextFiber.parent
    }
    // return fiber.parent.sibling
}

requestIdleCallback(workLoop)

const React = {
    render,
    createElement
}

export default React