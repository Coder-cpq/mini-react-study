/**@jsx CReact.createElement */
import CReact from "./core/React.js"
// const App = React.createElement('div', {id: 'app'}, '999', 'react')
let count =10
function handleClick(){
    console.log('click')
    count++
    CReact.update()
}
function AppOne({num}){
    return <div onClick={handleClick}>999-mini-react66-num{num}</div>
}
const App = function(){
    return (<div onClick={handleClick}>999-mini-react
            <p>count: {count}</p>
        </div>)
}
export default App