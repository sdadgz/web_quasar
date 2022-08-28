import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost:8000' });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file



  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API


// 挂载到原型对象之前 先设置拦截器 通过axios请求拦截器添加token，保证拥有获取数据的权限
// axios.interceptors.request.use(config => {
//     //在 request 拦截器中， 展示进度条 NProgress.start()
//     // NProgress.start()
//     // 为请求头对象添加Token验证的Authorization字段
//     config.headers.Authorization = window.sessionStorage.getItem('token')
//     // 最后都必须 return config
//     return config
//   })
// // 在 response 拦截器中， 隐藏进度条 NProgress.done()
// axios.interceptors.response.use(config => {
//   // NProgress.done()
//   return config
// })


});

export { api };
