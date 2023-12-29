<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <!--  电脑独享博客  -->
    <q-infinite-scroll
      class="desktop-only"
      :offset="1080"
      @load="onLoad"
      :disable="disable"
    >
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

    <!--  手机独享博客  -->
    <q-infinite-scroll
      class="mobile-only"
      :offset="666"
      @load="onLoad"
      :disable="mobileDisable"
    >
      <div
        style="margin-top: 10px;"
        v-for="blog in mobileBlogs"
      >
        <BlogCard :blog="blog" :backgroundImg="backgroundImg"/>
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
import {checkPic} from "../../components/img/img.js";
import {CommSuccess} from "../../components/notifyTools";
import {BlogsColumns, BackendPrefix, WaterFullOther} from "../../components/models";
import {DEFAULT_USERNAME, PAGE_SIZE, START_PAGE} from "../../components/StringTool";
import {getRegionalByIp, isInteger, notNull} from "../../components/Tools";
import {userShutdown} from "../../api/user";
import {toy114514} from "../../api/toy";
import {getIp} from "../../api/ip";
import {getBlogs} from "../../api/blog";

// 屎山太烂了，后期不可能维护了，直接重构吧

// 关机
function shutdown() {
  userShutdown();
}

// 114514输入框
const input_114514 = ref(null);
const target_114514 = ref(114514);
const text_114514 = ref("欸嘿");

// 点击了114514的按钮
function handler_114514() {
  text_114514.value = "加载中。。。";
  if (isInteger(input_114514.value)) {
    toy114514(input_114514, target_114514).then(res => {
      text_114514.value = res.data;
    })
  }
}

// 获取ip按钮
function ipHandler() {
  getIp().then(res => {
    const ip = res.data;
    getRegionalByIp(ip).then(res => {
      // 中国特殊
      if (res.country === '中国') {
        CommSuccess('来自' + (res.area || res.city || res.province || ipAllInfo(res)) + '~');
      } else {
        // 其他地区
        CommSuccess(ipAllInfo(res));
      }
    })
  })
}

// 展示全部
function ipAllInfo(res) {
  return res.country + res.province + res.city + res.area;
}

// 手机端博客
const mobileBlogs = ref([]);
// 手机端无线滚动
const mobileDisable = ref(true);

const $q = useQuasar();
const $router = useRouter();

// banner
const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const blogs = ref(new Array(BlogsColumns));
const username = ref(DEFAULT_USERNAME);

// 博客分页
const currentPage = ref(START_PAGE);
const pageSize = ref(PAGE_SIZE);

// 加载blogs
async function loadBlogs() {
  const urlUsername = $router.currentRoute.value.params.username;
  let data;

  // url 中的 username 判定
  if (urlUsername) {
    // url有地址，扔进去
    username.value = urlUsername.toString();
  } else {
    // url没东西，用本地存贮的名字
    const fromLocal = localStorage.getItem("username");
    username.value = fromLocal || DEFAULT_USERNAME;
  }

  // 获取数据
  await getBlogs(username.value, currentPage.value, pageSize.value).then(res => {
    if (res && res.code === "200") {
      data = res.data.lists;

      // url改造
      for (let item of data) {
        item.imgUrl.startsWith('http') || (item.imgUrl = BackendPrefix + item.imgUrl);
        item.imgReduceUrl && (item.imgReduceUrl.startsWith('http') || (item.imgReduceUrl = BackendPrefix + item.imgReduceUrl))
        item.userAvatar.startsWith('http') || (item.userAvatar = BackendPrefix + item.userAvatar);
      }

      if (data.length < 1) {
        turnOff();
      }
    }
  })
  await setBlogs(data);
}

// 到头了，不加载啦
function turnOff() {
  disable.value = true;
  mobileDisable.value = true;
}

// 瀑布流数数的那个
const numArr = ref(Array(BlogsColumns).fill(0));

// 初始化blogs
function initBlogs() {
  // 初始化blogs
  // blogs.value = new Array(BlogsColumns);
  // 初始化瀑布流控制数组
  // numArr.value = new Array(BlogsColumns);
  // numArr.value.fill(0);
  // 无限滚动
  disable.value = false;
}

// 手机端初始化blogs
function initMobileBlogs() {
  // 手机端初始化blogs
  mobileBlogs.value = [];
  // 无线滚动
  mobileDisable.value = false;
}

// 无限滚动控制开关
const disable = ref(true);

// 无限滚动加载
async function onLoad(index, done) {
  currentPage.value = index;
  await loadBlogs();
  done();
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
    let url = data[i].imgReduceUrl !== null ? data[i].imgReduceUrl : data[i].imgUrl;
    // 最小索引增加图片
    let add = await checkPic(url);
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
    mobileBlogs.value.push(data[i]);
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
  if ($q.platform.is.desktop) {
    initBlogs();
  } else {
    initMobileBlogs();
  }
}

start();
</script>

<style scoped>

</style>
