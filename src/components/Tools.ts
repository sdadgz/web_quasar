import {ref} from "vue";

export const notNull = ref([(val) => (val && val.length > 0) || '输入值为空']);
