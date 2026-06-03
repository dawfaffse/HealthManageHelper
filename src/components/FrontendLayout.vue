<template>
  <div class="frontend-layout">
  <div class="navbar-container">
    <div class="brand-section">
      <el-image style="width: 40px; height: 40px" :src="url1" alt="品牌logo" class="brand-logo" />
      <h1 class="brand-name">心理健康AI助手</h1>
    </div>
    <div class="nav-section">
      <router-link class="nav-link" to="/home">首页</router-link>
      <router-link class="nav-link" v-if="isLoggedIn" to="/consultations">AI咨询</router-link>
      <router-link class="nav-link" v-if="isLoggedIn" to="/emtion-diary">情绪日记</router-link>
      <router-link class="nav-link"  to="/knowledge">知识库</router-link>
      <el-button v-if="isLoggedIn" type="medium" class="logout-btn" @click="handleLogout">退出登录</el-button>
      <template v-else>
         <router-link class="nav-link"  to="/auth/login">登录</router-link>
         <router-link class="nav-link"  to="/auth/register">
          <el-button type="primary" class="logout-btn">注册</el-button>
         </router-link>
      </template>
    </div>
  </div>
  <div class="main-container">
    <router-view></router-view>
  </div>
  <div class="footer-container">
    <div class="footer-bottom">
      <p>
        &copy; 2026 心理健康AI助手，保留所有权利.
      </p>
    </div>
  </div>
  </div>
</template>
<style  lang="scss" scoped>
.frontend-layout {
  min-height: 100vh;
  min-width: 830px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  
  .navbar-container {
    border-bottom: 1px solid rgba(0, 0, 0, 0.24);
    width: 100%;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 100;
    
    .brand-section {
      display: flex;
      align-items: center;
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      
      .nav-link {
        position: relative; /* 必须加，用来定位下划线 */
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        text-decoration: none; /* 去掉默认下划线 */
        cursor: pointer;
        padding: 8px 12px;

        /* 下划线初始状态 */
        &::after {
          content: '';
          position: absolute;
          bottom: -4px; /* 距离文字底部的距离 */
          left: 50%; /* 从中间开始变长 */
          transform: translateX(-50%);
          width: 0; /* 初始宽度为0 */
          height: 2px; /* 下划线粗细 */
          background-color: #4A90E2; /* 下划线颜色 */
          border-radius: 1px;
          transition: width 0.3s ease; /* 动画时长和曲线 */
        }

        &:hover {
          color: #4A90E2;
          /* 悬浮时下划线拉满 */
          &::after {
            width: 100%;
          }
        }
      }
    }
  }

  .main-container {
    flex: 1;
    padding-top: 58px; /* 与navbar高度一致 */
    padding-bottom: 51px; /* 与footer高度一致 */
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/store/admin'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { logout } from '@/api/admin'



const router = useRouter()

const isLoggedIn = ref(false)
const url1 = new URL('@/assets/images/机器人.png', import.meta.url).href
const isCollapsed = ref(false)


onMounted(() => {
  const adminStore = useAdminStore()
  if(adminStore.token) {
    isLoggedIn.value = true
  }else{
    isLoggedIn.value = false
  }
})

const handleLogout = () => {
  logout().then(()=>{
 const adminStore = useAdminStore()
   adminStore.clearToken()
  adminStore.clearUserInfo()

  router.push('/auth/login')
  })
 
}
 
</script>
