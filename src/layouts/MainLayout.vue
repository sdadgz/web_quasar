<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <!--   背景图片   -->
      <BackgroundImg/>

      <router-view/>
    </q-page-container>

    <q-footer reveal style="background-color: unset">
      <!--   备案信息   -->
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <a style="color: #1D1D1D;text-decoration: none"
             href="https://beian.miit.gov.cn/"
             target="_blank">
            京ICP备2022019075号-1
          </a>
        </div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup>

import BackgroundImg from "components/public/BackgroundImg.vue";
import {useMeta} from "quasar";
import {GENERAL_TIME, TITLE, TOKEN} from "../components/StringTool";
import {CommWarn} from "../components/notifyTools";
import {getTimeNow, isTimeout} from "../components/TimeUtil";
import {getUserToken} from "../api/user";

useMeta({
  title: TITLE,
  meta: {
    keywords: {
      name: 'keywords',
      content: 'blog,博客,二次元,个人网页,编程,私人网盘,网盘，原神,崩坏3,网盘,崩坏,三脚猫的功夫'
    },
  },
})

// 更新token api
function refreshTokenApi() {
  getUserToken().then(res => {
    if (res && res.code === "200") {
      const token = res.data;
      localStorage.setItem(TOKEN, token);
      localStorage.setItem(GENERAL_TIME, getTimeNow().toString());
    } else {
      CommWarn(res.msg);
    }
  }).catch(res => {
    CommWarn(res.msg);
  })
}

// token是否过期
function tokenTimeout() {
  let time = localStorage.getItem(GENERAL_TIME);

  if (!time) {
    // 时间不存在，创建时间
    localStorage.setItem(GENERAL_TIME, getTimeNow().toString());
  } else {
    // 时间存在，检测是否超时
    time = Number.parseInt(time);
    if (isTimeout(time)) {
      // 到点了，免费续费token
      refreshTokenApi();
    }
  }
}

function start() {
  tokenTimeout();
}

start();
</script>

<style>

body {
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #018EE8;
}
</style>
