import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import App from './App'
import router from './router'
import { store } from './store/'

Vue.config.productionTip = false

Vue.use(Buefy)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
