<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer reveal style="background-color: unset">
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <a style="color: #1D1D1D;text-decoration: none" href="https://beian.miit.gov.cn/" target="_blank">京ICP备2022019075号-1</a>
        </div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">
import {defineComponent, ref} from 'vue';
import EssentialLink from 'components/EssentialLink.vue';


</script>

<style>
body{
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #018EE8;
}
</style>
