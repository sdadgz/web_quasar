<template>

  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <q-uploader
      ref="uploader"
      label="上传文件"
      :factory="uploadFn"
      @finish="uploadDone = true"
      @uploaded="uploadFinish"
      multiple
    />

    <q-infinite-scroll @load="onLoad" :offset="250" :disable="fileDisable" ref="scrollRef">
      <div v-if="fileArr.length === 0" style="text-align: center">
        还没有上传的文件
      </div>

      <div class="q-pa-md">
        <q-list bordered separator style="background-color: rgba(255,255,255,.3)">
          <q-item clickable v-ripple v-for="file in fileArr">
            <q-item-section @click="downloadHandler(file)" style="color: #018EE8">
              {{ file.originalFilename }}
            </q-item-section>
            <q-item-section v-if="!file.isDelete" style="max-width: 250px">
              <q-btn color="red" icon="delete_forever" label="删除" @click="deleteHandler(file)"/>
            </q-item-section>
            <q-item-section v-else style="max-width: 250px">
              <q-btn color="secondary" icon="restore_page" label="恢复文件" @click="reHandler(file)"/>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="fileDisable" style="text-align: center;margin-top: 233px">
          没有更多了
        </div>

      </div>
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
import {ref} from "vue";
import Header from "../../components/public/Header.vue";
import {CommFail, CommSeccess} from "../../components/notifyTools";
import {useRouter} from "vue-router";
import {api} from "../../boot/axios";

const $router = useRouter();

// 弹窗
const dialogShow = ref(false);

// 上传
const uploadUrl = ref("/file/upload") // 批量上传地址
const uploadDone = ref(false);

// 无限滚动
const fileDisable = ref(false);
const fileArr = ref([]);
const username = ref(localStorage.getItem("username"));
const pageSize = ref(FILE_PAGE_SIZE);
const pageCount = ref(1);
const scrollRef = ref(null);

// 刷新
function refresh() {
  fileArr.value = [];
  fileDisable.value = false;
  scrollRef.value.reset();
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
    pageCount.value = Math.ceil(res.data.total / pageSize.value) === 0 ? 1 : Math.ceil(res.data.total / pageSize.value);

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

</script>

<style scoped>

</style>
