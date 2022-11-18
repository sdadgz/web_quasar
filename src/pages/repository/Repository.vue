<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <div class="row q-pa-md q-gutter-md">
      <!--   上传器   -->
      <div class="col-auto">
        <q-uploader
          ref="uploader"
          label="上传文件"
          :factory="uploadFn"
          @finish="uploadDone = true"
          @uploaded="uploadFinish"
          multiple
        />
      </div>

      <!--   跳转至   -->
      <div class="col-auto">
        <q-btn label="跳转至sdadgz的仓库" color="blue" @click="()=>$router.push('/repository/sdadgz')"/>
      </div>
    </div>

    <q-infinite-scroll
      ref="scrollRef"
      :offset="1080"
      :disable="fileDisable"
      @load="onLoad"
    >
      <!--   空提示   -->
      <div
        style="text-align: center"
        v-if="fileArr.length === 0"
      >
        向下滑动查看文件
      </div>

      <div class="q-pa-md">
        <q-list
          style="background-color: rgba(255,255,255,.3)"
          bordered
          separator
        >
          <q-item
            class="row"
            v-for="file in fileArr"
            clickable
          >
            <!--      文件名      -->
            <q-item-section
              class="col"
              style="color: #018EE8"
              @click="downloadHandler(file)"
            >
              {{ file.originalFilename }}
            </q-item-section>

            <!--      日期      -->
            <q-item-section
              class="col-auto desktop-only"
              @click="downloadHandler(file)"
            >
              {{ setTime(file.createTime) }}
            </q-item-section>

            <!--      复制链接      -->
            <q-item-section class="col-auto">
              <q-btn
                :label="$q.platform.is.desktop ? '点我复制分享链接' : ''"
                color="blue-14"
                icon="content_copy"
                @click="copyUrlHandler(file.url)"
              />
            </q-item-section>

            <!--      恢复和删除      -->
            <q-item-section
              class="col-auto desktop-only"
              v-if="!file.isDelete"
            >
              <q-btn
                color="red"
                icon="delete_forever"
                label="删除"
                @click="deleteHandler(file)"
              />
            </q-item-section>
            <q-item-section
              class="col-auto desktop-only"
              v-else
            >
              <q-btn
                color="secondary"
                icon="restore_page"
                label="恢复文件"
                @click="reHandler(file)"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div
          style="text-align: center;margin-top: 233px"
          v-if="fileDisable"
        >
          没有更多了
        </div>
      </div>

      <!--   底部加载   -->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px"/>
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup>

// 批量提交工厂
import {FILE_PAGE_SIZE, ServerName} from "../../components/models";
import {ref, watch} from "vue";
import Header from "../../components/public/Header.vue";
import {CommFail, CommSeccess} from "../../components/notifyTools";
import {useRoute, useRouter} from "vue-router";
import {api} from "../../boot/axios";
import {setTime} from "../../components/TimeUtil";
import {TITLE} from "../../components/StringTool";
import {useMeta} from "quasar";

const $router = useRouter();
const $route = useRoute();

const title = ref(TITLE);

// 复制
function copyUrlHandler(url) {
  navigator.clipboard.writeText(url).then(() => {
    CommSeccess("复制成功");
  })
}

// 弹窗
const dialogShow = ref(false);

// 上传
const uploadUrl = ref("/file/upload") // 批量上传地址
const uploadDone = ref(false);

// 无限滚动
const fileDisable = ref(false);
const fileArr = ref([]);
const username = ref($route.params.username);
const pageSize = ref(FILE_PAGE_SIZE);
const pageCount = ref(1);
const scrollRef = ref(null);

// 刷新
function refresh() {
  fileArr.value = [];
  fileDisable.value = false;
  scrollRef.value.reset();
  username.value = $route.params.username;
}

// 下载文件
function downloadHandler(file) {
  window.open(file.url);
}

// 恢复文件
async function reHandler(file) {
  await api.put("/file/update", {
    "id": file.id,
    "isDelete": false
  }).then(res => {
    CommSeccess("修改成功");
  }).catch(res => {
    CommFail("修改失败");
  })

  await refresh();
}

// 删除
async function deleteHandler(file) {

  await api.delete("/file", {
    params: {
      "id": file.id
    }
  }).then(res => {
    if (res.code === "200") {
      CommSeccess("删除成功");
    } else {
      CommFail("删除失败");
    }
  }).catch(res => {
    CommFail(res.msg);
  })

  // 重置
  await refresh();
}

// 加载
async function onLoad(index, done) {

  // 超过限度
  if (index > pageCount.value) {
    fileDisable.value = true;
    done();
    return;
  }

  await api.get("/file/" + username.value + "/page", {
    params: {
      "currentPage": index,
      "pageSize": pageSize.value
    }
  }).then(res => {

    // 分页上限
    pageCount.value =
      Math.ceil(res.data.total / pageSize.value) === 0 ? 1 : Math.ceil(res.data.total / pageSize.value);

    // 仍里头
    fileArr.value.push(...res.data.lists);
  }).catch(res => {
    CommFail(res.msg);
  })

  done();
}

// 上传工厂函数
function uploadFn() {
  return new Promise(resolve => {
    resolve({
      "url": ServerName + uploadUrl.value,
      "fieldName": "file",
      "headers": [{
        "name": "token",
        "value": localStorage.getItem("token")
      }]
    })
  })
}

// 图片上传之后
function uploadFinish(info) {
  const res = JSON.parse(info.xhr.response);
  if (res.code === '499') { // 未登录
    CommFail("未登录");
    $router.push("/user/login");
  } else if (res.code !== '200') { // 出现异常
    CommFail(res.msg);
    dialogShow.value = false;
  } else {
    // 正常处理
    // imgInfo.value = res.data.id;
    CommSeccess("上传成功");
  }

  // 刷新
  refresh();
}

useMeta({
  title: title.value,
  titleTemplate: title => `${username.value}的个人仓库 | ${title}`,
  meta: {
    description: {name: 'description', content: `${username.value}的个人仓库`},
  }
})

watch(() => $route.fullPath, () => {
  refresh();
})
</script>

<style scoped>

</style>
