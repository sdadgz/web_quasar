<template>
  <div class="q-pa-md">
    <div class="column justify-center" style="height: 90vh;">
      <div class="col-auto row justify-center">
        <q-card class="col-auto shadow-10" style="background-color: rgb(255,255,255);padding: 50px;width: 400px">
          <q-card-section class="row justify-between">
            <strong>{{ pageTitle }}</strong>
            <q-btn icon="close" dense rounded flat to="/"/>
          </q-card-section>

          <!--     用户名     -->
          <q-card-section>
            <q-input
              v-model="usernameR"
              ref="usernameRef"
              rounded
              label="用户名"
              :lazy-rules="true"
              :rules="[(val) => (val.length > 0) || '输入值为空']"
              @keyup.enter="usernameHandler"
            />
          </q-card-section>

          <!--     密码     -->
          <q-card-section>
            <q-input rounded
                     ref="passwordRef"
                     v-model="passwordR"
                     label="密码"
                     lazy-rules
                     :rules="[(val) => (val && val.length > 0) || '输入值为空']"
                     @keyup.enter="passwordHandler"
                     type="password"
            />
          </q-card-section>

          <!--     确认密码     -->
          <q-slide-transition>
            <q-card-section v-if="registerR">
              <q-input rounded
                       v-model="conformR"
                       label="确认密码"
                       ref="passwordConformRef"
                       @keyup.enter="passwordConformHandler"
                       lazy-rules
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

  <!-- 弹窗 -->
  <q-dialog v-model="announcement" persistent>
    <q-card>
      <!--   头   -->
      <q-card-section class="row items-center">
        <q-avatar icon="campaign" text-color="primary" size="50px"/>
        <span class="q-ml-sm text-h6">公告</span>
      </q-card-section>

      <!--   内容   -->
      <q-card-section>
        <div style="font-size: 16px;padding: 10px">
          自11月9日起所有密码重置为123456，后台整改为储存加密后密码防止密码泄露。
        </div>
      </q-card-section>

      <!--   脚   -->
      <q-card-actions align="between" class="q-pa-md">
        <q-checkbox v-model="checkbox" label="不再提示"/>
        <q-btn flat label="关闭" color="primary" v-close-popup @click="dialogHandler"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import {ref} from "vue";
import {useMeta, useQuasar} from "quasar";
import {api} from "../../boot/axios";
import {CommFail, CommSuccess} from "../../components/notifyTools";
import {useRouter} from "vue-router";
import {TITLE, TRUE} from "../../components/StringTool";
import {ServerName} from "../../components/models";

const $q = useQuasar();
const $router = useRouter();

const title = ref(TITLE);

useMeta({
  title: title.value,
  titleTemplate: title => `${title} | 登录页`,
  meta: {
    description: {name: 'description', content: `平平无奇的登录页`},
  }
})

// 弹窗控制
const announcement = ref(true);

// 弹窗内复选框
const checkbox = ref(false);

// 关闭弹窗
function dialogHandler() {
  if (checkbox.value) {
    localStorage.setItem("announcement", TRUE);
  }
}

// ref
const usernameRef = ref(null);
const passwordRef = ref(null);
const passwordConformRef = ref(null);

// 用户名控制
function usernameHandler() {
  passwordRef.value.focus();
}

// 密码控制
function passwordHandler() {
  if (registerR.value) {
    passwordConformRef.value.focus();
  } else {
    handlerLogin();
  }
}

// 确认密码控制
function passwordConformHandler() {
  handlerLogin();
}

const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const pageTitle = ref('登录');
const usernameR = ref('');
const passwordR = ref('');
const conformR = ref();
const registerR = ref(false);
const first = ref("注册");
const second = ref("登录");

function start() {
  const anno = localStorage.getItem("announcement");
  if (anno && anno === TRUE) {
    announcement.value = false;
  }
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
        CommSuccess("登录成功");
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
  localStorage.setItem("avatar", ServerName + data.user.avatar);
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
      CommSuccess("注册成功");
    })
  } else {
    clearAll();
    CommFail("用户名已被占用");
  }
}

start();
</script>


<style scoped>

</style>
