<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <!--  博客  -->
    <q-infinite-scroll :offset="1080" @load="onLoad" :disable="disable">
      <div class="row">
        <div class="col" v-for="i in BlogsColumns">
          <div v-for="blog in blogs[i - 1]">
            <BlogCard :blog="blog" :backgroundImg="backgroundImg"/>
          </div>
        </div>
      </div>

      <!--   底下那个旋转器   -->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px"/>
        </div>
      </template>
    </q-infinite-scroll>
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
import {DEFAULT_USERNAME, PAGE_SIZE, SPLIT, START_PAGE, TITLE} from "../../components/StringTool";

const $q = useQuasar();
const $router = useRouter();

// banner
const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const blogs = ref([]);
const username = ref(DEFAULT_USERNAME);

// 博客分页
const currentPage = ref(START_PAGE);
const pageSize = ref(PAGE_SIZE);

// 加载blogs
async function loadBlogs() {
  let username1 = $router.currentRoute.value.params.username;
  let data;

  // url判断名字
  if (username1 === undefined) {
    // url没东西，用本地存贮的名字
    const fromLocal = localStorage.getItem("username");
    if (fromLocal !== null) {
      username.value = fromLocal;
    }
  }

  username1 = username.value

  // 获取数据
  await api.get("/blog/" + username1 + "/blogs", {
    params: {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
  }).then(res => {
    if (res.code === "200") {
      data = res.data.lists;
      if (data.length < 1) {
        disable.value = true;
      }
    }
  })
  await setBlogs(data);
}

// 瀑布流数数的那个
const numArr = ref([]);

// 初始化blogs
function initBlogs() {
  // 初始化blogs
  blogs.value = new Array(BlogsColumns);
  // 初始化瀑布流控制数组
  numArr.value = new Array(BlogsColumns);
  numArr.value.fill(0);
  // 无限滚动
  disable.value = false;
}

// 无限滚动控制开关
const disable = ref(false);

// 无限滚动加载
async function onLoad(index, done) {
  console.log('index：' + index);
  currentPage.value = index;
  await loadBlogs();
  done();
  console.log('done' + index);
}

// 设置blogs
async function setBlogs(data) {
  // 遍历数据
  for (let i = 0; i < data.length; i++) {
    let minIndex = 0;
    // 找出最小索引
    for (let j = 1; j < numArr.value.length; j++) {
      if (numArr.value[j] < numArr.value[minIndex]) {
        minIndex = j;
      }
    }
    // 设置url
    let url = data[i].img.reduceUrl !== null ? data[i].img.reduceUrl : data[i].img.url;
    // 最小索引增加图片
    let add = await checkPicurl(url);
    // while (add === undefined && url || add === 0) {
    //   add = await checkPicurl(url);
    //   await sleep(50);
    // }
    numArr.value[minIndex] += add + WaterFullOther;
    // 初始化
    if (blogs.value[minIndex] === undefined) {
      blogs.value[minIndex] = [];
    }
    // 扔进去
    blogs.value[minIndex].push(data[i]);
  }
}

// meta
useMeta({
  titleTemplate: title => `${username.value}的博客 | ${title}`,
  meta: {
    description: {name: 'description', content: `${username.value}的博客`},
  }
})

function start() {
  initBlogs();
}

start();
</script>

<style scoped>

</style>
