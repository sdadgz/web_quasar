<template>
  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed;z-index: -1"/>

  <div class="q-pa-md q-gutter-sm">

    <!--    左侧栏     -->
    <q-scroll-area
      style="position: fixed;width: 350px;height: 93%"
      :visible="false"
      :delay="233"
    >
      <q-card
        style="width: 90%; background-color: rgba(255,255,255,.3)"
      >
        <template v-for="item in blogIndex">
          <LeftIndex :blogIndex="item"/>
        </template>
      </q-card>
    </q-scroll-area>

    <!--   博客    -->
    <q-card class="blog-container shadow-10">
      <q-card-section style="font-size: 2em">
        {{ blogTitle }}
      </q-card-section>
      <q-img :src="backgroundImg" style="margin-bottom: 66px"/>
      <BlogContent :textArr="textArr"/>
    </q-card>

    <!--  右侧  -->
    <q-avatar
      class="a"
      style="height: 46px;width: 46px;margin-right: 1%;position: fixed;right: 1%"
      @click="gotoUser"
      :icon="useIcon ? 'account_circle' : ''"
    >
      <img v-if="!useIcon" :src="avatar" alt="地址错误"/>
    </q-avatar>

  </div>
</template>

<script setup>
import {ref} from "vue";
import {blogIndexDefault} from "../../components/models";
import LeftIndex from "../../components/blog/LeftIndex.vue";
import BlogContent from "../../components/blog/BlogContent.vue";
import {useRouter} from "vue-router";
import {api} from "../../boot/axios";
import {LoadingFail, LoadingNotify, LoadingSucceed} from "../../components/notifyTools";
import Header from "../../components/public/Header.vue";

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

getBlog();
setUserInfo();

function getBlog() {
  const not = LoadingNotify();
  // 获取url参数
  const username = $router.currentRoute.value.params.username;
  const title = $router.currentRoute.value.params.title;
  api.get("/blog/" + username + "/blog/" + title).then(res => {
    LoadingSucceed(not);
    const str = res.data.text;
    textArr.value = str.split("\n");
    blogIndex.value = produceIndex(textArr.value);
    blogTitle.value = res.data.title;
    blogTextShow.value = true;
  }).catch(() => {
    LoadingFail(not);
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
  }
  $router.push("/user/" + username.value);
}

// 左侧索引
function produceIndex(textArr) {
  let res = [];
  for (let i = 0; i < textArr.length; i++) {
    // 去掉代码块
    if (textArr[i].startsWith("```")) {
      for (let j = i + 1; j < textArr.length; j++) {
        i++;
        if (textArr[j].startsWith("```")) {
          i++;
          break;
        }
      }
    }
    // 清除 ~ 和 *
    let titleStr = textArr[i];
    titleStr = titleStr.replaceAll('*', '');
    titleStr = titleStr.replaceAll('~', '');
    // 添加索引 好大一坨屎山
    if (titleStr.startsWith("# ")) {
      res.push({title: textArr[i].substring(2), children: null});
    } else if (titleStr.startsWith("## ")) {
      setChildren(res, 1, {title: titleStr.substring(3), children: null});
    } else if (titleStr.startsWith("### ")) {
      setChildren(res, 2, {title: titleStr.substring(4), children: null});
    } else if (titleStr.startsWith("#### ")) {
      setChildren(res, 3, {title: titleStr.substring(5), children: null});
    } else if (titleStr.startsWith("##### ")) {
      setChildren(res, 4, {title: titleStr.substring(6), children: null});
    } else if (titleStr.startsWith("###### ")) {
      setChildren(res, 5, {title: titleStr.substring(7), children: null});
    }
  }
  return res;
}

// 根据深度设置索引
function setChildren(res, deep, object) {
  let p = res;
  for (let i = 0; i < deep; i++) {
    if (p[p.length - 1].children === null) {
      p[p.length - 1].children = [];
    }
    p = p[p.length - 1].children;
  }
  p.push(object);
}
</script>

<style scoped>
.blog-container {
  overflow: hidden;
  position: absolute;
  left: 350px;
  width: 50%;
  padding-bottom: 30px;
  background-color: rgba(255, 255, 255, .3);
}

</style>
