<template>  
  <div class="auth-layout">
   <div class="left-section">
    <div class="content">
      <h2 class="title">小独角兽心理助手</h2>
      <p class="text">在梦幻的星空下，小独角兽用温柔的光芒守护着您，倾听您的故事，抚慰您的心灵</p>
       <div class="unicorn">
      <el-image style="width: 90px; height: 90px" :src="unicornUrl" alt="可爱独角兽"  />

    </div>
    </div>
   
   </div>
     <div class="right-section"> <router-view></router-view></div>
  
  </div>
</template>
<script setup>
import unicornImg from '@/assets/iconPNG(1)/独角兽 unicorn.png'
const unicornUrl = unicornImg
</script>
<style lang="scss" scoped>
.auth-layout {
    display: flex;
    .left-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E9 50%, #FFD1DC 100%);
        height: 100vh;
        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .title {
                margin-bottom: 20px;
                font-size: 40px;
                font-weight: bold;
                color: #5D4E6D;
            }
            .text {
                margin-bottom: 20px;
                width: 460px;
                font-size: 20px;
                color: #7B6888;
                text-align: center;
            }
            .unicorn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 160px;
                height: 160px;
                border-radius: 50%;
                border: 2px solid rgba(255, 182, 193, 0.4);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 182, 193, 0.3) 100%);
                box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2),inset 0 1px 0 rgba(255, 255, 255, 0.8);
            }
        }
    }
    .right-section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100vh;
        background-color: #fff;
    }
}
</style>
