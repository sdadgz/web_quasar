import {api} from "boot/axios";

// 获取用户token
export const getUserToken = () => api.get("/user/token");

// 关机
export const userShutdown = () => api.get('/user/shutdown');

// 登录
export const userLogin = (username, password) => api.post("/user/login", {
  "name": username,
  "password": password
});

// 用户信息
export const userInfo = (username) => api.get("/user", {
  params: {
    username
  }
});

// 更新用户信息
export const userRegister = (username, password)=> api.post("/user", {
  "name": username,
  "password": password
});

// 修改密码
export const userPassword = (username, oldPassword, newPassword) => api.put('/user/password', {
  username,
  oldPassword,
  newPassword,
});

// 换头
export const updateAvatar = (imgId) => api.put('/user/avatar', null, {
  params: {
    imgId
  }
})
