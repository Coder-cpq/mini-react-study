let wipRoot = null;
let currentRoot = null;
let wipFiber = null;
function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };
  nextWorkOfUnit = wipRoot;
}
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shoudYield = false;
  while (!shoudYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined;
    }
    shoudYield = deadline.timeRemaining() < 1;
  }
  // 全部处理完
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
let deletions = [];
function commitRoot() {
  console.log(deletions, "000000deletions");
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}
function commitDeletion(fiber) {
  console.log(fiber, "------");
  if (fiber.dom) {
    // 兼容函数组件
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}
function commitWork(fiber) {
  console.log(fiber, "fiber");
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
function createDom(type) {
  console.log(type, "type------");
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}
function updateProps(dom, nextProps, prevProps) {
  // 1、老有新没有
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        document.removeAttribute(key);
      }
    }
  });
  // 2、新有老没有
  // 3、老有新有
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLocaleLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          console.log(dom[key], key, nextProps[key], prevProps,'000000000000');
          dom[key] = nextProps[key];
        }
      }
    }
  });
}
function recncileChildren(fiber, children) {
  // 保存旧节点信息
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    console.log(children, child,'99999')
    // 判断元素类型是否相同
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber;
    if (isSameType) {
      // 更新操作
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) {
        console.log(oldFiber, "0000000");
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    if (newFiber) {
      prevChild = newFiber;
    }
  });
  // 删除多个子节点
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}
function updateFunctionComponent(fiber) {
  stateHooks = []
  stateHookIndex = 0
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];
  console.log(children, fiber.props, '90099999999')
  recncileChildren(fiber, children);
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1.创建dom
    const dom = (fiber.dom = createDom(fiber.type));
    // fiber.parent.dom.append(dom)
    // 2.处理props
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  recncileChildren(fiber, children);
}
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 3.转换链表

  // 4.返回下一个执行
  if (fiber.child) {
    return fiber.child;
  }
  // if(fiber.sibling){
  //     return fiber.sibling
  // }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  // return fiber.parent.sibling
}

requestIdleCallback(workLoop);
// 更新操作
function update() {
  // 新root
  let currentFiber = wipFiber;
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // wipRoot = {
    //   dom: currentRoot.dom,
    //   props: currentRoot.props,
    //   alternate: currentRoot,
    // };
    nextWorkOfUnit = wipRoot;
  };
}
let stateHooks;// 处理多个hook
let stateHookIndex;
function useState(initial) {
  let currentFiber = wipFiber;
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex]
  stateHookIndex++
  const stateHook = {
    state: oldHook? oldHook.state : initial,
    queue: oldHook? oldHook.queue:[]
  };

  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state)
  })
  stateHook.queue = []

  stateHooks.push(stateHook)
  currentFiber.stateHooks = stateHooks
  function setState(action) {
    // stateHook.state = action(stateHook.state)
// 减少更新
    const eagerState = 
         typeof action==='function'?action(): action;
         if(eagerState===stateHook.state) return

    stateHook.queue.push(typeof action==='function'?action: ()=>action)
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };
    nextWorkOfUnit = wipRoot;
  }
  return [stateHook.state, setState];
}

const React = {
  render,
  createElement,
  update,
  useState,
};

export default React;
