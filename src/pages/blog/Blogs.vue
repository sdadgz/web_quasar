<template>
  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed;z-index: -1"/>

  <div class="q-pa-md q-gutter-sm">

    <Header/>

    <q-card>
      <q-img
        :src="backgroundImg"
      />
    </q-card>

    <q-btn class="shadow-1" color="primary" @click="loadBlogs" label="重加载"/>

    <div class="row items-center">
      <div class="col-12 col-md-3" v-for="blog in blogs">
        <BlogCard :blog="blog" :backgroundImg="backgroundImg"/>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useQuasar} from 'quasar';
import {ref} from "vue";
import {api} from "boot/axios";
import "components/notifyTools"
import {CommFail, CommSeccess, LoadingFail, LoadingNotify, LoadingSucceed} from "components/notifyTools";
import BlogCard from "components/blog/BlogCard.vue";
import {useRouter} from "vue-router";
import Header from "components/public/Header.vue";

const $q = useQuasar();
const $router = useRouter();

// banner
const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const blogs = ref([]);

loadBlogs();

function loadBlogs() {
  const loadNot = LoadingNotify();
  let username = $router.currentRoute.value.params.username;

  // 是不是访问根目录
  if (username === undefined) {
    username = "sdadgz";
    const fromLocal = localStorage.getItem("username");
    if (fromLocal !== null) {
      username = fromLocal;
    }
  }

  api.get("/blog/" + username + "/blogs").then(res => {
    if (res.code === "200") {
      LoadingSucceed(loadNot);
      blogs.value = res.data;
    } else {
      LoadingFail(loadNot);
    }
  }).catch(() => {
    LoadingFail(loadNot);
  })
}

</script>

<style scoped>

</style>
