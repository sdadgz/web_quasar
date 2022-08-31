<template>
  <q-img :src="backgroundImg" style="width: 101%;height: 101%;position: fixed"/>

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
      <BlogContent :textArr="textArr"/>
    </q-card>

  </div>
</template>

<script setup>
import {ref} from "vue";
import {blogIndexDefault} from "components/models";
import LeftIndex from "../../components/blog/LeftIndex.vue";
import BlogContent from "../../components/blog/BlogContent.vue";
import {useRouter} from "vue-router";
import {api} from "boot/axios";
import {LoadingFail, LoadingNotify, LoadingSucceed} from "components/notifyTools";

// banner
let backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const $router = useRouter();
let blogIndex = ref([]);
let textArr = ref([]);
let blogTextShow = ref(false);

blogIndex.value = blogIndexDefault.value;
getBlog();

function getBlog() {
  const not = LoadingNotify();
  // 首位是空字符，用逻辑索引
  let strArr = $router.currentRoute.value.path.split('/');
  const username = strArr[2];
  const title = strArr[4];
  api.get("/blog/" + username + "/blog/" + title).then(res => {
    LoadingSucceed(not);
    const str = res.data.data.text;
    textArr.value = str.split("\n");
    blogIndex.value = produceIndex(textArr.value);
    blogTextShow = true;
  }).catch(() => {
    LoadingFail(not);
  })
}

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
