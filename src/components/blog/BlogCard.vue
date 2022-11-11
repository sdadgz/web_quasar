<template>
  <div class="q-pa-md">
    <q-card class="blog-card" v-intersection.once="cardIn" @click="toBlog">

      <!--  标题    -->
      <q-card-section>
        <div class="text-h6">{{ blog.title }}</div>
      </q-card-section>

      <!--   图片   -->
      <q-card class="blog-img" @mouseover="onImg" @mouseout="outImg">

        <div class="img-to-big" v-if="blog.img != null">
          <q-img
            v-if="blog.img.reduceUrl != null"
            :src="blog.img.reduceUrl"
          />
          <q-img
            v-else-if="blog.img.url != null"
            :src="blog.img.url"
          />
          <div class="info-to-small" :class="{canSee: imgMagnify}">
            {{ blog.detail }}
          </div>
        </div>


      </q-card>

      <q-card-section>`
        <div class="text-h6">{{ blog.user.name }}</div>
        <div class="text-h6">{{ blog.createTime }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const $router = useRouter();

// 父级传参
const props = defineProps(['blog', 'backgroundImg']);
const imgMagnify = ref(false);

function toBlog() {
  const username = props.blog.user.name;
  const title = props.blog.title;
  $router.push("/blog/" + username + "/blog/" + title);
}

function cardIn(entry: any) {
  console.log("这里差个动画没做BlogCard.vue::051");
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

.img-to-big {
  transition: .35s ease-in-out;
}

.img-to-big:hover {
  transform: scale(1.2);
}

.info-to-small {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  transform: scale(5);
  visibility: hidden;
  transition: .35s ease-in-out;
}

.info-to-small:hover {
  transform: scale(.8);
}

.canSee {
  visibility: visible;
}
</style>
