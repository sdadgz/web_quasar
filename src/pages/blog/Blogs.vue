<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <!--  杂物  -->
    <div class="row q-gutter-md q-pa-sm">
      <!--   ip   -->
      <q-card class="col-auto" style="background-color: rgba(250,160,160,0.34)">
        <q-card-section>
          <strong>不用说话，点一下知道你是哪里人，猜对了v我8w</strong>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-btn label="点我开始测试" color="primary" @click="ipHandler"/>
        </q-card-section>
      </q-card>

      <!--   114514   -->
      <q-card class="col-auto" style="background-color: rgba(250,160,160,0.34)">
        <q-card-section>
          <strong>小玩具，要不试试输个数字呗</strong>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-input
            v-model="input_114514"
            type="number"
            lazy-rules
            :rules="notNull"
            label="这里这里"
            @keyup.enter="handler_114514"
          />
        </q-card-section>
        <q-card-section>
          <strong style="word-break: break-word">{{ text_114514 }}</strong>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="这个不是按钮"
            color="primary"
            @click="handler_114514"
          />
        </q-card-section>
      </q-card>

      <!--   打死后端    -->
      <q-card class="col-auto" style="background-color: rgba(250,160,160,0.34)">
        <q-card-section>
          <strong>点我打死后端</strong>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-btn
            label="别点，球球了"
            color="red"
            @click="shutdown"
          />
        </q-card-section>
      </q-card>
    </div>

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
import {api} from "../../boot/axios";
import {CommSuccess} from "../../components/notifyTools";
import {BlogsColumns, ServerName, WaterFullOther} from "../../components/models";
import {DEFAULT_USERNAME, PAGE_SIZE, START_PAGE} from "../../components/StringTool";
import {getRegionalByIp, isInteger, notNull} from "../../components/Tools";

// 屎山太烂了，后期不可能维护了，直接重构吧

// 关机
function shutdown() {
  api.get('/user/shutdown');
}

// 114514输入框
const input_114514 = ref(null);
const target_114514 = ref(114514);
const text_114514 = ref("欸嘿");

// 点击了114514的按钮
function handler_114514() {
  text_114514.value = "加载中。。。";
  if (isInteger(input_114514.value)) {
    api.get('/toy/114514', {
      params: {
        src: input_114514.value,
        target_114514: target_114514.value
      }
    }).then(res => {
      text_114514.value = res.data;
    })
  }
}

// 获取ip按钮
function ipHandler() {
  api.get('/ip').then(res => {
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

const blogs = ref([]);
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
  await api.get("/blog/" + username.value + "/blogs", {
    params: {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }
  }).then(res => {
    if (res && res.code === "200") {
      data = res.data.lists;

      // url改造
      for (let item of res.data.lists) {
        item.img.url.startsWith('http') || (item.img.url = ServerName + item.img.url);
        item.img.reduceUrl && (item.img.reduceUrl.startsWith('http') || (item.img.reduceUrl = ServerName + item.img.reduceUrl))
        item.user.avatar.startsWith('http') || (item.user.avatar = ServerName + item.user.avatar);
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
    let url = data[i].img.reduceUrl !== null ? data[i].img.reduceUrl : data[i].img.url;
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
