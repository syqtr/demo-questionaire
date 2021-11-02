import Vue from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import browserDetect from "vue-browser-detect-plugin";
import VueRecord from '@codekraft-studio/vue-record'

Vue.use(VueRecord)
Vue.use(browserDetect);
Vue.config.productionTip = false;

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount("#app");
