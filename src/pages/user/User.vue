<template>
  <div class="q-pa-md q-gutter-sm">
    <!--  头  -->
    <Header/>

    <!--  用户  -->
    <q-card style="background-color: rgba(231,171,171,0.5)">
      <!--   标题   -->
      <q-card-section>
        <strong>也不知道该写点什么</strong>
      </q-card-section>

      <!--   按钮   -->
      <q-card-section class="q-pa-md q-gutter-md">
        <q-btn icon="edit" label="修改密码" color="accent" @click="updatePasswordDialog = true">
          <q-dialog v-model="updatePasswordDialog">
            <q-card class="q-pa-md q-gutter-md">
              <!--       标题       -->
              <q-card-section class="flex">
                <strong>修改密码</strong>
                <q-space/>
                <q-btn icon="close" dense rounded flat v-close-popup/>
              </q-card-section>

              <!--       旧密码       -->
              <q-card-section>
                <q-input class="my-btn" v-model="oldPassword" label="旧密码"/>
              </q-card-section>

              <!--       新密码       -->
              <q-card-section>
                <q-input class="my-btn" v-model="newPassword" label="新密码"/>
              </q-card-section>

              <!--       确认密码       -->
              <q-card-section>
                <q-input class="my-btn" v-model="conform" label="确认密码"/>
              </q-card-section>

              <!--       按钮       -->
              <q-card-section class="flex">
                <q-btn label="重置" icon="clear_all" color="secondary"/>
                <q-space/>
                <q-btn label="提交" icon="upload" color="primary"/>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-btn>
      </q-card-section>
    </q-card>

    <!--  博客表  -->
    <q-card style="background-color: rgba(255,255,255,.5)">
      <div style="padding: 10px">
        <q-btn
          class="user-btn"
          icon="replay"
          color="primary"
          @click="refreshBtn"
          :loading="btnLoading"
          label="刷新"
        />
        <q-btn class="user-btn"
               icon="add_circle_outline"
               @click="addBtn"
               color="secondary"
               label="新增">

          <!--  弹出对话窗  -->
          <q-dialog v-model="dialogShow">
            <q-card class="column" style="width: 460px;padding: 33px 50px">
              <q-scroll-area style="height: 90vh">

                <!--    弹窗标题      -->
                <q-card-section class="row justify-between">
                  <div class="text-h6">
                    {{ dialogText }}
                  </div>
                  <q-btn icon="close" flat round dense v-close-popup/>
                </q-card-section>

                <!--    笔记标题      -->
                <q-card-section>
                  <q-input
                    v-model="titleInfo"
                    :rules="[ val => val && val.length > 0 || '输入值为空']"
                    label="标题"/>
                </q-card-section>

                <!--     笔记简介     -->
                <q-card-section>
                  <q-input
                    v-model="detailInfo"
                    label="简介"/>
                </q-card-section>

                <!--    切换      -->
                <q-card-section>
                  <q-toggle v-model="imgUseId" label="使用已经上传的图片id代替上传图片"
                            @click="imgUploader === null ? '' : imgUploader.reset();imgExists = false"/>
                </q-card-section>

                <!--    图片id输入框或上传器      -->
                <q-slide-transition>
                  <q-card-section v-if="imgUseId">
                    <q-input v-model="imgInfo" label="图片id" :rules="[ val => val && val.length > 0 || '输入值为空']"/>
                  </q-card-section>

                  <q-card-section v-else>
                    <q-uploader
                      ref="imgUploader"
                      label="上传博客主页图片"
                      accept=".jpg, image/*"
                      :factory="imgUploadFn"
                      hide-upload-btn
                      @added="imgExists = true"
                      @removed="imgExists = false"
                      @finish="uploadDone = true"
                      @uploaded="imgUploadFinish"
                    />
                  </q-card-section>
                </q-slide-transition>

                <q-card-section v-if="dialogText === '新增'">
                  <q-uploader
                    ref="mdUploader"
                    label="上传笔记"
                    accept=".md"
                    :factory="mdUploadFn"
                    hide-upload-btn
                    @added="mdExists = true"
                    @removed="mdExists = false"
                    @finish="uploadDone = true"
                    @uploaded="mdUploadFinish"
                  />
                </q-card-section>

                <q-card-section class="row justify-between">
                  <q-btn @click="reset" label="重置"/>
                  <q-btn @click="submit" label="提交" color="primary"/>
                </q-card-section>


              </q-scroll-area>
            </q-card>
          </q-dialog>

        </q-btn>
        <q-btn
          class="user-btn"
          icon="edit"
          color="purple"
          label="修改"
          @click="updateBtn"
        />
        <q-btn
          class="user-btn"
          icon="delete_forever"
          color="red"
          label="删除"
          @click="deleteBtn"
        />
        <q-btn class="user-btn"
               icon="arrow_outward"
               color="secondary"
               label="批量上传"
               @click="mdsUploadBtn">

          <!--  批量上传博客  -->
          <q-dialog v-model="blogsUploadShow">
            <q-card class="column" style="width: 460px;padding: 33px 50px">

              <!--    弹窗标题      -->
              <q-card-section class="row justify-between">
                <div class="text-h6">
                  {{ blogsUploadText }}
                </div>
                <q-btn icon="close" flat round dense v-close-popup/>
              </q-card-section>

              <!--    简短提示    -->
              <q-card-section>
                批量上传默认随机首页图，在上传博客之前多上传点 <strong>博客首页</strong> 图片
              </q-card-section>

              <!--    上传器    -->
              <q-card-section>
                <q-uploader
                  ref="mdsUploader"
                  label="上传笔记"
                  accept=".md"
                  :factory="mdsUploadFn"
                  hide-upload-btn
                  @added="mdExists = true"
                  @removed="mdExists = false"
                  @finish="uploadDone = true"
                  @uploaded="mdUploadFinish"
                  multiple
                />
              </q-card-section>

              <q-card-section class="row justify-between">
                <q-btn @click="reset" label="重置"/>
                <q-btn @click="submits" label="提交" color="primary"/>
              </q-card-section>

            </q-card>
          </q-dialog>
        </q-btn>
      </div>

      <!--   表   -->
      <q-table
        style="background-color: rgba(236,133,167,0.28);"
        :columns="columns"
        :rows="rows"
        row-key="id"
        hide-pagination
        selection="multiple"
        v-model:selected="selected"
        :selected-rows-label="getSelectedString"
        :loading="tableLoading"
        :pagination="pagination"
      >
      </q-table>

      <!--   分页   -->
      <div class="q-pa-lg flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="pageCount"
          direction-links
          @click="loadBlogs"
          style="min-width: 2em"
        />
      </div>
    </q-card>

    <!--  图片表  -->
    <q-card style="background-color: rgba(255,255,255,.5)">
      <div class="row" style="padding: 10px">
        <q-btn class="user-btn"
               icon="replay"
               color="primary"
               @click="refreshBtnImg"
               :loading="btnLoadingImg"
               label="刷新">

          <!--  图片弹出对话框  -->
          <q-dialog v-model="dialogShowImg">
            <q-card class="column" style="width: 460px;padding: 33px 50px">
              <q-card-section class="row justify-between">
                <div class="text-h6">
                  {{ dialogTextImg }}
                </div>
                <q-btn icon="close" flat round dense v-close-popup/>
              </q-card-section>

              <q-card-section>
                <q-btn-dropdown color="primary" :label="field">
                  <q-list>
                    <q-item clickable v-close-popup @click="field = '全局背景图片'">
                      <q-item-section>全局背景图片</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="field = '首页横幅'">
                      <q-item-section>首页横幅</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="field = '博客首页'">
                      <q-item-section>博客首页</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="field = '博客内图片'">
                      <q-item-section>
                        <q-item-label>博客内图片</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-card-section>

              <q-card-section>
                <q-input v-model="field" label="图片应用领域"/>
              </q-card-section>

              <!--    图片id输入框      -->
              <q-card-section v-if="dialogTextImg === '修改'">
                <q-input v-model="imgInfo" label="图片id" readonly/>
              </q-card-section>

              <!--    上传器    -->
              <q-card-section v-if="dialogTextImg === '新增'">
                <q-uploader
                  ref="imgUploader"
                  label="上传图片"
                  accept=".jpg, image/*"
                  :factory="imgUploadsFn"
                  multiple
                  hide-upload-btn
                  @added="imgExists = true"
                  @removed="imgExists = false"
                  @finish="uploadDone = true"
                  @uploaded="imgUploadFinish"
                />
              </q-card-section>

              <!--    底部按钮    -->
              <q-card-section class="row justify-between">
                <q-btn @click="resetImg" label="重置"/>
                <q-btn @click="submitImg" label="提交" color="primary"/>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-btn>
        <q-btn
          class="user-btn"
          icon="add_circle_outline"
          @click="addBtnImg"
          color="secondary"
          label="新增"
        />
        <q-btn
          class="user-btn"
          icon="edit"
          color="purple"
          label="修改"
          @click="updateBtnImgs"
        />
        <q-btn
          class="user-btn"
          icon="delete_forever"
          color="red"
          label="删除"
          @click="deleteBtnImgs"
        />
        <q-btn
          class="user-btn"
          icon="accessible_forward"
          color="secondary"
          :label="selectBtnStatus ? '全选' : '取消全选'"
          @click="allSelect"
        />
      </div>
      <q-infinite-scroll @load="onLoad" :offset="250" :disable="imgsDisable">
        <div class="row">
          <div class="col" v-for="i in ImgsColumns">
            <div v-for="j in imgs[i - 1] ? imgs[i - 1].length : 0">
              <div class="q-pa-xs">
                <q-card class="my-animation" :style="imgStyles[i-1][j-1]"
                        @click="setImgStyle(i-1,j-1)"
                        @contextmenu.prevent="openMenu($event,imgs[i - 1][j - 1])"
                >
                  <q-img
                    :src="imgs[i - 1][j - 1].reduceUrl !== null ? imgs[i - 1][j - 1].reduceUrl : imgs[i - 1][j - 1].url">
                    <!--          选中图标          -->
                    <q-icon
                      :style="imgStyles[i-1][j-1].transform === ImgSelectedStatus.transform ? RightIconShow : RightIconUnShow"
                      name="add_task" class="items-center full-height full-width my-animation" size="1000%"
                      color="positive"
                    />
                    <!--          图片应用领域          -->
                    <div class="absolute-bottom text-center" style="background-color: rgba(0,0,0,.3)">
                      {{ imgs[i - 1][j - 1].field }}
                    </div>
                  </q-img>
                </q-card>
              </div>
            </div>
          </div>
        </div>

        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px"/>
          </div>
        </template>
      </q-infinite-scroll>
    </q-card>

    <!--  最下面留空  -->
    <div style="width: 1px;height: 233px"/>

    <!--  右键菜单  -->
    <div :style="{left:left+'px',top:top+'px',position: 'absolute'}" class="shadow-10">
      <q-slide-transition>
        <q-card style="max-width: 250px;overflow: auto;background-color: #ec85a7" v-show="visible">
          <q-list bordered separator>

            <q-item clickable v-ripple @click="picOrigin(rightClickItem)">
              <q-item-section>查看原图</q-item-section>
            </q-item>

            <q-item v-if="rightClickItem.user">
              <q-item-section>所有者：{{ rightClickItem.user.name }}</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="addBtnImg">
              <q-item-section>新增</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="updateBtnImg">
              <q-item-section>修改</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="deleteBtnImg">
              <q-item-section>删除</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-slide-transition>
    </div>
  </div>
