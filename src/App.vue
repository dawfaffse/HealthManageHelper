<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/store/admin'

// 控制花朵显示状态
const showFlower = ref(true)
const adminStore = useAdminStore()

onMounted(() => {
  // 从localStorage中加载token和userInfo到store中
  const adminStr = localStorage.getItem('admin')
  if (adminStr) {
    try {
      const admin = JSON.parse(adminStr)
      if (admin.token) {
        adminStore.setToken(admin.token)
      }
      if (admin.userInfo) {
        adminStore.setUserInfo(admin.userInfo)
      }
    } catch (e) {
      console.error('解析 admin 存储失败:', e)
    }
  }
  
  // 3秒后隐藏花朵
  setTimeout(() => {
    showFlower.value = false
  }, 3000)
})
</script>

<template>
 <div class="app-container">
  <div class="flower-container" v-if="showFlower">
    <div class="flower">
      <div class="petal petal-1"></div>
      <div class="petal petal-2"></div>
      <div class="petal petal-3"></div>
      <div class="petal petal-4"></div>
      <div class="petal petal-5"></div>
      <div class="petal petal-6"></div>
      <div class="center"></div>
    </div>
  </div>
  <router-view></router-view>
 </div>
</template>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
}

.flower-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  pointer-events: none;
  transition: opacity 0.5s ease-out;
}

.flower {
  position: relative;
  width: 100px;
  height: 100px;
}

.petal {
  position: absolute;
  width: 40px;
  height: 60px;
  background: linear-gradient(135deg, #ff6b9d, #4ecdc4);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform-origin: center bottom;
  animation: bloom 2s ease-out forwards;
  opacity: 0;
}

.petal-1 {
  top: 10px;
  left: 30px;
  transform: rotate(0deg);
  animation-delay: 0s;
}

.petal-2 {
  top: 15px;
  left: 5px;
  transform: rotate(60deg);
  animation-delay: 0.2s;
}

.petal-3 {
  top: 50px;
  left: 5px;
  transform: rotate(120deg);
  animation-delay: 0.4s;
}

.petal-4 {
  top: 65px;
  left: 30px;
  transform: rotate(180deg);
  animation-delay: 0.6s;
}

.petal-5 {
  top: 50px;
  left: 55px;
  transform: rotate(240deg);
  animation-delay: 0.8s;
}

.petal-6 {
  top: 15px;
  left: 55px;
  transform: rotate(300deg);
  animation-delay: 1s;
}

.center {
  position: absolute;
  top: 40px;
  left: 35px;
  width: 30px;
  height: 30px;
  background: #ffd93d;
  border-radius: 50%;
  animation: grow 1.5s ease-out forwards;
  transform: scale(0);
  animation-delay: 1.2s;
}

@keyframes bloom {
  0% {
    opacity: 0;
    transform: rotate(0deg) scale(0);
  }
  50% {
    opacity: 1;
    transform: rotate(0deg) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

@keyframes grow {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>

