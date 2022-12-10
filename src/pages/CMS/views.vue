<template>
  <div class="q-pa-md q-gutter-md">

    <!--  头  -->
    <Header/>

    <div
      class="q-pa-md q-gutter-md row"
      style="padding: 0;margin: 0;"
    >
      <q-card style="background-color: rgba(255,255,255,.5)">
        <q-card-section>
          <strong>今日来访</strong>
        </q-card-section>

        <q-separator/>

        <q-card-section v-for="(value, key) in todayIpList">
          <Ip :ip="key" :count="value"/>
        </q-card-section>
      </q-card>
    </div>

  </div>
</template>

<script setup lang="ts">

import Header from "components/public/Header.vue";
import Ip from "components/cms/ip.vue";
import {api} from "boot/axios";
import {ref} from "vue";
import {REDIS_SPLIT} from "components/StringTool";

const todayIpList = ref([]);

function getTodayIpList() {
  api.get('/ip/today').then(res => {
    todayIpList.value = res.data;
  })
}

function start() {
  getTodayIpList();
}

start();
</script>

<style scoped>

</style>
