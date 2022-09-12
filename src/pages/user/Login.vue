<template>

  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed;z-index: -1"/>

  <div class="q-pa-md">
    <div class="column justify-center" style="height: 90vh;">
      <div class="col-auto row justify-center">
        <q-card class="col-auto shadow-10" style="background-color: rgb(255,255,255);padding: 50px;width: 400px">
          <q-card-section>{{ pageTitle }}</q-card-section>

          <q-card-section>
            <q-input
              rounded
              v-model="usernameR" label="用户名" :lazy-rules="true"
              :rules="[(val) => (val.length > 0) || '输入值为空']"
            />
          </q-card-section>

          <q-card-section>
            <q-input
              rounded v-model="passwordR" label="密码" lazy-rules
              :rules="[(val) => (val && val.length > 0) || '输入值为空']"
              type="password"
            />
          </q-card-section>

          <q-slide-transition>
            <q-card-section v-if="registerR">
              <q-input
                rounded v-model="conformR" label="确认密码" lazy-rules
                :rules="[(val) => ( val && val === passwordR && val.length > 0) || '两次输入密码不一致']"
                type="password"
              />
            </q-card-section>
          </q-slide-transition>

          <q-card-section>
            <q-btn-group>
              <q-btn @click="registerR = !registerR;switchLabel()" color="secondary" :label="first"/>
              <q-btn @click="handlerLogin" color="primary" style="width: 205px;" :label="second"/>
            </q-btn-group>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

</template>

<script setup>

import {ref} from "vue";
import {useQuasar} from "quasar";
import {api} from "../../boot/axios";
import {CommFail, CommSeccess} from "../../components/notifyTools";
import {useRouter} from "vue-router";

const $q = useQuasar();
const $router = useRouter();

const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const pageTitle = ref('登录');
const usernameR = ref('');
const passwordR = ref('');
const conformR = ref();
const registerR = ref(false);
const first = ref("注册");
const second = ref("登录");

start();

function start() {
  const username = localStorage.getItem("username");
  if (username != null) {
    usernameR.value = username;
  }
}

// 登录和注册切换
function switchLabel() {
  const temp = first.value;
  first.value = second.value;
  second.value = temp;
  passwordR.value = "";
  conformR.value = "";
}

// 重置输入框
function clearAll() {
  usernameR.value = "";
  passwordR.value = "";
  conformR.value = "";
}

// 点击右侧 登录/注册 按钮
function handlerLogin() {
  localStorage.clear();
  if (second.value === '登录' && loginRule()) { // 登录
    api.post("/user/login", {
      "name": usernameR.value,
      "password": passwordR.value
    }).then(res => {
      if (res.code === "200") {
        setUserInfo(res.data);
        CommSeccess("登录成功");
      }
    })
  } else if (second.value === '注册' && regRule()) { // 注册
    register(usernameR.value);
  }
}

// 从本地获取用户基本信息
function setUserInfo(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.user.name);
  localStorage.setItem("avatar", data.user.avatar);
  $router.push("/");
}

// 登录请求限制
function loginRule() {
  return !(usernameR.value === '' || passwordR.value === '');
}

// 注册请求限制
function regRule() {
  return (loginRule() && passwordR.value === conformR.value);
}

// 注册
async function register(val) {
  const nameE = await api.get("/user", {
    params: {
      "username": val
    }
  }).then(res => {
    return res.data;
  });
  if (!nameE) {
    await api.post("/user", {
      "name": usernameR.value,
      "password": passwordR.value
    }).then(res => {
        setUserInfo(res.data);
        CommSeccess("注册成功");
    })
  } else {
    clearAll();
    CommFail("用户名已被占用");
  }
}

</script>


<style scoped>

</style>
