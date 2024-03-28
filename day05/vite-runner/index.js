let taskId = 1
function workLoop(deadline){
    taskId++
    let shoudYield = false
    while(!shoudYield){
        console.log(`taskId:${taskId} run task`)
        shoudYield = deadline.timeRemaining()<1
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)