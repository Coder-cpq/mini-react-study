// v1
// // 父元素容器
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').append(dom)
// // 文本元素
// const textNode = document.createTextNode('')
// textNode.nodeValue = 'app'
// dom.append(textNode)

// react vdom js object
// const textEl = {
//     type: 'TEXT_ELEMENT',
//     props: {
//         nodeValue: 'app',
//         children: []
//     }
// }
// function createTextNode(text){
//     return {
//         type: 'TEXT_ELEMENT',
//         props: {
//             nodeValue: text,
//             children: []
//         }
//     }
// }
// function createElement(type, props, ...children){
//     return {
//         type,
//         props: {
//             ...props,
//             children: children.map(child=>{
//                 return typeof child==='string'?createTextNode(child):child
//             })
//         }
//     }
// }
// const el = {
//     type: 'div',
//     props: {
//         id: 'app',
//         children: [
//             textEl
//         //     {
//         //     type: 'TEXT_ELEMENT',
//         //     props: {
//         //         nodeValue: 'app',
//         //         children: []
//         //     }
//         // }
//         ]
//     }
// }
// const textEl = createTextNode('app')
// const app = createElement('div', {id: 'app'}, textEl)
// // 父元素容器
// const dom = document.createElement(app.type)
// dom.id = app.props.id
// document.querySelector('#root').append(dom)
// // 文本元素
// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// 创建元素   设置props   父容器添加
// function render(el,container) {
//     // 创建元素
//     const dom = el.type==='TEXT_ELEMENT'
//     ? document.createTextNode('')
//     : document.createElement(el.type)
//     // 设置props
//     Object.keys(el.props).forEach(key=>{
//         if(key!=='children'){
//             dom[key] = el.props[key]
//         }
//     })
//     const children = el.props.children
//     children.forEach(child=>{
//         render(child,dom)
//     })

//     container.append(dom)
// }
// const textEl = createTextNode('app')
// const App = createElement('div', {id: 'app'}, textEl, '999')

// render(App, document.querySelector('#root'))

// const ReactDom = {
//     createRoot(container){
//         return {
//             render(App){
//                 render(App,container)
//             }
//         }
//     }
// }
import ReactDom from "./core/ReactDom.js"
// import React from "./core/React.js"
// const App = React.createElement('div', {id: 'app'}, '999', 'react')
import App from "./App.js"
ReactDom.createRoot(document.querySelector('#root')).render(App)