import {ref} from "vue";
import axios, {api} from "../boot/axios";
import {CommFail, CommSeccess} from "./notifyTools";
import {EMPTY_STRING, REDIS_SPLIT} from "components/StringTool";
import {laCalendar} from "@quasar/extras/line-awesome";

export const notNull = ref([(val) => (val && val.length > 0) || '输入值为空']);

// 是否是数字
export function isInteger(x: string){
  const reg = /^[0-9]*$/
  return reg.test(x) && x.length > 0;
}

// 常用api返回通知
export async function apiThen(api: Promise<any>) {
  return await api.then(res => {
    if (res.code && res.code === "200") {
      CommSeccess("操作成功");
    } else {
      CommFail(res.msg);
    }
    return res;
  }).catch(res => {
    CommFail("操作失败");
    return res;
  })
}

// 获取到ip
export function getIp(ip: string) {
  const split = ip.split(REDIS_SPLIT);
  return split[split.length - 1];
}

// 根据ip获取地域信息
export function getRegionalByIp(ip: string) {
  return api.get('https://ip.useragentinfo.com/json', {
    params: {
      ip: ip
    }
  })
}

// 来访者树图
export interface labelChildren {
  label: string;
  count: number;
  children: labelChildren[];
}

// 根据深度设置索引 label children格式
export function setChildren(res: labelChildren[], labelArr: string[], count?: number) {
  let p = res;
  for (let i = 0; i < labelArr.length; i++) {
    // 遍历对象试图寻找对应label
    let flag = true;
    for (let labelChild of p) {
      if (labelChild.label === labelArr[i]) {
        // 给他增点值
        labelChild.count += count || 0;
        // 芜湖找到咯
        p = labelChild.children;
        flag = false;
        break;
      }
    }
    // 啊拉啊拉，找不到啊
    if (flag && labelArr[i]) {
      p.push({label: labelArr[i], count: count || 0, children: []});
      p = p[p.length - 1].children;
    }
  }
  return res;
}
