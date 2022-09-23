<template>
  <q-uploader
    ref="uploader"
    label="上传文件"
    accept=".md"
    :factory="uploadFn"
    hide-upload-btn
    @finish="uploadDone = true"
    @uploaded="uploadFinish"
    multiple
  />
</template>

<script setup>

// 批量提交工厂
import {ServerName} from "../../components/models";
import {ref} from "vue";

const mdsUploadUrl = ref("/blog/uploads") // 批量上传地址

// 上传工厂函数
function uploadFn() {
  return new Promise(resolve => {
    resolve({
      "url": ServerName + mdsUploadUrl.value,
      "fieldName": "files",
      "headers": [{
        "name": "token",
        "value": localStorage.getItem("token")
      }]
    })
  })
}

</script>

<style scoped>

</style>
