<template>
  <!-- 桌面独享 -->
  <div class="q-pa-md q-gutter-sm desktop-only">
    <!--    左侧栏     -->
    <q-scroll-area style="position: fixed;width: 350px;height: 93%"
                   :visible="false"
                   :delay="233">
      <q-card style="width: 90%; background-color: rgba(255,255,255,.3)">
        <template v-for="item in blogIndex">
          <LeftIndex :blogIndex="item"/>
        </template>
      </q-card>
    </q-scroll-area>

    <!--   博客    -->
    <q-card class="blog-container shadow-10">
      <q-card-section style="font-size: 2em">
        {{ blogTitle }}
      </q-card-section>
      <q-img :src="blogBanner" style="margin-bottom: 66px"/>
      <!--      <BlogContent v-if="blogDone" :textArr="textArr"/>-->

      <template v-if="blogDone">
        <template v-for="index in textArr.length">
          <!--    标题-->
          <template v-if="/*passF(index - 1)*/textType[index - 1] === -2"></template>
          <template v-else-if="textType[index - 1] === 0">
            <div
              :id="getIndex(textArr[index - 1].substring(2))"
              class="_h blog-h1"
            >
              <Special :text="textArr[index - 1].substring(2)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 1">
            <div
              class="_h blog-h2"
              :id="getIndex(textArr[index - 1].substring(3))"
            >
              <Special :text="textArr[index - 1].substring(3)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 2">
            <div
              class="_h blog-h3"
              :id="getIndex(textArr[index - 1].substring(4))"
            >
              <Special :text="textArr[index - 1].substring(4)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 3">
            <div
              class="_h blog-h4"
              :id="getIndex(textArr[index - 1].substring(5))"
            >
              <Special :text="textArr[index - 1].substring(5)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 4">
            <div
              class="_h blog-h5"
              :id="getIndex(textArr[index - 1].substring(6))"
            >
              <Special :text="textArr[index - 1].substring(6)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 5">
            <div
              class="_h blog-h6"
              :id="getIndex(textArr[index - 1].substring(7))"
            >
              <Special :text="textArr[index - 1].substring(7)"/>
            </div>
          </template>

          <!--    引用-->
          <template v-else-if="textType[index - 1] === 6">
            <div class="_base _cite">
              {{ textArr[index - 1].substring(2) }}
            </div>
          </template>
          <!--    分割线-->
          <template v-else-if="textType[index - 1] === 7">
            <div class="_base _h" style="border-color: #ec85a7;border-width: 2px;height: 20px"></div>
          </template>
          <!--    图片-->
          <template v-else-if="textType[index - 1] === 8">
            <div style="overflow: hidden">
              <q-img
                class="img-to-big"
                :src="textArr[index - 1].substring(textArr[index - 1].indexOf('(') + 1,textArr[index - 1].lastIndexOf(')'))"
                :alt="textArr[index - 1].substring(textArr[index - 1].indexOf('[') + 1,textArr[index - 1].lastIndexOf(']'))"
              />
            </div>
          </template>
          <!--    超链接-->
          <template v-else-if="textType[index - 1] === 9">
            <a
              class="_base blog-link"
              :href="textArr[index - 1].substring(textArr[index - 1].indexOf('(') + 1,textArr[index - 1].lastIndexOf(')'))"
              target="_blank"
            >
              {{
                textArr[index - 1].substring(textArr[index - 1].indexOf('[') + 1, textArr[index - 1].lastIndexOf(']'))
              }}
            </a>
          </template>
          <!--    列表-->
          <template v-else-if="textType[index - 1] === 10">
            <Special :text="textArr[index - 1]"/>
          </template>
          <!--    无序列表-->
          <template v-else-if="textType[index - 1] === 11">
            <Special :text="textArr[index - 1]"/>
          </template>
          <!--    表格-->
          <template v-else-if="textType[index - 1] === 12">
            <Table :index="index - 1" :textArr="textArr" :colm="passArr[index - 1]"/>
          </template>
          <!--    代码块-->
          <template v-else-if="textType[index - 1] === 13">
            <!--      <CodeField :index="index-1" :textArr="textArr" :colm="tableC"/>-->
            <div class="column _base code-field" style="border-radius: 6px;padding: 10px">
              <div v-for="i in passArr[index - 1] - 1">
                <div class="row justify-start">
                  <template v-for="dontUse in spaseF(textArr[index + i - 1])">
                    <span class="col-auto" style="width: 5px;"/>
                  </template>
                  <!--            <CodeStyle :type="textArr[index-1].substring(3)" :text="textArr[index + i - 1]"/>-->
                  <span class="col-auto">{{ textArr[index + i - 1] }}</span>
                </div>
              </div>
            </div>
          </template>
          <!--    缺省-->
          <template v-else>
            <div class="_base">
              <Special :text="textArr[index - 1]"/>
            </div>
          </template>

        </template>
      </template>

    </q-card>

    <!--  右侧  -->
    <div class="row justify-end items-center" style="position: fixed;right: 2%;width: 50%">

      <q-btn flat class="barBtn a col-auto" label="home" @click="goHome" icon="home"/>

      <q-avatar
        class="a col-auto"
        style="height: 46px;width: 46px"
        @click="gotoUser"
        :icon="useIcon ? 'account_circle' : ''"
      >
        <img v-if="!useIcon" :src="avatar" alt="地址错误" style="position: absolute;top: 0"/>
      </q-avatar>
    </div>
  </div>

  <!-- 手机独享 -->
  <div class="q-pa-md q-gutter-md mobile-only">
    <!--  头  -->
    <Header :close-banner="true"/>

    <!--   博客    -->
    <q-card
      class="shadow-10"
      style="background-color: rgba(255,255,255,.3)"
    >
      <q-card-section style="font-size: 2em">
        {{ blogTitle }}
      </q-card-section>
      <q-img :src="blogBanner" style="margin-bottom: 66px"/>
      <!--      <BlogContent v-if="blogDone" :textArr="textArr"/>-->

      <template v-if="blogDone">
        <template v-for="index in textArr.length">
          <!--    标题-->
          <template v-if="/*passF(index - 1)*/textType[index - 1] === -2"></template>
          <template v-else-if="textType[index - 1] === 0">
            <div
              :id="getIndex(textArr[index - 1].substring(2))"
              class="_h blog-h1"
            >
              <Special :text="textArr[index - 1].substring(2)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 1">
            <div
              class="_h blog-h2"
              :id="getIndex(textArr[index - 1].substring(3))"
            >
              <Special :text="textArr[index - 1].substring(3)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 2">
            <div
              class="_h blog-h3"
              :id="getIndex(textArr[index - 1].substring(4))"
            >
              <Special :text="textArr[index - 1].substring(4)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 3">
            <div
              class="_h blog-h4"
              :id="getIndex(textArr[index - 1].substring(5))"
            >
              <Special :text="textArr[index - 1].substring(5)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 4">
            <div
              class="_h blog-h5"
              :id="getIndex(textArr[index - 1].substring(6))"
            >
              <Special :text="textArr[index - 1].substring(6)"/>
            </div>
          </template>
          <template v-else-if="textType[index - 1] === 5">
            <div
              class="_h blog-h6"
              :id="getIndex(textArr[index - 1].substring(7))"
            >
              <Special :text="textArr[index - 1].substring(7)"/>
            </div>
          </template>

          <!--    引用-->
          <template v-else-if="textType[index - 1] === 6">
            <div class="_base _cite">
              {{ textArr[index - 1].substring(2) }}
            </div>
          </template>
          <!--    分割线-->
          <template v-else-if="textType[index - 1] === 7">
            <div class="_base _h" style="border-color: #ec85a7;border-width: 2px;height: 20px"></div>
          </template>
          <!--    图片-->
          <template v-else-if="textType[index - 1] === 8">
            <div style="overflow: hidden">
              <q-img
                class="img-to-big"
                :src="textArr[index - 1].substring(textArr[index - 1].indexOf('(') + 1,textArr[index - 1].lastIndexOf(')'))"
                :alt="textArr[index - 1].substring(textArr[index - 1].indexOf('[') + 1,textArr[index - 1].lastIndexOf(']'))"
              />
            </div>
          </template>
          <!--    超链接-->
          <template v-else-if="textType[index - 1] === 9">
            <a
              class="_base blog-link"
              :href="textArr[index - 1].substring(textArr[index - 1].indexOf('(') + 1,textArr[index - 1].lastIndexOf(')'))"
              target="_blank"
            >
              {{
                textArr[index - 1].substring(textArr[index - 1].indexOf('[') + 1, textArr[index - 1].lastIndexOf(']'))
              }}
            </a>
          </template>
          <!--    列表-->
          <template v-else-if="textType[index - 1] === 10">
            <Special :text="textArr[index - 1]"/>
          </template>
          <!--    无序列表-->
          <template v-else-if="textType[index - 1] === 11">
            <Special :text="textArr[index - 1]"/>
          </template>
          <!--    表格-->
          <template v-else-if="textType[index - 1] === 12">
            <Table :index="index - 1" :textArr="textArr" :colm="passArr[index - 1]"/>
          </template>
          <!--    代码块-->
          <template v-else-if="textType[index - 1] === 13">
            <!--      <CodeField :index="index-1" :textArr="textArr" :colm="tableC"/>-->
            <div class="column _base code-field" style="border-radius: 6px;padding: 10px">
              <div v-for="i in passArr[index - 1] - 1">
                <div class="row justify-start">
                  <template v-for="dontUse in spaseF(textArr[index + i - 1])">
                    <span class="col-auto" style="width: 5px;"/>
                  </template>
                  <!--            <CodeStyle :type="textArr[index-1].substring(3)" :text="textArr[index + i - 1]"/>-->
                  <span class="col-auto">{{ textArr[index + i - 1] }}</span>
                </div>
              </div>
            </div>
          </template>
          <!--    缺省-->
          <template v-else>
            <div class="_base">
              <Special :text="textArr[index - 1]"/>
            </div>
          </template>

        </template>
      </template>

    </q-card>
  </div>
