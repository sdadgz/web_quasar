import {ref} from "vue";
import axios from "../boot/axios";
import {CommFail, CommSeccess} from "./notifyTools";

export const notNull = ref([(val) => (val && val.length > 0) || '输入值为空']);

// 常用api返回通知
export async function apiThen(api: Promise<any>) {
  return await api.then(res => {
    CommSeccess("操作成功");
    return res;
  }).catch(res => {
    CommFail("操作失败");
    return res;
  })
}
