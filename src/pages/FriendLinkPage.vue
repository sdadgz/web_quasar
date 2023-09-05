<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <div class="row">
      <div class="col-3" v-for="friendLink in friendLinkList">
        <a class="text-black" :href="friendLink.url" style="text-decoration: none">
          <q-card class="q-ma-md cursor-pointer">
            <q-card-section>
              <q-avatar>
                <q-img :src="friendLink.avatar"/>
              </q-avatar>
              {{ friendLink.title }}
            </q-card-section>
            <q-card-section>
              <q-img :src="friendLink.image"/>
            </q-card-section>
            <q-card-section>
              {{ friendLink.description }}
            </q-card-section>
          </q-card>
        </a>
      </div>
    </div>

  </div>
</template>

<script setup>

import Header from "../components/public/Header.vue";

const friendLinkList = [
  {title: 'wmh’s wiki', description: '鸟要高飞先振翅，人求上进先读书。', avatar: 'https://blog-1306153177.cos.ap-beijing.myqcloud.com/202308151203522.png', image: 'https://blog-1306153177.cos.ap-beijing.myqcloud.com/202308151204118.png', url: 'https://wmhwiki.cn/'},
  {title: '', description: '', avatar: '', image: '', url: ''},
  {title: '', description: '', avatar: '', image: '', url: ''},
  {title: '', description: '', avatar: '', image: '', url: ''},
  {title: '', description: '', avatar: '', image: '', url: ''},
]

</script>

<style scoped>

</style>
