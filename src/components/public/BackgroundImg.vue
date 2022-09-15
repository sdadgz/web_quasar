<template>
  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed;z-index: -1"/>
</template>

<script setup>

import {ref} from "vue";
import {api} from "../../boot/axios";
import {sleep} from "../Common.js";
import {random} from "../MathTool.js";

const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const imgArr = ref([]);

start();
setUrl();

// 初始化
async function start() {
  const localUsername = localStorage.getItem("username");
  let urlUserName;
  if (localUsername !== null) {
    urlUserName = localUsername;
  } else {
    // 设置用户名
    urlUserName = 'sdadgz';
  }
  // 获取banner
  await api.get("/img/" + urlUserName + "/background").then(res => {
    imgArr.value = res.data;
  })
}

// 设置url
async function setUrl() {
  while (true) {
    await sleep(233);
    if (imgArr.value.length > 0) {
      const bound = imgArr.value.length;
      const rand = random(bound);
      backgroundImg.value = imgArr.value[rand].url;
      await sleep(2 * 60 * 1000);
    }
  }
}

</script>

<style scoped>

</style>