</template>

<script setup>

import {ref, watch} from "vue";
import Header from "../../components/public/Header.vue";
import {
  CommFail,
  CommSeccess,
  CommWarn,
  LoadingFail,
  LoadingNotify,
  LoadingSucceed
} from "../../components/notifyTools";
import {api} from "../../boot/axios";
import {useRouter} from "vue-router";
import {BlogColumns, ImgColumns} from "../../components/user/Table";
import {
  ImgsColumns, ImgSelectedStatus, ImgUnSelectedStatus,
  ServerName,
  TableLength,
  TableLengthImg,
  WaterFullOtherImg,
  RightIconShow,
  RightIconUnShow
} from "../../components/models";
import {useMeta, useQuasar} from "quasar";
import {checkPicurl} from "../../components/img/img";
import BackgroundImg from "../../components/public/BackgroundImg.vue";
import {sleep} from "../../components/Common";
import {EMPTY_STRING, TITLE} from "../../components/StringTool";

const $router = useRouter();
const $q = useQuasar();

const title = ref(TITLE);

// 修改密码
const updatePasswordDialog = ref(false);
const oldPassword = ref(EMPTY_STRING);
const newPassword = ref(EMPTY_STRING);
const conform = ref(EMPTY_STRING);

// 修改密码
function updatePasswordHandler() {
  api.put('/user/password', {
    username: username.value,
    oldPassword: oldPassword.value,
    newPassword: newPassword.value
  })
}

