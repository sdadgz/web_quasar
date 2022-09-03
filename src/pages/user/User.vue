<template>

  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed;z-index: -1"/>

  <div class="q-pa-md q-gutter-sm">

    <Header/>

    <q-card>
      <q-img
        :src="backgroundImg"
      />
    </q-card>

    <q-card style="background-color: rgba(255,255,255,.5)">
      <div style="padding: 10px">
        <q-btn class="user-btn" icon="replay" color="primary" @click="refreshBtn" :loading="btnLoading" label="刷新"/>
        <q-btn class="user-btn" icon="add_circle_outline" @click="addTable" color="secondary" label="新增"/>
        <q-btn class="user-btn" icon="edit" color="purple" label="修改"/>
        <q-btn class="user-btn" icon="delete_forever" color="red" label="删除"/>
      </div>

      <q-table
        style="background-color: rgba(236,133,167,0.28)"
        :columns="columns"
        :rows="rows"
        row-key="title"
        hide-pagination
        selection="multiple"
        v-model:selected="selected"
        :selected-rows-label="getSelectedString"
        :loading="tableLoading"
      >
      </q-table>
    </q-card>

    <!--  弹出对话窗  -->
    <q-dialog v-model="dialogShow">
      <q-card class="column" style="width: 460px;padding: 33px 50px">
        <q-scroll-area style="height: 90vh">

          <q-card-section class="row justify-between">
            <div class="text-h6">
              {{ dialogText }}
            </div>
            <q-btn icon="close" flat round dense v-close-popup/>
          </q-card-section>

          <q-card-section>
            <q-input
              v-model="titleI"
              :rules="[ val => val && val.length > 0 || '输入值为空']"
              label="标题"
            />
          </q-card-section>

          <q-card-section>
            <q-input
              v-model="detailI"
              label="简介"
            />
          </q-card-section>

          <q-card-section>
            <q-toggle v-model="imgUseId" label="使用已经上传的图片id代替上传图片"/>
          </q-card-section>

          <q-slide-transition>
            <q-card-section v-if="imgUseId">
              <q-input v-model="imgI" label="图片id" type="number" :rules="[ val => val && val.length > 0 || '输入值为空']"/>
            </q-card-section>

            <q-card-section v-else>
              <q-uploader label="上传图片" accept=".jpg, image/*"/>
            </q-card-section>
          </q-slide-transition>

          <q-card-section>
            <q-uploader label="上传笔记" accept=".md"/>
          </q-card-section>

          <q-card-section class="row justify-between">
            <q-btn label="重置"/>
            <q-btn label="提交" color="primary"/>
          </q-card-section>


        </q-scroll-area>
      </q-card>
    </q-dialog>

    <div style="width: 1px;height: 233px"/>


  </div>

</template>

<script setup>

import {ref} from "vue";
import Header from "../../components/public/Header.vue";
import {LoadingFail, LoadingNotify, LoadingSucceed} from "../../components/notifyTools";
import {api} from "../../boot/axios";
import {useRouter} from "vue-router";
import {blogColumns} from "../../components/user/Table";

const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const $router = useRouter();

const blogs = ref([]);
const columns = ref([]);
const rows = ref([]);
const selected = ref([]);
const tableLoading = ref(true);
const btnLoading = ref(false);
const dialogShow = ref(false);
const dialogText = ref();
const titleI = ref();
const detailI = ref();
const imgUseId = ref(false);
const imgI = ref();

start();

function start() {
  loadBlogs();
}

// 加载blogs
function loadBlogs() {
  const loadNot = LoadingNotify();
  rows.value = [];
  columns.value = [];
  tableLoading.value = true;

  // 获取本地用户名
  let username = localStorage.getItem("username");
  if (username == null) {
    return;
  }

  api.get("/blog/" + username + "/blogs").then(res => {
    if (res.code === "200") {
      LoadingSucceed(loadNot);
      blogs.value = res.data;

      columns.value = blogColumns;

      for (let i = 0; i < res.data.length; i++) {
        let obj = {};
        for (let j = 0; j < blogColumns.length; j++) {
          Object.assign(obj, {[`${blogColumns[j].field}`]: eval("res.data[i]." + `${blogColumns[j].field}`)});
        }
        rows.value.push(obj);
      }

      tableLoading.value = false;
    } else {
      LoadingFail(loadNot);
    }
  }).catch(() => {
    LoadingFail(loadNot);
  })
}

// 刷新按钮
function refreshBtn() {
  btnLoading.value = true;
  loadBlogs();
  btnLoading.value = false;
}

// 新增按钮
function addTable() {
  dialogShow.value = true;
  dialogText.value = '新增';
}

// 已选几项
function getSelectedString() {
  return selected.value.length === 0 ? '' : `已选择${selected.value.length}项`;
}

</script>

<style scoped>

.user-btn {
  margin: 0 10px;
  min-width: 100px;
}

</style>
