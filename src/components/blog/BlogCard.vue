<template>
  <div class="q-pa-md">
    <q-card class="blog-card" v-intersection.once="cardIn">

      <q-card-section>
        <div class="text-h6">{{ blog.title }}</div>
      </q-card-section>

      <q-card class="blog-img" @mouseover="onImg" @mouseout="outImg">
        <div class="img-to-big">
            <q-img :ratio="16/9"
                   v-if="blog.img != null"
                   :src="blog.img.url"/>
            <q-img :ratio="16/9" v-else :src="backgroundImg"/>
        </div>
      </q-card>

      <q-card-section>
        <div class="text-body2">{{ blog.detail }}</div>
        <div class="text-h6">{{ blog.user.name }}</div>
        <div class="text-h6">{{ blog.createtime }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// 父级传参
import {ref} from "vue";

const props = defineProps(['blog', 'backgroundImg']);
let imgMagnify = ref(false);

function cardIn(entry: any) {
  console.log(entry.isIntersecting);
}

// 鼠标放在图片上
function onImg() {
  imgMagnify.value = true;
}

// 鼠标离开图片
function outImg() {
  imgMagnify.value = false;
}
</script>

<style scoped>
.blog-card {
  background-color: rgba(255, 255, 255, .3);
}

.blog-img {
  margin: 0 3%;
  overflow: hidden;
  border-radius: 10px;
}

@keyframes imageAnimation {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}

.img-to-big {
  transition: .35s ease-in-out;
}

.img-to-big:hover{
  transform: scale(1.2);
}

.img {
  animation-name: imageAnimation;
  animation-duration: .35s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}

.imgR {
  animation-name: imageAnimation;
  animation-duration: .35s;
  animation-direction: reverse;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}
</style>
