<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">
          小独角兽的魔法<br />
          <span class="highlight-text">治愈每一颗心灵</span>
        </h2>
        <p class="description">
          在梦幻的星空下，小独角兽用温柔的光芒守护着您，
          倾听您的故事，抚慰您的心灵，陪伴您度过每一个美好的时光
        </p>
        <div class="hero-actions">
          <el-button size="large" @click="$router.push({path:'/consultations', query:{redirect:$route.fullPath}})">开启心灵之旅</el-button>
          <el-button style="border-color:#fff" color="transparent" @click="$router.push({path:'/emtion-diary', query:{redirect:$route.fullPath}})"  size="large">记录美好心情</el-button>
        </div>
      </div>
      <div class="unicorn-container">
        <div class="sparkles">✨</div>
        <div class="unicorn">
          <el-image :src="unicornUrl" alt="可爱独角兽" style="width: 180px; height: 180px;" class="unicorn-logo" />
        </div>
        <div class="sparkles-bottom">🦄</div>
      </div>
    </div>
    <!-- 装饰元素 -->
    <div class="floating-hearts">
      <span class="heart heart-1">💕</span>
      <span class="heart heart-2">💖</span>
      <span class="heart heart-3">💗</span>
      <span class="heart heart-4">💝</span>
      <span class="star star-1">⭐</span>
      <span class="star star-2">🌟</span>
      <span class="star star-3">✨</span>
    </div>
  </div>
</template>

<script setup>
import unicornImg from '@/assets/iconPNG(1)/独角兽 unicorn.png'
const unicornUrl = unicornImg
</script>

<style lang="scss" scoped>
.home-container {
    background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E9 50%, #FFD1DC 100%);
    color: #5D4E6D;
    padding: 5rem 0;
    height: calc(100vh - 111px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 50px;
      z-index: 1;
      
      .text {
          width: 550px;
          .title {
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 20px;
              line-height: 1.2;
              text-shadow: 0 2px 10px rgba(255, 105, 180, 0.3);
              .highlight-text {
                  color: #FF69B4;
                  text-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
              }
          }
          .description {
              font-size: 18px;
              line-height: 1.8;
              color: #7B6888;
              margin-bottom: 30px;
              background: rgba(255, 255, 255, 0.6);
              padding: 20px;
              border-radius: 15px;
              border-left: 4px solid #FF69B4;
          }
          .hero-actions {
              margin-top: 20px;
              :deep(.el-button) {
                  padding: 14px 36px;
                  font-size: 16px;
                  border-radius: 30px;
                  background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
                  border: none;
                  box-shadow: 0 5px 20px rgba(255, 105, 180, 0.4);
                  &:hover {
                      transform: translateY(-3px);
                      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.5);
                  }
              }
              :deep(.el-button:nth-child(2)) {
                  background: transparent;
                  border: 2px solid rgba(255, 255, 255, 0.8);
                  color: #5D4E6D;
                  &:hover {
                      background: rgba(255, 255, 255, 0.3);
                  }
              }
          }
      }
      
      .unicorn-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .sparkles {
              font-size: 32px;
              animation: sparkle 1s ease-in-out infinite;
              margin-bottom: 10px;
          }
          
          .unicorn {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 280px;
              height: 280px;
              border-radius: 50%;
              border: 3px solid rgba(255, 182, 193, 0.4);
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 182, 193, 0.3) 100%);
              box-shadow: 
                  0 10px 40px rgba(255, 105, 180, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8),
                  0 0 60px rgba(255, 215, 0, 0.2);
              animation: float 3s ease-in-out infinite;
              
              .unicorn-logo {
                  animation: bounce 2s ease-in-out infinite;
                  filter: drop-shadow(0 4px 10px rgba(255, 105, 180, 0.3));
              }
          }
          
          .sparkles-bottom {
              font-size: 28px;
              margin-top: 10px;
              animation: sparkle 1.5s ease-in-out infinite reverse;
          }
      }
    }
    
    .floating-hearts {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        
        .heart, .star {
            position: absolute;
            animation: floatUp 8s ease-in-out infinite;
            opacity: 0.6;
        }
        
        .heart-1 {
            font-size: 24px;
            left: 10%;
            animation-delay: 0s;
        }
        .heart-2 {
            font-size: 20px;
            left: 25%;
            animation-delay: 2s;
        }
        .heart-3 {
            font-size: 28px;
            right: 20%;
            animation-delay: 4s;
        }
        .heart-4 {
            font-size: 18px;
            right: 10%;
            animation-delay: 6s;
        }
        .star-1 {
            font-size: 22px;
            left: 15%;
            animation-delay: 1s;
        }
        .star-2 {
            font-size: 26px;
            right: 30%;
            animation-delay: 3s;
        }
        .star-3 {
            font-size: 20px;
            left: 50%;
            animation-delay: 5s;
        }
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes bounce {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes sparkle {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }
}

@keyframes floatUp {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.8;
    }
    90% {
        opacity: 0.8;
    }
    100% {
        transform: translateY(-10vh) rotate(360deg);
        opacity: 0;
    }
}
</style>
