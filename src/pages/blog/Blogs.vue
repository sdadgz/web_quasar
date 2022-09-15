<template>

  <!-- 背景图片 -->
  <BackgroundImg />

  <div class="q-pa-md q-gutter-sm">

    <Header/>

<!--    <q-card>-->
<!--      <q-img-->
<!--        :src="backgroundImg"-->
<!--      />-->
<!--    </q-card>-->

    <q-btn class="shadow-1" color="primary" @click="loadBlogs" label="重加载"/>

    <div class="row">
      <div class="col" v-for="i in BlogsColumns">
        <div v-for="blog in blogs[i - 1]">
          <BlogCard :blog="blog" :backgroundImg="backgroundImg"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useQuasar} from 'quasar';
import {ref} from "vue";
import "components/notifyTools"
import BlogCard from "components/blog/BlogCard.vue";
import {useRouter} from "vue-router";
import Header from "components/public/Header.vue";
import {checkPicurl} from "../../components/img/img.js";
import {api} from "../../boot/axios";
import {LoadingFail, LoadingNotify, LoadingSucceed} from "../../components/notifyTools";
import {BlogsColumns, WaterFullOther} from "../../components/models";
import {sleep} from "../../components/Common.js";
import BackgroundImg from "../../components/public/BackgroundImg.vue";

const $q = useQuasar();
const $router = useRouter();

// banner
const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const blogs = ref([]);

loadBlogs();

async function loadBlogs() {
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

  // 获取数据
  await api.get("/blog/" + username + "/blogs").then(res => {
    if (res.code === "200") {
      LoadingSucceed(loadNot);
      // blogs.value = res.data;

      blogs.value = new Array(BlogsColumns);
      setBlogs(res.data);
    } else {
      LoadingFail(loadNot);
    }
  }).catch(() => {
    LoadingFail(loadNot);
  })
}

async function setBlogs(data) {
  // 创建长度参考数组
  let numArr = new Array(BlogsColumns);
  numArr.fill(0);
  // 遍历数据
  for (let i = 0; i < data.length; i++) {
    let minIndex = 0;
    // 找出最小索引
    for (let j = 1; j < numArr.length; j++) {
      if (numArr[j] < numArr[minIndex]) {
        minIndex = j;
      }
    }
    // 最小索引增加图片
    let add = await checkPicurl(data[i].img.url);
    while (add === undefined && data[i].img.url) {
      add = await checkPicurl(data[i].img.url);
      await sleep(1);
    }
    numArr[minIndex] += add + WaterFullOther;
    // 初始化
    if (blogs.value[minIndex] === undefined) {
      blogs.value[minIndex] = [];
    }
    // 扔进去
    blogs.value[minIndex].push(data[i]);
  }
}

</script>

<style scoped>

</style>
