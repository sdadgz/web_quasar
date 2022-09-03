<template>
  <q-table
    :columns="columns"
    :rows="dataRow"
    row-key="field"
    hide-pagination
    style="background-color: rgba(241,135,176,0.41)"
  >

  </q-table>
</template>

<script setup>

import {ref} from "vue";

const props = defineProps(['index', 'textArr', 'colm']);

const columns = ref([]);
const dataRow = ref([]);

start();

function start() {
  // 初始化数组
  columns.value = [];
  dataRow.value = [];
  let i = props.index;
  let strArr = props.textArr[i].split("|");
  // 录入表头
  for (let j = 1; j < strArr.length - 1; j++) {
    columns.value.push({"field": strArr[j].replaceAll(" ", ''), "label": strArr[j].replaceAll(" ", ''), align: "left"});
  }
  // 跳过分割线
  i += 2;
  // 录入数据
  for (let j = i; j < props.textArr.length && j < props.index + props.colm; j++) {
    // 某一行
    let obj = {};
    strArr = props.textArr[j].split("|");
    for (let k = 1; k < strArr.length - 1; k++) {
      Object.assign(obj, {[columns.value[k - 1].field]: strArr[k]});
    }
    dataRow.value.push(obj);
  }

  console.log(columns.value);
  console.log(dataRow.value);
}

</script>

<style scoped>

</style>
