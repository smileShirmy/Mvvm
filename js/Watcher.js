class Watcher {
  // vm 表示当前 Vue 实例
  // prop 表示需要订阅的属性
  // callback 表示触发更新时的回调函数，用于更新视图模板
  constructor(vm, prop, callback) {
    this.vm = vm
    this.prop = prop
    this.callback = callback
    this.value = this.get()
  }

  update() {
    const value = this.vm.$data[this.prop]
    const oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.callback(value)
    }
  }

  get() {
    Dep.target = this // 储存订阅器
    const value = this.vm.$data[this.prop] // 触发 get 收集订阅器
    Dep.target = null
    return value
  }
}