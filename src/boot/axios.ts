import {boot} from 'quasar/wrappers';
import axios, {AxiosInstance} from 'axios';
import {CommFail} from "components/notifyTools";
import {useRouter} from "vue-router";
import {BackendPrefix} from "components/models";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// 改了res之后不认识了
declare module "axios" {
  interface AxiosResponse<T = any> {
    code: any;
    msg: any;
    data: T;
    // 这里追加你的参数
    country: string; // 国家
    province: string; // 省份
    city: string; // 城市
    area: string; //
    isp: string; // 运行商
    net: string; // 网络
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({baseURL: BackendPrefix});

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file


  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API


  // 请求拦截器
  api.interceptors.request.use((config) => {
      config.headers.token = localStorage.getItem('token');
      return config
    }, err => {
      return Promise.reject(err)
    }
  )

  // 响应拦截器
  api.interceptors.response.use(res => {
      // 自定义判断
      if (res.data.code == '499') {
        localStorage.clear();
        CommFail('请重新登录');
        CommFail(res.msg);
        window.location.href = "/#/user/login";
      } else if (res.data.code != '200') {
        CommFail(res.data.msg);
      } else {
        return res.data;
      }
    }
  )


});

export {api};
