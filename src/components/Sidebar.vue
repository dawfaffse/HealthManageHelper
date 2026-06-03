<template>
  <el-aside width="isCollapsed ? '80px' : '264px'" style="height: 100%;">
    <el-menu
      :default-active="route.path"
      :collapse="isCollapsed"
      :collapse-transition="false"
      style="height: 100%"
      @open="handleOpen"
      @close="handleClose"
      router
     
    >
      <div class="brand">
        <el-image
          style="width: 50px; height: 50px; margin-right: 10px"
          :src="iconUrl"
          alt="logo"
        ></el-image>
        <div class="info-crad" v-if="!isCollapsed">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>

      <el-menu-item
        v-for="item in router.options.routes[1].children"
        :key="item.path"
        :index="'/back/' + item.path"
      >
        <el-icon ><component :is="item.meta?.icon" /></el-icon>
        <span>{{ item.meta?.title || "未命名" }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter ,useRoute} from "vue-router";
import {useAdminStore} from '@/store/admin'

import {computed} from 'vue'
const adminStore = useAdminStore()
const isCollapsed = computed(()=>adminStore.isCollapsed)


import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  PieChart,
  Message,
  ChatLineSquare,
  User,
} from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();
console.log(router);
//为了导出时地址不出错
const iconUrl = new URL("/src/assets/images/机器人.png", import.meta.url);

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>
<style lang="scss" scoped>
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  .info-crad {
    .brand-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #303133;
    }
    .brand-subtitle {
      font-size: 14px;

      color: #797979;
    }
  }
}
</style>
