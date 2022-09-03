<template>
  <div class="header row items-center justify-end">

    <q-btn flat class="barBtn a" label="home" @click="goHome" style="position: absolute;left: 5%" icon="home"/>

    <q-btn flat class="barBtn a" :label="username" @click="gotoUser"/>


    <q-avatar  class="a" style="height: 46px;width: 46px;margin-right: 1%" @click="gotoUser" :icon="useIcon ? 'account_circle' : ''">
      <img v-if="!useIcon" :src="avatar" alt="地址错误" style="position: absolute;top: 0"/>
    </q-avatar>

    <q-btn class="barBtn a" flat dense label="上传" style="margin-right: 1%" @click="gotoUser" icon="upgrade"/>
    <q-btn class="barBtn a" flat dense label="退出登录" style="margin-right: 1%" @click="logout"/>
  </div>
</template>

<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";

const $router = useRouter();

const username = ref("未登录");
const avatar = ref();
const useIcon = ref(true);

start();

function gotoUser() {
  if (username.value !== "未登录") {
    $router.push("/user/" + username.value);
  } else {
    $router.push("/user/login");
  }

}

function goHome() {
  $router.push("/");
}

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
}

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
