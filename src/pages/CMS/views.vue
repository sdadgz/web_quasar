<template>
  <div class="q-pa-md q-gutter-md">

    <!--  头  -->
    <Header/>

    <div
      class="q-pa-md q-gutter-md row"
      style="padding: 0;margin: 0;"
    >
      <!--   全部信息   -->
      <q-card
        class="background-color-rgba-white-5"
        style="min-height: 66vh"
      >
        <!--    头    -->
        <q-card-section>
          <strong>今日来访{{ todayTotal }}人，总计{{ todayCount }}次</strong>
        </q-card-section>
        <q-separator/>

        <!--    数据    -->
        <TransitionGroup
          appear
          enter-active-class="animated backInUp"
          leave-active-class="animated hinge"
        >
          <q-card-section v-for="item in todayIpListMin" :key="item.k">
            <Ip :ip="item.k" :count="item.v"/>
          </q-card-section>
        </TransitionGroup>
      </q-card>

      <!--   地域统计   -->
      <q-card class="background-color-rgba-white-5">
        <!--    头    -->
        <q-card-section>
          <strong>今日来访 </strong>
          <strong v-if="todayHeadItem.length > 0">
            {{ todayHeadItem[0].size || 0 }}个国家，
            {{ todayHeadItem[1].size || 0 }}个市，
            {{ todayHeadItem[2].size || 0 }}个城市，
            {{ todayHeadItem[3].size || 0 }}个地区，
            {{ todayHeadItem[4].size || 0 }}个运营商，
            {{ todayHeadItem[5].size || 0 }}个网络，哈哈都是机器人
          </strong>
        </q-card-section>
        <q-separator/>

        <!--    数据    -->
        <q-card-section>
          <q-tree
            class="background-color-rgba-white-5"
            :nodes="todayRegionalTree"
            node-key="label"
            label-key="label"
            v-model:expanded="todayExpended"
            no-nodes-label="加载中..."
          >
            <template #default-header="prop">
              <span class="text-weight-bold text-primary">{{ prop.node.label }} {{
                  prop.node.count || 'error'
                }}人次</span>
            </template>
          </q-tree>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">

import Header from "components/public/Header.vue";
import Ip from "components/cms/ip.vue";
import {ref} from "vue";
import {IP_LIST_MAX, REDIS_SPLIT, REGIONAL_ARR, ZERO} from "components/StringTool";
import {getIp, getRegionalByIp, labelChildren, setChildren} from "components/Tools";
import {sleep} from "components/Common";
import {getIpToday} from "src/api/ip";

const todayIpList = ref([]);
const todayIpListMin = ref([] as any[]);
const todayTotal = ref(ZERO);
const todayCount = ref(ZERO);

const todayRegionalTree = ref([] as labelChildren[]);
const todayExpended = ref([]);
const todayHeadItem = ref([] as any[]);

// 获取访问信息
function getTodayIpList() {
  getIpToday().then(res => {
    // 总数据
    setTodayIpList(res);
  }).then(() => {
    // 访问人数
    setTodayTotalAndCount();

    // 设置地域树
    setRegionalTree();
  })
}

// 设置ipList
function setTodayIpList(res) {
  todayIpList.value = res.data;
  todayIpCarousel();
}

// 设置访问总人数，总人次
function setTodayTotalAndCount() {
  // 不可以手欠删掉这个看似无用的代码
  for (const [key, value] of Object.entries(todayIpList.value)) {
    todayTotal.value++;
    todayCount.value += value;
  }
}

// 地域树
async function setRegionalTree() {
  // 根据ip获得的地域信息值
  const regionalArr = REGIONAL_ARR;
  const headArr = new Array(regionalArr.length);
  // 填充，不要放对象
  // headArr.fill(new Set());
  for (let i = 0; i < headArr.length; i++) {
    headArr[i] = new Set();
  }
  let result: labelChildren[] = [];
  // 遍历ip生成地域
  for (const [key, value] of Object.entries(todayIpList.value)) {
    await getRegionalByIp(getIp(key)).then(res => {
      // 地理位置信息数组
      const strArr: string[] = [];
      for (let i = 0; i < regionalArr.length; i++) {
        strArr.push(res[`${regionalArr[i]}`]);
      }
      setChildren(result, strArr, value);
      // 设置头数组
      for (let i = 0; i < strArr.length; i++) {
        headArr[i].add(strArr[i]);
      }
    });
  }
  todayHeadItem.value = headArr;
  todayRegionalTree.value = result;
}

// 轮播
async function todayIpCarousel() {
  while (true){
    for (const [key, value] of Object.entries(todayIpList.value)) {
      if (todayIpListMin.value.length > IP_LIST_MAX) {
        // 超了，减
        todayIpListMin.value.shift();
      } else {
        todayIpListMin.value.push({k: key, v: value});
      }
      if (todayIpListMin.value.length < IP_LIST_MAX) {
        await sleep(666);
      } else {
        await sleep(233 * 16);
      }
    }
  }
}

function start() {
  getTodayIpList();
}

start();
</script>

<style scoped>

.background-color-rgba-white-5 {
  background-color: rgba(255, 255, 255, .5);
}

</style>
