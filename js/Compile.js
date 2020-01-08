class Compile {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.fragment = null
    this.init()
  }

  init() {
    // step0: 创建文档片段
    this.fragment = this.createFragment(this.el)
    // step1: 解析模板 
    this.compileNode(this.fragment)
    // step2: 把模板添加到 DOM 中
    this.el.appendChild(this.fragment)
  }

  createFragment(el) {
    const fragment = document.createDocumentFragment()
    let child = el.firstChild
    // 将子节点，全部 移动 文档片段里
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }

  compileNode(fragment) {
    let childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        this.compile(node)
      }

      // 把插值表达式中的属性匹配出来
      let reg = /\{\{(.*?)\}\}/
      let text = node.textContent

      if (reg.test(text)) {
        let prop = reg.exec(text)[1]
        this.compileText(node, prop) // 解析插值表达式
      }

      // 递归编译子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileNode(node)
      }
    })
  }

  compile(node) {
    let nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      let name = attr.name
      // 判断是否 Vue 指令
      if (this.isDirective(name)) {
        let value = attr.value
        if (name === 'v-model') {
          this.compileModel(node, value)
        }
      }
    })
  }

  // 编译 v-model
  compileModel(node, prop) {
    let val = this.vm.$data[prop]
    this.updateModel(node, val)

    // 添加订阅，传入视图更新回调
    new Watcher(this.vm, prop, (value) => {
      this.updateModel(node, value)
    })

    // 监听 input 事件
    node.addEventListener('input', e => {
      let newValue = e.target.value
      if (val === newValue) {
        return
      }
      // 如果值发生改变，触发 setter 并更新视图
      this.vm.$data[prop] = newValue
    })
  }

  compileText(node, prop) {
    let text = this.vm.$data[prop]
    // 把 {{name}} 替换为 name
    this.updateView(node, text)
    // 添加订阅，传入视图更新回调
    new Watcher(this.vm, prop, (value) => {
      this.updateView(node, value)
    })
  }

  updateModel(node, value) {
    node.value = typeof value === 'undefined' ? '' : value
  }
  
  updateView(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  }

  isDirective(attr) {
    return attr.includes('v-')
  }

  isElementNode(node) {
    return node.nodeType === document.ELEMENT_NODE
  }
}
