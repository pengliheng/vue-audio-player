import Vue from 'vue';
import VueRouter from 'vue-router';
const App = require('./app.vue');
Vue.use(VueRouter);
const router = new VueRouter(require('./router'))
require("./css/style.styl")
new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});