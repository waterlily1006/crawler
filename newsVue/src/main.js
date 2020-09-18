import Vue from "vue";
import store from "./store/store";
import Vuex from "vuex";
Vue.use(Vuex);

console.log(store);
Vue.config.productionTip = false;

export default {
  mount(App) {
    new Vue({
      store,
      render: h => h(App)
    }).$mount("#app");
  }
};
