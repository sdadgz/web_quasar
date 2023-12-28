import {api} from "boot/axios";

// 获取今日访问ip
export const getIpToday = () => api.get('/ip/today');

// ip
export const getIp = () => api.get('/ip');