const backgroundImg = ref("https://sdadgz.cn/download/img/1.png");

const imgUploadUrl = ref("/img/upload"); // 上传地址
const imgUploadsUrl = ref("/img/uploads"); // 批量上传地址
const mdUploadUrl = ref("/blog/upload"); // 上传地址

const username = ref(localStorage.getItem("username")); // 用户名
const blogs = ref([]); // 博客s
const columns = ref([]); // 表头
const rows = ref([]); // 表格行
const selected = ref([]); // 表格选中
const tableLoading = ref(true); // 表格加载状态
const btnLoading = ref(false); // 刷新状态

const currentPage = ref(1); // 当前页面
const pageCount = ref(3)  // 页数
const pageSize = ref(TableLength); // 页数数据数量
const pagination = ref({rowsPerPage: pageSize.value}) // 表格显示的最大数量

// 弹窗
const dialogShow = ref(false); // 是否弹窗
const dialogText = ref(); // 弹出窗标题
const titleInfo = ref(); // 笔记标题
const detailInfo = ref(); // 简介信息
const imgInfo = ref(); // 图片信息-id

const imgUseId = ref(false); // 是否用图片id代替图片
const field = ref('未使用'); // 图片应用领域
const imgUploader = ref(null); // 图片上传器
const mdUploader = ref(null); // 笔记上传器
const uploadDone = ref(false); // 上传完成
const imgExists = ref(false); // 图片是否存在
const mdExists = ref(false); // 图片是否存在
const blogId = ref(0); // 图片是否存在

