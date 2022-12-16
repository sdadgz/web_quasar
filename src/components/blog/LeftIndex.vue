<template>
  <q-expansion-item v-if="blogIndex.children != null" :label="blogIndex.title">
    <template v-for="item in blogIndex.children">
      <LeftIndex :blogIndex="item"/>
    </template>
    <div class="bottom-line"/>
  </q-expansion-item>
  <q-expansion-item v-else expand-icon="none" @click="onClick" :label="blogIndex.title"/>
</template>

<script setup>
import {useRouter} from "vue-router";
import {CommWarn} from "components/notifyTools";

const $router = useRouter();
const props = defineProps(['blogIndex']);

function onClick() {
  CommWarn("别点了，跳转不了");
}

</script>

<style scoped>
.bottom-line {
  width: 100%;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, .233);
}
</style>
