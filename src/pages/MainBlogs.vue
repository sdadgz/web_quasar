<template>
  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed;background-size: 100% 100%"/>

  <div class="q-pa-md q-gutter-sm">
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
import "../components/notifyTools"
import {CommFail, CommSeccess, LoadingFail, LoadingNotify, LoadingSucceed} from "components/notifyTools";
import BlogCard from "components/blog/BlogCard.vue";

const $q = useQuasar();

// banner
let backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

let blogs = ref([]);

loadBlogs();

function loadBlogs() {
  const loadNot = LoadingNotify();

  let username = $q.cookies.get("username");
  if (username == null) {
    username = "sdadgz";
  }

  api.get("/blog/blogs/" + username).then(res => {
    if (res.data.code == 200) {
      LoadingSucceed(loadNot);
      blogs.value = res.data.data;
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
