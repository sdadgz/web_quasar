import {api} from "boot/axios";

// 114514 小玩具
export const toy114514 = (input_114514, target_114514) => api.get('/toy/114514', {
  params: {
    src: input_114514.value,
    target_114514: target_114514.value
  }
});
