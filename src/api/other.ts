import {api} from "boot/axios";

// 根据ip获取信息
export const getInfoByIp = ip => api.get('https://ip.useragentinfo.com/json', {
  params: {
    ip: ip
  }
});
