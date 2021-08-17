import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/index.css";
import "./assets/css/iconfont.css";
import config from "./assets/js/config";
import axios from "axios";
import VueAxios from "vue-axios";
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import moment from "moment";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.prototype.config = config;
Vue.use(mavonEditor);
Vue.component("v-chart", ECharts);
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$moment = moment;

Vue.filter("date", function(value, formatStr = "YYYY-MM-DD HH:mm:ss") {
  return moment(value).format(formatStr);
});

NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  // 判断页面是否需要登录
  if (to.path == "/login") {
    next();
  } else if (!store.state.userId) {
    // 判断用户是否登录
    next({
      path: "/login"
    });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

// 拦截异常
axios.interceptors.response.use(
  function(response) {
    switch (response.data.code) {
      case 4001:
        Vue.prototype.$message({
          type: "error",
          message: response.data.message
        });
        router.push({ path: "/login" });
        break;
      case 4002:
        Vue.prototype.$message({
          type: "error",
          message: response.data.message
        });
        break;
      case 5000:
        Vue.prototype.$message({
          type: "error",
          message: response.data.message
        });
        break;
    }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
