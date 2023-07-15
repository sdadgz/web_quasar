<template>
  <div class="header row items-center justify-end">
    <!--  主页  -->
    <q-btn
      flat class="barBtn a"
      label="home"
      style="position: absolute;left: 5%"
      icon="home"
      to="/"
    />

    <!--  去静态资源下载页  -->
    <q-btn
      flat
      class="barBtn a"
      label="download"
      href="https://sdadgz.cn/download"
    />

    <!--  repository  -->
    <q-btn
      flat
      class="barBtn a"
      label="repository"
      :to="(username === '未登录' ? '/repository/sdadgz' : `/repository/${username}`)"
    />

    <!--  用户名  -->
    <q-btn
      flat
      class="barBtn a desktop-only"
      :label="username"
      :to="(username === '未登录' ? '/user/login' : `/user/${username}`)"
    />

    <!--  头像  -->
    <q-avatar
      class="a"
      style="height: 46px;width: 46px;margin-right: 1%"
      @click="gotoUser"
      :icon="useIcon ? 'account_circle' : ''"
    >
      <img
        v-if="!useIcon"
        :src="avatar"
        alt="地址错误"
        style="position: absolute;top: 0"
      />
    </q-avatar>

    <!--  上传  -->
    <q-btn
      class="barBtn a desktop-only"
      flat
      dense
      label="上传"
      style="margin-right: 1%"
      :to="(username === '未登录' ? '/user/login' : `/user/${username}`)"
      icon="upgrade"
    />

    <!--  登出  -->
    <q-btn
      class="barBtn a"
      icon="logout"
      flat
      dense
      label="退出登录"
      style="margin-right: 1%"
      @click="logout"
    />
  </div>

  <!--  banner  -->
  <q-card v-if="showBanner">
    <q-img :src="banner"/>
  </q-card>
</template>

<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";
import {api} from "../../boot/axios";
import {sleep} from "../Common.js";
import {random} from "../MathTool.js";
import {ServerName} from "components/models";

// 去静态资源下载页
function gotoDownload() {
  // dom
  window.location.href = '/download';
}

const props = defineProps(['closeBanner']);
const showBanner = ref(!props.closeBanner);

const $router = useRouter();

const username = ref("未登录");
const avatar = ref();
const useIcon = ref(true);

const banner = ref("https://sdadgz.cn/download/img/1.png");
const bannerArr = ref([]);

start();
setUrl();

// 去私人仓库
function gotoRepository() {
  if (username.value !== "未登录") {
    $router.push("/repository/" + username.value);
  } else {
    $router.push("/repository/sdadgz");
  }
}

// 获取banner
async function getBanner() {
  let urlUserName = username.value;
  // 设置用户名
  if (urlUserName === '未登录') {
    urlUserName = 'sdadgz';
  }
  // 获取banner
  await api.get("/img/" + urlUserName + "/banner").then(res => {

    // url改造
    for (let item of res.data) {
      item.url = ServerName + item.url;
    }

    bannerArr.value = res.data;
  })
}

async function setUrl() {
  while (true) {
    await sleep(233);
    if (bannerArr.value.length > 0) {
      const bound = bannerArr.value.length;
      const rand = random(bound);
      banner.value = bannerArr.value[rand].url;
      await sleep(3 * 60 * 1000);
    }
  }
}

// 去用户主页
function gotoUser() {
  if (username.value !== "未登录") {
    $router.push("/user/" + username.value);
  } else {
    $router.push("/user/login");
  }
}

// 欢迎回家
function goHome() {
  $router.push("/");
}

// 初始化
function start() {
  const localUsername = localStorage.getItem("username");
  const localAvatar = localStorage.getItem("avatar");
  // 获取用户名
  if (localUsername !== null) {
    username.value = localUsername;
  }
  // 获取头像
  if (localAvatar !== null) {
    avatar.value = localAvatar;
    useIcon.value = false;
  }
  // 设置背景图
  getBanner();
}

// 登出
function logout() {
  localStorage.clear();
  $router.push("/user/login");
}

</script>

<style scoped>

.barBtn {
  margin-right: 2%;
  min-width: 100px;
}

.a {
  transition: .35s ease-in-out;
}

.a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ec85a7;
}

.header {
  width: 99.5%;
  background-color: rgba(124, 151, 189, .5);
  padding: 10px 0;
  margin-right: 1%;
  border-radius: 10px;
}

</style>
