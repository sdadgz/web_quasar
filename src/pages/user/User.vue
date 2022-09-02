<template>

  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed;z-index: -1"/>

  <div class="q-pa-md q-gutter-sm">

    <Header/>

    <q-card>
      <q-img
        :src="backgroundImg"
      />
    </q-card>

    <q-card style="background-color: rgba(255,255,255,.5)">
      <div style="padding: 10px">
        <q-btn class="user-btn" icon="replay" color="primary" :loading="false"/>
        <q-btn class="user-btn" icon="add_circle_outline" color="secondary"/>
        <q-btn class="user-btn" icon="edit" color="purple"/>
        <q-btn class="user-btn" icon="delete_forever" color="red"/>
      </div>

      <q-table
        style="background-color: rgba(236,133,167,0.28)"
        :columns="columns"
        :rows="rows"
        row-key="field"
        hide-pagination
      >

      </q-table>
    </q-card>


  </div>

</template>

<script setup>

import {ref} from "vue";
import Header from "../../components/public/Header.vue";
import {LoadingFail, LoadingNotify, LoadingSucceed} from "../../components/notifyTools";
import {api} from "../../boot/axios";
import {useRouter} from "vue-router";

const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const $router = useRouter();

const blogs = ref([]);
const columns = ref([]);
const rows = ref([]);

start();

function start() {
  loadBlogs();
}

function loadBlogs() {
  const loadNot = LoadingNotify();
  console.log($router.currentRoute.value.path);


  let username = localStorage.getItem("username");
  if (username == null) {
    return;
  }

  api.get("/blog/" + username + "/blogs").then(res => {
    if (res.code === "200") {
      LoadingSucceed(loadNot);
      blogs.value = res.data;
      console.log(blogs.value);
    } else {
      LoadingFail(loadNot);
    }
  }).catch(() => {
    LoadingFail(loadNot);
  })
}

</script>

<style scoped>

.user-btn {
  margin: 0 10px;
  min-width: 100px;
}

</style>
