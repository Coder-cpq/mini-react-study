/**@jsx CReact.createElement */
import CReact from "./core/React.js"
// const App = React.createElement('div', {id: 'app'}, '999', 'react')
function AppOne({num}){
    return <div>999-mini-react66-num{num}</div>
}
const App = function(){
    return (<div>999-mini-react<AppOne num={1000}></AppOne><AppOne num={9999}></AppOne></div>)
}
export default App