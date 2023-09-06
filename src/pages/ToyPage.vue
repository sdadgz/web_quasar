<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <!--  杂物  -->
    <div class="row q-gutter-md q-pa-sm">
      <!--   ip   -->
      <!--      <q-card class="col-auto" style="background-color: rgba(250,160,160,0.34)">-->
      <!--        <q-card-section>-->
      <!--          <strong>不用说话，点一下知道你是哪里人，猜对了v我8w</strong>-->
      <!--        </q-card-section>-->
      <!--        <q-separator/>-->
      <!--        <q-card-section>-->
      <!--          <q-btn label="点我开始测试" color="primary" @click="ipHandler"/>-->
      <!--        </q-card-section>-->
      <!--      </q-card>-->

      <!--   114514   -->
      <q-card class="col-auto" style="background-color: rgba(250,160,160,0.34)">
        <q-card-section>
          <strong>小玩具，要不试试输个数字呗</strong>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-input
            v-model="input_114514"
            type="number"
            lazy-rules
            :rules="notNull"
            label="这里这里"
            @keyup.enter="handler_114514"
          />
        </q-card-section>
        <q-card-section>
          <strong style="word-break: break-word">{{ text_114514 }}</strong>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="这个不是按钮"
            color="primary"
            @click="handler_114514"
          />
        </q-card-section>
      </q-card>

      <!--   打死后端    -->
      <q-card class="col-auto" style="background-color: rgba(250,160,160,0.34)">
        <q-card-section>
          <strong>点我打死后端</strong>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-btn
            label="别点，球球了"
            color="red"
            @click="shutdown"
          />
        </q-card-section>
      </q-card>
    </div>

  </div>
</template>

<script setup>
import Header from "../components/public/Header.vue";
import {api} from "../boot/axios";
import {ref} from "vue";
import {isInteger, notNull} from "../components/Tools";

// 关机
function shutdown() {
  api.get('/user/shutdown');
}

// 114514输入框
const input_114514 = ref(null);
const target_114514 = ref(114514);
const text_114514 = ref("欸嘿");

// 点击了114514的按钮
function handler_114514() {
  text_114514.value = "加载中。。。";
  if (isInteger(input_114514.value)) {
    api.get('/toy/114514', {
      params: {
        src: input_114514.value,
        target_114514: target_114514.value
      }
    }).then(res => {
      text_114514.value = res.data;
    })
  }
}

</script>

<style scoped>

</style>