</template>

<script setup>

import {ref, watch} from "vue";
import LeftIndex from "../../components/blog/LeftIndex.vue";
import BlogContent from "../../components/blog/BlogContent.vue";
import {useRouter} from "vue-router";
import {api} from "../../boot/axios";
import {LoadingFail, LoadingNotify, LoadingSucceed} from "../../components/notifyTools";
import Special from "../../components/blog/Special.vue";
import Table from "../../components/blog/Table.vue";
import BackgroundImg from "../../components/public/BackgroundImg.vue";
import {useMeta} from "quasar";
import Header from "../../components/public/Header.vue";

// banner
const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const $router = useRouter();
const blogIndex = ref([]);
const textArr = ref([]);
const blogTitle = ref();
const blogTextShow = ref(false);
const avatar = ref(localStorage.getItem("avatar"));
const useIcon = ref(false);
const username = ref(localStorage.getItem("username"));

const blogDone = ref(false);

getBlog();
setUserInfo();

// 去递归-首位空格
function spaseF(t) {
  let add = 0;
  while (t.startsWith(" ")) {
    add++;
    t = t.substring(1);
  }
  return add;
}

// 监控
// watch(() => props.textArr, () => {
//   arrRef.value = props.textArr;
//   start();
// }, {immediate: true})

