import Vue from 'vue'

const eventBus = {}

eventBus.install = function (Vue) {
  Vue.prototype.$replayBus = new Vue()
}

Vue.use(eventBus)
