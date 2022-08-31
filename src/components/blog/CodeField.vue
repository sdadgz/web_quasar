<template>
  <div class="column _base" style="border-radius: 6px">
    <div v-for="i in colm - 2">
      <div class="row justify-start">
        <template v-for="dontUse in spaseF(textArr[index+i])">
          <span class="col-auto" style="width: 5px;"/>
        </template>
        <CodeStyle :type="type" :text="textArr[index+i]"/>
      </div>

    </div>
  </div>
</template>

<script setup>

import CodeStyle from "./CodeStyle.vue";
import {ref} from "vue";

const props = defineProps(['index', 'textArr', 'colm']);

let type = ref();

start();

function start() {
  // 代码块类型
  type.value = props.textArr[props.index].substring(3);
}

// 首位多少个空格
function spaseF(t) {
  let add = 0;
  while (t.startsWith(" ")) {
    add++;
    t = t.substring(1);
  }
  console.log(add)
  return add;
}

</script>

<style scoped>

._base {
  background-color: rgba(255, 255, 255, 0.29);
  margin: 0 10px;
  padding: 0 10px;
}

</style>