// 获取表情索引
function getIndex(str) {
  str = str.replaceAll("~", '');
  str = str.replaceAll("*", '');
  return str;
}

// 跳过渲染
function passF(index) {
  return index >= passIndex.value && index <= passIndex.value + tableC.value;
}

const passArr = ref([]);

// 什么类型的
function whatType(index) {
  const test = textArr.value[index];
  if (passF(index)) {
    return -2;
  }
  // 标题
  if (test.startsWith("# ")) {
    return 0;
  } else if (test.startsWith("## ")) {
    return 1;
  } else if (test.startsWith("### ")) {
    return 2;
  } else if (test.startsWith("#### ")) {
    return 3;
  } else if (test.startsWith("##### ")) {
    return 4;
  } else if (test.startsWith("###### ")) {
    return 5;
  } else
    // 引用
  if (test.startsWith("> ")) {
    return 6;
  } else
    // 分割线
  if ('------' === test || '---' === test || '***' === test) {
    return 7;
  } else
    // 图片
  if (test.startsWith("![")) {
    let temp = test.indexOf(']', 2);
    if (temp !== -1) {
      temp = test.indexOf('(', temp + 1);
      if (temp !== -1) {
        temp = test.indexOf(')', temp + 1);
        if (temp !== -1) {
          return 8;
        }
      }
    }
  } else
    // 超链接
  if (test.startsWith("[")) {
    let temp = test.indexOf(']', 1);
    if (temp !== -1) {
      temp = test.indexOf('(', temp + 1);
      if (temp !== -1) {
        temp = test.indexOf(')', temp + 1);
        if (temp !== -1) {
          return 9;
        }
      }
    }
  } else
    // 列表
  if (test.startsWith("1. ")) {
    return 10;
  } else
    // 无序列表
  if (test.startsWith("- ") || test.startsWith("* ")) {
    return 11;
  } else
    // 表格
  if (test.startsWith("| ") && isTable(index)) {
    return 12;
  } else
    // 代码块
  if (test.startsWith("```")) {
    passIndex.value = index;
    tableC.value = codeF(index);

    passArr.value[index] = tableC.value;
    return 13;
  }
  return -1;
}

function codeF(index) {
  let codeAdd = 1;
  while (index + codeAdd < textArr.value.length && textArr.value[index + codeAdd] !== '```') {
    codeAdd++;
  }
  return codeAdd;
}

const tableR = ref(-1);
const tableC = ref(-1);
const passIndex = ref(-1);

