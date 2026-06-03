<template>
  <div class="backend-layout">
    <el-container style="height: 100%;">
      <Sidebar ></Sidebar>
      <el-container class="main-container">
        <el-header style="height: 75px;">
          <NevBar ></NevBar>
        </el-header>
        <el-main class="contents-container">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import NevBar from "../components/NevBar.vue";
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container{
    height:100%;
    .contents-container{
       background-color: #efefefe5; 
            overflow: auto;
        
     
      .content-container{
       
      
          background-color: #ffffff;
          height: calc(100% - 20px);
          padding:20px;
          
          border-radius: 4px;
           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      }
    }
   
  }
  
 }

:deep(.el-header) {
  padding: 0;
  margin: 0;
  
}
 






</style>
