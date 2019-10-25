function defineReactive(data, key, value) {
  observer(value) // value 可能还是一个 object
  const dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.addSubs(Dep.target)
      }
      return value
    },
    set(newVal) {
      if (value !== newVal) {
        value = newVal
        dep.notify()
      }
    }
  })
}

function observer(data) {
  // data 必须存在，而且是个 object 类型
  if (!data || typeof data !== 'object') {
    return
  }
  // 给 data 中的属性都定义 setter
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key])
  })
}

class Dep {
  constructor() {
    this.subs = [] // 存储所有依赖
  }

  // 收集依赖
  addSubs(sub) {
    this.subs.push(sub)
  }

  // 通知视图更新
  notify() {
    this.subs.forEach(sub => {
      // 通过调用依赖项 update() 方法来更新视图
      sub.update()
    })
  }
}

Dep.target = null