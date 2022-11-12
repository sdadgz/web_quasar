<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <!--  按钮  -->
    <q-btn class="shadow-1" color="primary" @click="loadBlogs" label="重加载"/>

    <!--  博客  -->
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
import {useMeta, useQuasar} from 'quasar';
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
import {DEFAULT_USERNAME, TITLE} from "../../components/StringTool";

const $q = useQuasar();
const $router = useRouter();

// banner
const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const blogs = ref([]);
const username = ref(DEFAULT_USERNAME);

async function loadBlogs() {
  const loadNot = LoadingNotify();
  let username1 = $router.currentRoute.value.params.username;

  // 是不是访问根目录
  if (username1 === undefined) {
    const fromLocal = localStorage.getItem("username");
    if (fromLocal !== null) {
      username.value = fromLocal;
    }
  }

  username1 = username.value

  // 获取数据
  await api.get("/blog/" + username1 + "/blogs").then(res => {
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
    // 设置url
    let url = data[i].img.reduceUrl !== null ? data[i].img.reduceUrl : data[i].img.url;
    // 最小索引增加图片
    let add = await checkPicurl(url);
    while (add === undefined && url) {
      add = await checkPicurl(url);
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

useMeta({
  titleTemplate: title => `${username.value}的博客 | ${title}`,
  meta: {
    description: {name: 'description', content: `${username.value}的博客`},
  }
})

loadBlogs();
</script>

<style scoped>

</style>