// 初始化函数
function start() {
  loadBlogs();
  loadImg();
}

// 直接屎山，查看原图
function picOrigin(img) {
  window.open(img.url);
}

const blogsUploadShow = ref(false); // 批量上传弹出框
const blogsUploadText = ref("批量增加"); // 弹出框标题
const mdsUploader = ref(null); // 上传器
const mdsUploadUrl = ref("/blog/uploads") // 批量上传地址

// 博客批量上传按钮
function mdsUploadBtn() {
  reset();
  blogsUploadShow.value = true;
}

const selectBtnStatus = ref(true); // 是不是全选

// 全选
function allSelect() {
  if (selectBtnStatus.value) {
    // 全选
    for (let i = 0; i < imgs.value.length; i++) {
      if (imgs.value[i] === undefined) {
        break;
      }
      for (let j = 0; j < imgs.value[i].length; j++) {
        if (imgStyles.value[i][j].transform === ImgUnSelectedStatus.transform) { // 未选中
          // 选择他
          selectedImgs.value.push(imgs.value[i][j]);
          imgStyles.value[i][j] = ImgSelectedStatus;
        }
      }
    }
    selectBtnStatus.value = false;
  } else {
    // 全不选
    for (let i = 0; i < imgs.value.length; i++) {
      if (imgs.value[i] === undefined) {
        break;
      }
      for (let j = 0; j < imgs.value[i].length; j++) {
        if (imgStyles.value[i][j].transform !== ImgUnSelectedStatus.transform) { // 选中
          // 取消选中
          imgStyles.value[i][j] = ImgUnSelectedStatus;
          for (let k = 0; k < selectedImgs.value.length; k++) {
            if (selectedImgs.value[k] === imgs.value[i][j]) {
              selectedImgs.value.splice(k, 1);
            }
          }
        }
      }
      selectBtnStatus.value = true;
    }
  }
}

