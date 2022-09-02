<template>
  <template v-for="index in arrRef.length">
    <!--    标题-->
    <template v-if="passF(index - 1)"></template>
    <template v-else-if="whatType(index - 1) === 0">
      <div
        :id="getIndex(arrRef[index - 1].substring(2))"
        class="_h blog-h1"
      >
        <Special :text="arrRef[index - 1].substring(2)"/>
      </div>
    </template>
    <template v-else-if="whatType(index - 1) === 1">
      <div
        class="_h blog-h2"
        :id="getIndex(arrRef[index - 1].substring(3))"
      >
        <Special :text="arrRef[index - 1].substring(3)"/>
      </div>
    </template>
    <template v-else-if="whatType(index - 1) === 2">
      <div
        class="_h blog-h3"
        :id="getIndex(arrRef[index - 1].substring(4))"
      >
        <Special :text="arrRef[index - 1].substring(4)"/>
      </div>
    </template>
    <template v-else-if="whatType(index - 1) === 3">
      <div
        class="_h blog-h4"
        :id="getIndex(arrRef[index - 1].substring(5))"
      >
        <Special :text="arrRef[index - 1].substring(5)"/>
      </div>
    </template>
    <template v-else-if="whatType(index - 1) === 4">
      <div
        class="_h blog-h5"
        :id="getIndex(arrRef[index - 1].substring(6))"
      >
        <Special :text="arrRef[index - 1].substring(6)"/>
      </div>
    </template>
    <template v-else-if="whatType(index - 1) === 5">
      <div
        class="_h blog-h6"
        :id="getIndex(arrRef[index - 1].substring(7))"
      >
        <Special :text="arrRef[index - 1].substring(7)"/>
      </div>
    </template>

    <!--    引用-->
    <template v-else-if="whatType(index - 1) === 6">
      <div class="_base _cite">
        {{ arrRef[index - 1].substring(2) }}
      </div>
    </template>
    <!--    分割线-->
    <template v-else-if="whatType(index - 1) === 7">
      <div class="_base _h" style="border-color: #ec85a7;border-width: 2px;height: 20px"></div>
    </template>
    <!--    图片-->
    <template v-else-if="whatType(index - 1) === 8">
      <div style="overflow: hidden">
        <q-img
          class="img-to-big"
          :src="arrRef[index - 1].substring(arrRef[index - 1].indexOf('(') + 1,arrRef[index - 1].lastIndexOf(')'))"
          :alt="arrRef[index - 1].substring(arrRef[index - 1].indexOf('[') + 1,arrRef[index - 1].lastIndexOf(']'))"
        />
      </div>
    </template>
    <!--    超链接-->
    <template v-else-if="whatType(index - 1) === 9">
      <a
        class="_base blog-link"
        :href="arrRef[index - 1].substring(arrRef[index - 1].indexOf('(') + 1,arrRef[index - 1].lastIndexOf(')'))"
        target="_blank"
      >
        {{ arrRef[index - 1].substring(arrRef[index - 1].indexOf('[') + 1, arrRef[index - 1].lastIndexOf(']')) }}
      </a>
    </template>
    <!--    列表-->
    <template v-else-if="whatType(index - 1) === 10">
      <Special :text="arrRef[index - 1]"/>
    </template>
    <!--    无序列表-->
    <template v-else-if="whatType(index - 1) === 11">
      <Special :text="arrRef[index - 1]"/>
    </template>
    <!--    表格-->
    <template v-else-if="whatType(index - 1) === 12">
      <Table :index="index - 1" :textArr="textArr" :colm="tableC"/>
    </template>
    <!--    代码块-->
    <template v-else-if="whatType(index - 1) === 13">
      <CodeField :index="index - 1" :textArr="textArr" :colm="tableC"/>
    </template>
    <!--    缺省-->
    <template v-else>
      <div class="_base">
        <Special :text="arrRef[index - 1]"/>
      </div>
    </template>

  </template>
</template>

<script setup>

import {ref, watch} from "vue";
import Special from "./Special.vue";
import Table from "./Table.vue";
import CodeField from "./CodeField.vue";

const props = defineProps(['textArr']);
const arrRef = ref([]);
// 表格维度
const tableR = ref(0);
const tableC = ref(0); // 与代码块列数
const passIndex = ref(0);
const blogIndexT = ref([]);

// 监控
watch(() => props.textArr, () => {
  arrRef.value = props.textArr;
}, {immediate: true})

// 获取表情索引
function getIndex(str) {
  str = str.replaceAll("~", '');
  str = str.replaceAll("*", '');
  return str;
}

// 跳过渲染
function passF(index) {
  return !(index <= passIndex.value || index >= passIndex.value + tableC.value);
}