// 是不是表
function isTable(index) {
  let x = index;

  // 多少行
  let tableStr = textArr.value[x].split('|');
  const rows = tableStr.length - 2;
  if (!notLine(tableStr, rows)) {
    return false;
  }

  tableStr = textArr.value[x + 1].split('|');
  if (!notLine(tableStr, rows)) {
    return false;
  }
  // 判断分割线
  for (let i = 1; i < tableStr.length - 1; i++) {
    if (tableStr[i].indexOf('-') === -1) {
      return false;
    }
  }

  // 最后一次判断
  tableStr = textArr.value[x + 2].split('|');
  if (!notLine(tableStr, rows)) {
    return false;
  }

  // 赋值给表格行列长度
  tableR.value = rows;
  tableC.value = 3;

  for (let i = index + 3; i < textArr.value.length; i++) {
    tableStr = textArr.value[i].split('|');
    // 那就到此为止吧，再循环就不礼貌了
    if (!notLine(tableStr, rows)) {
      passIndex.value = index;
      passArr.value[index] = tableC.value;
      console.log(passArr.value)
      return true;
    } else {
      tableC.value++;
    }
  }

}

// 表行判断
function notLine(tableStr, rows) {
  if (tableStr[0] !== '' || tableStr[tableStr.length - 1] !== '') {
    return false;
  }
  if (tableStr.length <= 2) {
    return false;
  }
  return tableStr.length === rows + 2
}

const textType = ref([]);
const blogBanner = ref("https://sdadgz.cn/download/img/1.png"); // 博客首页

// 获取博客
function getBlog() {
  const not = LoadingNotify();
  // 获取url参数
  const username = $router.currentRoute.value.params.username;
  const title = $router.currentRoute.value.params.title;
  api.get("/blog/" + username + "/blog/" + title).then(res => {
    LoadingSucceed(not);
    const str = res.data.text;
    textArr.value = str.split("\n");
    textType.value = [];
    passArr.value = [];
    blogBanner.value = res.data.img.url;
    for (let i = 0; i < textArr.value.length; i++) {
      const type = whatType(i);
      textType.value.push(type);
    }
    blogIndex.value = produceIndex(textArr.value);
    blogTitle.value = res.data.title;
    blogTextShow.value = true;
  }).catch(() => {
    LoadingFail(not);
  }).then(() => {
    blogDone.value = true;
  })
}

// 设置用户信息
function setUserInfo() {
  if (avatar.value === null) {
    useIcon.value = true;
  }
}

// 去用户页
function gotoUser() {
  if (username.value === null) {
    $router.push("/");
  } else {
    $router.push("/user/" + username.value);
  }
}

// 回到主页
function goHome() {
  $router.push("/");
}

// 左侧索引
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

// 设置meta
function setMeta() {
  useMeta({
    titleTemplate: title => `${blogTitle.value} | by ${username.value} | ${title}`,
    meta: {
      description: {name: 'description', content: `${blogTitle.value} | by ${username.value}`},
    }
  })
}

watch(() => blogTitle.value, () => {
  setMeta();
}, {immediate: true})
</script>

<style scoped>

._h {
  font-weight: bold;
  border-bottom: solid rgba(255, 255, 255, .6) 1px;
  line-height: 1.2;
}

.blog-h1 {
  font-size: 2.3em;
}

.blog-h2 {
  font-size: 2.2em;
}

.blog-h3 {
  font-size: 2.1em;
}

.blog-h4 {
  font-size: 2.0em;
}

.blog-h5 {
  font-size: 1.9em;
}

.blog-h6 {
  font-size: 1.8em;
}

.code-field {
  background-color: rgba(255, 255, 255, .29);
}

.blog-container {
  overflow: hidden;
  position: absolute;
  left: 350px;
  width: 50%;
  padding-bottom: 30px;
  background-color: rgba(255, 255, 255, .3);
}

.barBtn {
  margin-right: 3%;
  min-width: 100px;
}

.a {
  transition: .35s ease-in-out;
}

.a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ec85a7;
}

a {
  text-decoration: none;
  color: #1D1D1D;
}

.img-to-big {
  transition: .35s ease-in-out;
}

.img-to-big:hover {
  transform: scale(1.2);
}

.blog-link {
  text-decoration: none;
  font-size: 1.6em;
  color: #0380f6;
  transition: .25s ease-in-out;
}

.blog-link:hover {
  color: #ec85a7;
  background-color: rgba(255, 255, 255, .1);
}

/*引用*/
._cite {
  border-left: 4px solid #f19ab8;
  padding: 0 15px;
  color: #ec85a7;
  background-color: rgba(255, 255, 255, 0.29);
  line-height: 2;
}

._base {
  margin: 10px 10px 3px;
  width: 98%;
}
</style>
