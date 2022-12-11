<template>
  <span class="text-weight-bold text-primary">来自{{ field }}的ip：{{ disposeIp }} 访问了{{ count }}次接口</span>
</template>

<script setup lang="ts">

import {ref, watch} from "vue";
import {EMPTY_STRING, REDIS_SPLIT} from "components/StringTool";
import {api} from "boot/axios";
import {getIp} from "components/Tools";

const props = defineProps(['ip', 'count']);

const disposeIp = ref(EMPTY_STRING);
const field = ref(EMPTY_STRING);

// 父组件传ip 冒号分割，最后一个位置放ip
function getRealIp() {
  let tempIp = props.ip;
  // 获得到ip
  disposeIp.value = getIp(tempIp);
  getField(disposeIp.value);
}

// 获取地区
function getField(ip: string) {
  // 获取ip的地区，别处搞到的接口
  api.get('https://ip.useragentinfo.com/json', {
    params: {
      ip: ip
    }
  }).then(res => {
    const country = res.country;
    const province = res.province;
    let city = res.city;
    const area = res.area;
    const isp = res.isp;
    const net = res.net;
    // 去重
    if (province === city) {
      city = EMPTY_STRING;
    }
    field.value = country + province + city + area + isp + net;
  })
}

function start() {
  getRealIp();
}

watch(() => props, () => {
  start();
}, {deep: true})

start();
</script>

<style scoped>

</style>