// 什么类型的
function whatType(index) {
  const test = props.textArr[index];
  // 标题
  if (test.startsWith("# ")) {
    return 0;
  }
  if (test.startsWith("## ")) {
    return 1;
  }
  if (test.startsWith("### ")) {
    return 2;
  }
  if (test.startsWith("#### ")) {
    return 3;
  }
  if (test.startsWith("##### ")) {
    return 4;
  }
  if (test.startsWith("###### ")) {
    return 5;
  }
  // 引用
  if (test.startsWith("> ")) {
    return 6;
  }
  // 分割线
  if ('------' === test || '---' === test || '***' === test) {
    return 7;
  }
  // 图片
  if (test.startsWith("![")) {
    let temp = test.indexOf(']', 2);
    if (temp !== -1) {
      temp = test.indexOf('(', temp + 1);
      if (temp !== -1) {
        temp = test.indexOf(')', temp + 1);
        if (temp !== -1) {
          return 8;
        }
      }
    }
  }
  // 超链接
  if (test.startsWith("[")) {
    let temp = test.indexOf(']', 1);
    if (temp !== -1) {
      temp = test.indexOf('(', temp + 1);
      if (temp !== -1) {
        temp = test.indexOf(')', temp + 1);
        if (temp !== -1) {
          return 9;
        }
      }
    }
  }
  // 列表
  if (test.startsWith("1. ")) {
    return 10;
  }

  // 无序列表
  if (test.startsWith("- ") || test.startsWith("* ")) {
    return 11;
  }
  // 表格
  if (test.startsWith("| ") && isTable(index)) {
    return 12;
  }
  // 代码块
  if (test.startsWith("```")) {
    passIndex.value = index;
    tableC.value = codeF(index);
    return 13;
  }
  return -1;
}

function codeF(index) {
  let codeAdd = 1;
  while (index + codeAdd < props.textArr.length && !(props.textArr[index + codeAdd] === '```')) {
    codeAdd++;
  }
  return codeAdd + 1;
}

// 是不是表
function isTable(index) {
  let x = index;

  // 多少行
  let tableStr = props.textArr[x].split('|');
  const rows = tableStr.length - 2;
  if (!notLine(tableStr, rows)) {
    return false;
  }

  tableStr = props.textArr[x + 1].split('|');
  if (!notLine(tableStr, rows)) {
    return false;
  }
  // 判断分割线
  for (let i = 1; i < tableStr.length - 1; i++) {
    if (tableStr[i].indexOf('-') === -1) {
      return false;
    }
  }

  // 最后一次判断
  tableStr = props.textArr[x + 2].split('|');
  if (!notLine(tableStr, rows)) {
    return false;
  }

  // 赋值给表格行列长度
  tableR.value = rows;
  tableC.value = 3;

  for (let i = index + 3; i < props.textArr.length; i++) {
    tableStr = props.textArr[i].split('|');
    // 那就到此为止吧，再循环就不礼貌了
    if (!notLine(tableStr, rows)) {
      passIndex.value = index;
      return true;
    } else {
      tableC.value = tableC.value + 1;
    }
  }
}

// 表行判断
function notLine(tableStr, rows) {
  if (tableStr[0] !== '' || tableStr[tableStr.length - 1] !== '') {
    return false;
  }
  if (tableStr.length <= 2) {
    return false;
  }
  return tableStr.length === rows + 2
}

</script>

<style scoped>

a {
  text-decoration: none;
  color: #1D1D1D;
}

.img-to-big {
  transition: .35s ease-in-out;
}

.img-to-big:hover {
  transform: scale(1.2);
}

.blog-link {
  text-decoration: none;
  font-size: 1.6em;
  color: #0380f6;
  transition: .25s ease-in-out;
}

.blog-link:hover {
  color: #ec85a7;
  background-color: rgba(255, 255, 255, .1);
}

/*引用*/
._cite {
  border-left: 4px solid #f19ab8;
  padding: 0 15px;
  color: #ec85a7;
  background-color: rgba(255, 255, 255, 0.29);
  line-height: 2;
}

._base {
  margin: 10px 10px 3px;
  width: 98%;
}

._h {
  font-weight: bold;
  border-bottom: solid rgba(255, 255, 255, .6) 1px;
  line-height: 1.2;
}

.blog-h1 {
  font-size: 2.3em;
}

.blog-h2 {
  font-size: 2.2em;
}

.blog-h3 {
  font-size: 2.1em;
}

.blog-h4 {
  font-size: 2.0em;
}

.blog-h5 {
  font-size: 1.9em;
}

.blog-h6 {
  font-size: 1.8em;
}
</style>
