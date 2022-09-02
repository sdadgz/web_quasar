<template>
  <div class="_base row justify-start">
    <template v-for="n in textArr.length">
      <template v-for="dontUse in spaseF(text)">
        <span class="col-auto" style="width: 3px;"/>
      </template>
      <q-card class="code col-auto" v-if="statusArr[n-1] === 'code'">{{ textArr[n - 1] }}</q-card>
      <span class="delete col-auto" v-else-if="statusArr[n-1] === 'delete'">{{ textArr[n - 1] }}</span>
      <span class="_3 col-auto" v-else-if="statusArr[n-1] === '3'">{{ textArr[n - 1] }}</span>
      <span class="_2 col-auto" v-else-if="statusArr[n-1] === '2'">{{ textArr[n - 1] }}</span>
      <span class="_1 col-auto" v-else-if="statusArr[n-1] === '1'">{{ textArr[n - 1] }}</span>
      <span v-else class="col-auto">{{ textArr[n - 1] }}</span>
    </template>
  </div>
</template>

<script setup>

import {ref} from "vue";
import {watch} from "vue";

const props = defineProps(['text']);

const textArr = ref([]);
const statusArr = ref([]);

start();

// 首位多少个空格
function spaseF(t) {
  let add = 0;
  while (t.startsWith(" ")){
    add++;
    t = t.substring(1);
  }
  return add;
}

function start() {
  const str = props.text;
  let strArr = [];
  let strTypeArr = [];
  let pre = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === '`') {
      // 单代码块
      for (let j = i + 1; j < str.length; j++) {
        if (str.charAt(j) === '`') {
          strArr.push(str.substring(pre, i));
          strTypeArr.push('none');
          strArr.push(str.substring(i + 1, j));
          strTypeArr.push('code');
          pre = j + 1;
          i = pre - 1;
          break;
        }
      }
    } else if (str.charAt(i) === '~' && str.charAt(i + 1) === '~') {
      // 删除线
      for (let j = i + 2; j < str.length; j++) {
        if (str.charAt(j) === '~' && str.charAt(j + 1) === '~') {
          strArr.push(str.substring(pre, i));
          strTypeArr.push('none');
          strArr.push(str.substring(i + 2, j));
          strTypeArr.push('delete');
          pre = j + 2;
          i = pre - 1;
          break;
        }
      }
    } else if (str.charAt(i) === '*' && str.charAt(i + 1) === '*' && str.charAt(i + 2) === '*') {
      // 斜粗
      for (let j = i + 3; j < str.length; j++) {
        if (str.charAt(j) === '*' && str.charAt(j + 1) === '*' && str.charAt(j + 2) === '*') {
          strArr.push(str.substring(pre, i));
          strTypeArr.push('none');
          strArr.push(str.substring(i + 3, j));
          strTypeArr.push('3');
          pre = j + 3;
          i = pre - 1;
          break;
        }
      }
    } else if (str.charAt(i) === '*' && str.charAt(i + 1) === '*') {
      // 粗
      for (let j = i + 2; j < str.length; j++) {
        if (str.charAt(j) === '*' && str.charAt(j + 1) === '*') {
          strArr.push(str.substring(pre, i));
          strTypeArr.push('none');
          strArr.push(str.substring(i + 2, j));
          strTypeArr.push('2');
          pre = j + 2;
          i = pre - 1;
          break;
        }
      }
    } else if (str.charAt(i) === '*') {
      // 斜
      for (let j = i + 1; j < str.length; j++) {
        if (str.charAt(j) === '*') {
          strArr.push(str.substring(pre, i));
          strTypeArr.push('none');
          strArr.push(str.substring(i + 1, j));
          strTypeArr.push('1');
          pre = j + 1;
          i = pre - 1;
          break;
        }
      }
    }
  }
  strArr.push(str.substring(pre, str.length));
  strTypeArr.push('none');
  textArr.value = strArr;
  statusArr.value = strTypeArr;
}

</script>

<style scoped>
._base {
  margin: 10px;
  width: 98%;
}

.code {
  background-color: rgba(255, 255, 255, .5);
  border: 1px solid #ddd;
  margin: 4px;
  padding: 2px 4px;
  border-radius: 4px;
  display: inline-block;
}

.delete {
  text-decoration: line-through;
}

._3 {
  font-style: italic;
  font-weight: bold;
}

._2 {
  font-weight: bold;
}

._1 {
  font-style: italic;
}
</style>