// 批量上传提交
async function submits() {
  uploadDone.value = false;
  await mdsUploader.value.upload();
  while (!uploadDone.value) {
    await sleep(233);
  }
  await loadBlogs();
}

// 批量提交工厂
function mdsUploadFn() {
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

// 图片样式
const imgStyles = ref([]);
const selectedImgs = ref([]);

// 图片选中状态
function setImgStyle(i, j) {
  // 点击的图片
  const img = imgs.value[i][j];

  if (imgStyles.value[i][j].transform === ImgUnSelectedStatus.transform) {
    // 选中
    selectedImgs.value.push(img);
    imgStyles.value[i][j] = ImgSelectedStatus;
  } else {
    // 取消选中
    imgStyles.value[i][j] = ImgUnSelectedStatus;
    for (let k = 0; k < selectedImgs.value.length; k++) {
      if (selectedImgs.value[k] === img) {
        selectedImgs.value.splice(k, 1);
      }
    }
  }
}

// 加载blogs
async function loadBlogs() {
  const loadNot = LoadingNotify();
  rows.value = [];
  columns.value = [];
  tableLoading.value = true;

  // 获取本地用户名
  let username = localStorage.getItem("username");
  if (username == null) {
    return;
  }

  await api.get("/blog/" + username + "/page", {
    params: {
      "currentPage": currentPage.value,
      "pageSize": pageSize.value
    }
  }).then(res => {
    if (res.code === "200") {
      blogs.value = res.data.lists;
      columns.value = BlogColumns; // 从本地获取表名

      // 表格数据
      for (let i = 0; i < blogs.value.length; i++) {
        let obj = {};
        for (let j = 0; j < BlogColumns.length; j++) {
          Object.assign(obj, {[`${BlogColumns[j].field}`]: eval("blogs.value[i]." + `${BlogColumns[j].field}`)});
        }
        // 增加id去重
        Object.assign(obj, {"id": blogs.value[i].id});
        rows.value.push(obj);
      }

      // 分页
      pageCount.value = Math.ceil(res.data.total / pageSize.value);

      // 状态结束
      LoadingSucceed(loadNot);
      tableLoading.value = false;
    } else {
      LoadingFail(loadNot);
      tableLoading.value = false;
    }
  }).catch(() => {
    LoadingFail(loadNot);
    tableLoading.value = false;
  })
}

// 图片变量
const tableLoadingImg = ref(false);
const currentPageImg = ref(1);
const pageSizeImg = ref(TableLengthImg);
const imgs = ref([]);
const pageCountImg = ref(3);
const columnsAddArr = ref([]); // 计算长度

// 加载图片
async function loadImg() {
  tableLoadingImg.value = true;
  // 未初始化
  if (imgs.value.length < 1) {
    imgs.value = new Array(ImgsColumns);
  }
  if (columnsAddArr.value < 1) {
    columnsAddArr.value = new Array(ImgsColumns);
    columnsAddArr.value.fill(0);
  }

  // 获取本地用户名
  let username = localStorage.getItem("username");
  if (username == null) {
    return;
  }

  await api.get("/img/" + username + "/page", {
    params: {
      "currentPage": currentPageImg.value,
      "pageSize": pageSizeImg.value
    }
  }).then(res => {
    if (res.code === "200") {
      const imgData = res.data.lists; // 获取imgs数据

      // 分页
      pageCountImg.value = Math.ceil(res.data.total / pageSizeImg.value);

      // 设置瀑布流
      setImgs(imgData);

      // 解除禁用
      if (currentPageImg.value === 1) {
        imgsDisable.value = false;
      }

      // 状态结束
      tableLoadingImg.value = false;
    }
  })
}

// 设置图片数组
async function setImgs(data) {
  for (let i = 0; i < data.length; i++) {
    let minIndex = 0;
    // 找出最小的
    for (let j = 0; j < ImgsColumns; j++) {
      if (columnsAddArr.value[j] < columnsAddArr.value[minIndex]) {
        minIndex = j;
      }
    }

    // 设置url
    let url = data[i].reduceUrl !== null ? data[i].reduceUrl : data[i].url;
    // 最小索引增加图片
    let add = await checkPicurl(url);
    while (add === undefined && url) {
      add = await checkPicurl(url);
      await sleep(1);
    }

    columnsAddArr.value[minIndex] += add + WaterFullOtherImg;
    if (imgs.value[minIndex] === undefined) {
      imgs.value[minIndex] = [];
    }
    imgs.value[minIndex].push(data[i]);

    // 图片仍进去了，图片的style设置一下
    if (imgStyles.value.length < 1) { // 初始化
      imgStyles.value = new Array(ImgsColumns);
    }
    if (!imgStyles.value[minIndex]) { // 初始化二维
      imgStyles.value[minIndex] = [];
    }
    imgStyles.value[minIndex].push(ImgUnSelectedStatus);
  }
}

const imgsDisable = ref(true); // 图片无限加载开关

// 无限滚动
async function onLoad(index, done) {
  if (currentPageImg.value > pageCountImg.value) {
    imgsDisable.value = true;
    return;
  }
  currentPageImg.value = currentPageImg.value + 1;
  await loadImg();
  done();
}

// 右键菜单显示
const visible = ref(false);

// 关闭右键菜单监听
watch(() => visible.value, () => {
  if (visible.value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
}, {immediate: true})

const rightClickItem = ref([]);
const top = ref(0);
const left = ref(0);

// 开启菜单
function openMenu(e, item) {
  rightClickItem.value = item;

  const x = e.pageX;
  const y = e.pageY;

  left.value = x;
  top.value = y;

  visible.value = true;
}

// 关闭菜单
function closeMenu() {
  visible.value = false;
}

// 刷新按钮
async function refreshBtn() {
  btnLoading.value = true;
  await loadBlogs();
  btnLoading.value = false;
}

const btnLoadingImg = ref(false); // 图片加载按钮 动画

// 图片刷新按钮
async function refreshBtnImg() {
  imgStyles.value = [];
  selectedImgs.value = []; // 选中图片存储
  btnLoadingImg.value = true; // 加载动画
  imgs.value = []; // 图片存储
  currentPageImg.value = 1; // 分页开始页
  columnsAddArr.value = []; // 分页判断数组
  imgsDisable.value = true; // 禁用无限加载
  await loadImg(); // 加载
  btnLoadingImg.value = false; // 加载完毕
}

// 新增按钮
function addBtn() {
  reset();
  dialogText.value = '新增';
  dialogShow.value = true;
  field.value = '博客首页';
}

const dialogTextImg = ref();
const dialogShowImg = ref(false);

// 图片新增按钮
function addBtnImg() {
  resetImg();
  dialogTextImg.value = '新增';
  dialogShowImg.value = true;
  field.value = '未定义';
}

// 修改按钮
function updateBtn() {
  // 先重置
  reset();
  // 选中是否合法
  if (selected.value.length !== 1) {
    CommWarn("请选择一个用户进行修改");
    return;
  }
  // 传值
  blogId.value = selected.value[0].id;
  titleInfo.value = selected.value[0].title;
  detailInfo.value = selected.value[0].detail;
  imgInfo.value = selected.value[0].imgId;

  dialogText.value = '修改';
  dialogShow.value = true;
  field.value = '博客首页';
}

// 图片修改按钮
function updateBtnImg() {
  // 先重置
  resetImg();

  imgInfo.value = rightClickItem.value.id;

  dialogTextImg.value = '修改';
  dialogShowImg.value = true;
  field.value = '未定义';
}

// 批量修改按钮
function updateBtnImgs() {
  dialogTextImg.value = '批量修改';
  dialogShowImg.value = true;
  field.value = '未定义';
}

// 删除按钮
function deleteBtn() {
  if (selected.value.length < 1) {
    CommWarn("好歹选一个啊");
    return;
  }
  $q.notify({
    message: '确定要删除所选项目吗？',
    type: 'negative',
    position: 'top',
    actions: [
      {
        label: '确定', color: 'yellow', handler: () => {
          const idlist = [];
          selected.value.forEach((blog) => {
            idlist.push(blog.id);
          })
          // 删除用户
          api.delete("/blog", {
            data: {
              "idList": idlist
            }
          }).then(() => {
            selected.value = [];
            loadBlogs();
          })
        }
      },
      {
        label: '取消', color: 'white', handler: () => { /* ... */
        }
      }
    ]
  })
}

// 右键删除
function deleteBtnImg() {
  $q.notify({
    message: '确定要删除所选项目吗？',
    type: 'negative',
    position: 'top',
    actions: [
      {
        label: '确定', color: 'yellow', handler: () => {
          const id = rightClickItem.value.id;
          // 删除图片
          api.delete("/img", {
            data: {
              "id": id
            }
          }).then(() => {
            CommSeccess("删除成功");
          }).catch(() => {
            CommFail("删除失败");
          }).then(() => {
            refreshBtnImg();
          })
        }
      },
      {
        label: '取消', color: 'white'
      }
    ]
  })
}

// 图片删除按钮
function deleteBtnImgs() {
  $q.notify({
    message: '确定要删除所选项目吗？',
    type: 'negative',
    position: 'top',
    actions: [
      {
        label: '确定', color: 'yellow', handler: () => {
          // 至少选择一个
          if (selectedImgs.value.length < 1) {
            CommWarn("至少选一个啊");
            return;
          }

          selectedImgs.value.forEach((item) => {
            // 删除图片
            api.delete("/img", {
              data: {
                "id": item.id
              }
            }).then(() => {
              CommSeccess("删除成功");
            }).catch(() => {
              CommFail("删除失败");
            }).then(() => {
              refreshBtnImg();
            })
          })
        }
      },
      {
        label: '取消', color: 'white'
      }
    ]
  })
}

// 重置
function reset() {
  titleInfo.value = '';
  detailInfo.value = '';
  imgInfo.value = '';
  imgUseId.value = false;
  imgExists.value = false;
  uploadDone.value = false;
  if (imgUploader.value !== null) { // 可能为空
    imgUploader.value.reset();
  }
  if (mdUploader.value !== null) {
    mdUploader.value.reset();
  }
  if (mdsUploader.value !== null) {
    mdsUploader.value.reset();
  }
}

// 图片重置
function resetImg() {
  imgExists.value = false;
  uploadDone.value = false;
  field.value = '未定义';
  if (imgUploader.value !== null) { // 可能为空
    imgUploader.value.reset();
  }
}

// 提交
async function submit() {
  if (!imgUseId.value && imgExists.value) {
    // 上传图片
    uploadDone.value = false;
    await imgUploader.value.upload();
    while (!uploadDone.value) {
      await sleep(233);
    }
    // 上传后自动赋值给imgInfo了
  }

  // 不合法的imgInfo
  if (!imgInfo.value) {
    CommFail("图片不存在");
    return;
  }

  uploadDone.value = false;
  if (dialogText.value === '新增') {
    if (!mdExists.value) {
      CommFail("博客不存在");
      return;
    }
    await mdUploader.value.upload();
    while (!uploadDone.value) {
      await sleep(233);
    }
    await loadBlogs();
  } else if (dialogText.value === '修改') {
    await api.post("/blog/update", {
      "id": blogId.value,
      "imgId": imgInfo.value,
      "title": titleInfo.value,
      "detail": detailInfo.value
    }).then(res => {
      // 处理结果
      CommSeccess("修改成功");
    }).catch(() => {
      CommFail("修改失败");
    }).then(() => {
      dialogShow.value = false;
      loadBlogs();
    })
  } else {
    CommFail("无法提交");
  }
}

// 图片提交
async function submitImg() {
  // 新增
  if (dialogTextImg.value === '新增' && imgExists.value) {
    // 上传图片
    uploadDone.value = false;
    await imgUploader.value.upload();
    while (!uploadDone.value) {
      await sleep(233);
    }
    CommSeccess("上传成功");
    await refreshBtnImg();
    // 上传后自动赋值给imgInfo了
  } else

    // 修改
  if (dialogTextImg.value === '修改') {
    // 不合法的imgInfo
    if (!imgInfo.value) {
      CommFail("图片不存在");
    }
    await updateImg(rightClickItem.value.id, field.value);
  } else

    // 批量修改
  if (dialogTextImg.value === '批量修改') {
    if (selectedImgs.value.length < 1) {
      CommWarn("至少选择一个图片");
      return;
    }
    let idList = [];
    selectedImgs.value.forEach((item) => {
      idList.push(item.id);
    })
    // 上传图片，带刷新
    updateImgs(idList, field.value);
    await refreshBtnImg();
  }
}

// 修改图片
function updateImg(id, f) {
  api.put("/img/update", {
    "id": id,
    "field": f
  }).then(() => {
    CommSeccess("修改成功");
  }).catch(() => {
    CommFail("修改失败");
  }).then(() => {
    dialogShowImg.value = false;
    refreshBtnImg();
  })
}

// 修改图片s
function updateImgs(idList, f) {
  api.put("/img/update", {
    "idList": idList,
    "field": f
  }).then(() => {
    CommSeccess("修改成功");
  }).catch(() => {
    CommFail("修改失败");
  }).then(() => {
    dialogShowImg.value = false;
    refreshBtnImg();
  })
}

// 上传图片工厂函数
function imgUploadFn() {
  return new Promise(resolve => {
    resolve({
      "url": ServerName + imgUploadUrl.value,
      "fieldName": "file",
      "formFields": [
        {
          "name": "field",
          "value": field.value
        }],
      "headers": [{
        "name": "token",
        "value": localStorage.getItem("token")
      }]
    })
  })
}

// 上传图片工厂函数s
function imgUploadsFn() {
  return new Promise(resolve => {
    resolve({
      "url": ServerName + imgUploadsUrl.value,
      "fieldName": "files",
      "formFields": [
        {
          "name": "field",
          "value": field.value
        }],
      "headers": [{
        "name": "token",
        "value": localStorage.getItem("token")
      }]
    })
  })
}

// 上传笔记工厂函数
function mdUploadFn() {
  return new Promise(resolve => {
    resolve({
      "url": ServerName + mdUploadUrl.value,
      "fieldName": "file",
      "formFields": [
        {
          "name": "imgId",
          "value": imgInfo.value
        },
        {
          "name": "title",
          "value": titleInfo.value
        },
        {
          "name": "detail",
          "value": detailInfo.value
        }],
      "headers": [{
        "name": "token",
        "value": localStorage.getItem("token")
      }]
    })
  })
}

// 图片上传之后
function imgUploadFinish(info) {
  const res = JSON.parse(info.xhr.response);
  if (res.code === '499') { // 未登录
    CommFail("未登录");
    $router.push("/user/login");
  } else if (res.code !== '200') { // 出现异常
    CommFail(res.msg);
    dialogShow.value = false;
  } else {
    // 正常处理
    imgInfo.value = res.data.id;
  }
}

// 博客上传之后
function mdUploadFinish(info) {
  const res = JSON.parse(info.xhr.response);
  if (res.code === '499') { // 未登录
    CommFail("未登录");
    $router.push("/user/login");
  } else if (res.code !== '200') { // 出现异常
    CommFail(res.msg);
    dialogShow.value = false;
  } else {
    // 处理
    CommSeccess("上传成功");
  }
}

// 已选几项
function getSelectedString() {
  return selected.value.length === 0 ? '' : `已选择${selected.value.length}项`;
}

useMeta({
  titleTemplate: title => `${username.value}的个人主页 | ${title}`,
  meta: {
    description: {name: 'description', content: `${username.value}的个人主页`},
  },
})

// 初始化
start();

</script>

<style scoped>

.my-btn {
  min-width: 250px;
}

.user-btn {
  margin: 0 10px;
  min-width: 100px;
}

.my-animation {
  transition: .35s cubic-bezier(0.6, -1.23, 0.36, 2.4);
}

</style>
