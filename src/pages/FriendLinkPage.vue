<template>
  <div class="q-pa-md q-gutter-sm">

    <!--  头  -->
    <Header/>

    <div class="row">
      <div class="col-3" v-for="friendLink in friendLinkList">
        <q-card class="q-ma-md">
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
      </div>
    </div>

  </div>
</template>

<script setup>

import Header from "../components/public/Header.vue";

const friendLinkList = [
  {title: '', description: '', avatar: '', image: ''},
  {title: '', description: '', avatar: '', image: ''},
  {title: '', description: '', avatar: '', image: ''},
  {title: '', description: '', avatar: '', image: ''},
  {title: '', description: '', avatar: '', image: ''},
]

</script>

<style scoped>

</style>
