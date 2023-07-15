<template>
  <div class="q-pa-md q-gutter-sm">

    <Header :close-banner="true"/>
    <!--   博客    -->
    <q-card class="shadow-10 q-ma-lg blog-container">
      <q-card-section style="font-size: 2em">
        {{ blogTitle }}
      </q-card-section>
      <q-img :src="blogBanner" style="margin-bottom: 66px"/>

      <v-md-preview :text="blogText"/>

    </q-card>
  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import LeftIndex from "../../components/blog/LeftIndex.vue";
import BlogContent from "../../components/blog/BlogContent.vue";
import {useRouter} from "vue-router";
import {api} from "../../boot/axios";
import {LoadingFail, LoadingNotify, LoadingSucceed} from "../../components/notifyTools";
import Special from "../../components/blog/Special.vue";
import Table from "../../components/blog/Table.vue";
import BackgroundImg from "../../components/public/BackgroundImg.vue";
import {useMeta} from "quasar";
import Header from "../../components/public/Header.vue";
import { createApp } from 'vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import {ServerName} from "../../components/models";

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(/*...*/);

app.use(VMdPreview);

// banner
const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const $router = useRouter();
const blogIndex = ref([]);
const textArr = ref([]);
const blogTitle = ref();
const blogTextShow = ref(false);
const avatar = ref(localStorage.getItem("avatar"));
const useIcon = ref(false);
const username = ref(localStorage.getItem("username"));

const blogDone = ref(false);

const blogBanner = ref("https://sdadgz.cn/download/img/1.png"); // 博客首页

const blogText = ref("");

// 获取博客
function getBlog() {
  const not = LoadingNotify();
  // 获取url参数
  const apiUsername = $router.currentRoute.value.params.username;
  const title = $router.currentRoute.value.params.title;
  api.get("/blog/" + apiUsername + "/blog/" + title).then(res => {
    LoadingSucceed(not);
    // 名字
    username.value = apiUsername;

    // v-md-editor md内容
    blogText.value = res.data.text;

    // 文章md转html
    const str = res.data.text;
    textArr.value = str.split("\n");
    blogBanner.value = ServerName + res.data.img.url;
    blogTitle.value = res.data.title;
    blogTextShow.value = true;
  }).catch(() => {
    LoadingFail(not);
  }).then(() => {
    blogDone.value = true;
  })
}

// 设置用户信息
function setUserInfo() {
  if (avatar.value === null) {
    useIcon.value = true;
  }
}

// 去用户页
function gotoUser() {
  if (username.value === null) {
    $router.push("/");
  } else {
    $router.push("/user/" + username.value);
  }
}

// 回到主页
function goHome() {
  $router.push("/");
}

// 设置meta
function setMeta() {
  useMeta({
    titleTemplate: title => `${blogTitle.value} | by ${username.value} | ${title}`,
    meta: {
      description: {name: 'description', content: `${blogTitle.value} | by ${username.value}`},
    }
  })
}

watch(() => blogTitle.value, () => {
  setMeta();
})

function start(){
  getBlog();
  setUserInfo();
}

start();
</script>

<style scoped>

._h {
  font-weight: bold;
  border-bottom: solid rgba(255, 255, 255, .6) 1px;
  line-height: 1.2;
}

.blog-h1 {
  font-size: 2.3em;
}

.blog-h2 {
  font-size: 2.2em;
}

.blog-h3 {
  font-size: 2.1em;
}

.blog-h4 {
  font-size: 2.0em;
}

.blog-h5 {
  font-size: 1.9em;
}

.blog-h6 {
  font-size: 1.8em;
}

.code-field {
  background-color: rgba(255, 255, 255, .29);
}

.blog-container {
  overflow: hidden;
  /*position: absolute;*/
  /*left: 350px;*/
  /*width: 50%;*/
  padding-bottom: 30px;
  background-color: rgba(255, 255, 255, .3);
}

.barBtn {
  margin-right: 3%;
  min-width: 100px;
}

.a {
  transition: .35s ease-in-out;
}

.a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ec85a7;
}

a {
  text-decoration: none;
  color: #1D1D1D;
}

.img-to-big {
  transition: .35s ease-in-out;
}

.img-to-big:hover {
  transform: scale(1.2);
}

.blog-link {
  text-decoration: none;
  font-size: 1.6em;
  color: #0380f6;
  transition: .25s ease-in-out;
}

.blog-link:hover {
  color: #ec85a7;
  background-color: rgba(255, 255, 255, .1);
}

/*引用*/
._cite {
  border-left: 4px solid #f19ab8;
  padding: 0 15px;
  color: #ec85a7;
  background-color: rgba(255, 255, 255, 0.66);
  line-height: 2;
}

._base {
  margin: 10px 10px 3px;
  width: 98%;
}
</style>
