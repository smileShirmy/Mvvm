class Vue {
  constructor(options, prop) {
    this.$options = options
    this.$data = options.data
    this.$prop = prop
    this.$el = document.querySelector(options.el)

    Object.keys(this.$data).forEach(key => {
      this.proxyData(key)
    })

    observer(this.$data)
    new Compile(this)
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(value) {
        this.$data[key] = value
      }
    })
  }
}