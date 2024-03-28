/**@jsx CReact.createElement */
import CReact from "./core/React.js"
// const App = React.createElement('div', {id: 'app'}, '999', 'react')

let showBar = false
function AppOne(){
    // function handleClick(){
    //     showBar = !showBar
    //     console.log(showBar)
    //     CReact.update()
    // }
    // function Foo(){
    //     return <div>foo</div>
    // }
    // const foo = (<div>
    //     foo
    //     <div>child</div>
    //     <div>child1</div>
    // </div>)
    // const bar = <div>bar</div>
    
    return (
        <div>
            999-mini-react66
            {/* <div></div> */}
            {/* <button onClick={handleClick}>showBar</button>
            {showBar&&bar} */}
        </div>
    )
}
let countFoo = 1
    function Foo() {
        const update = CReact.update()
        function handleClick(){
            countFoo++
            update()
        }
        return (
            <div>
                <h1>foo</h1>
                {countFoo}
                <button onClick={handleClick}>click</button>
            </div>
        )
    }
    let countBar = 1
    function Bar() {
        const update = CReact.update()
        function handleClick(){
            countBar++
            update()
        }
        return (
            <div>
                <h1>foo</h1>
                {countBar}
                <button onClick={handleClick}>click</button>
            </div>
        )
    }
const App = function(){
    return (<div>999-mini-react
             <Foo></Foo>
            <Bar></Bar>
        </div>)
}
export default App