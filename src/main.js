import Vue from 'vue'
import VueMaterial from 'vue-material'

import router from './router'
import store from './store'

import App from './App'

Vue.config.productionTip = false

Vue.use(VueMaterial)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App />',
  components: { App }
})
