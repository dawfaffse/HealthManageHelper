<template>
  <div class="knowledge-container" ref="knowledgeContainer">
    <div class="header-section">
      <div class="header-content">
        <el-image style="width: 60px; height: 60px" :src="imgurl" alt="情绪日记" />
        <h1>情绪日记</h1>
      </div>
    
    </div>
    <div class="content">
      <!-- 左菜单 -->
       <div class="recommend-section">
       <div class="section-title">推荐阅读</div>
       <div class="recommend-list">
        <div class="recommend-item" v-for="item in articleList" :key="item.id" @click="goToArticle(item.id)">
          <h4>{{ item.title }}</h4>
          <p class="read-count">
            <el-icon><Histogram /></el-icon>
            阅读量 {{ item.readCount }}
          </p>
        </div>
       </div>

       </div>
       <!-- 右侧 -->
       <div class="article-list">
        <div class="article-item" v-for="item in List" :key="item.id" @click="goToArticle(item.id)">
          <el-image style="width: 240px; height: 150px" :src="getImageUrl(item.coverImage)"  alt="文章封面" />
          <div class="info">
            <div class="title">
              <h3>{{ item.title }}
                <el-tag type="primary" plain>{{ item.categoryName }}</el-tag>
              </h3>
            </div>
            <div :style="{marginTop: '10px'}">
              <div class="flex-box">
                <el-icon><user /></el-icon>
                <span>{{ item.authorName }}</span>
              </div>
              <div class="flex-box">
                <el-icon><timer /></el-icon>
                <span>{{ dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </div>
              
            </div>
            <div :style="{marginTop: '10px'}">
              <div class="flex-box">
                <el-icon><Platform /></el-icon>
                <span>观看人数 {{ item.readCount }}</span>
              </div>
             
              
            </div>
            
          </div>
        </div>
        <!-- 分页 -->
       
       </div>

    </div>
     <div class="pagination-wrapper">
      <el-pagination
        layout="prev, pager, next, sizes, total"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        @change="handleChange"
        @size-change="handleSizeChange"
       
      />
    </div>
   
  </div>
</template>
<script setup>
import { getKnowledgeArticle } from '@/api/frontend'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import dayjs from 'dayjs'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const knowledgeContainer = ref(null)

// 保存滚动位置
const saveScrollPosition = () => {
  if (knowledgeContainer.value) {
    sessionStorage.setItem('knowledgeScrollTop', knowledgeContainer.value.scrollTop.toString())
  }
}

// 恢复滚动位置
const restoreScrollPosition = () => {
  nextTick(() => {
    if (knowledgeContainer.value) {
      const scrollTop = sessionStorage.getItem('knowledgeScrollTop')
      if (scrollTop) {
        knowledgeContainer.value.scrollTop = parseInt(scrollTop)
      }
    }
  })
}

const handleChange = (val) => {
  pagination.value.currentPage = val
  getPageList()
}

const handleSizeChange = (val) => {
  pagination.value.size = val
  getPageList()
}

// 跳转详情页
const goToArticle = (id) => {
  saveScrollPosition()
  router.push(`/knowledge/article/${id}`)
}

onMounted(() => {
  getKnowledgeArticle({
    sortField: 'readCount',
    sortDirection: 'desc',
    currentPage: 1,
    size: 5,
  }).then(res => {
    articleList.value = res.records
  })

  getPageList()
})

const articleList = ref([])

const pagination = ref({
 
    currentPage: 1,
    size: 10,
    total: 0,
})

const getImageUrl = (url) => {
  return url? 'http://159.75.169.224:1235' + url : 'https://file.itndedu.com/psychology_ai.png'
}

const List = ref([])

const getPageList = () => {
  getKnowledgeArticle({
    sortField: 'publishedAt',
    sortDirection: 'desc',
    ...pagination.value,
  }).then(res => {
    List.value = res.records
    pagination.value.total = res.total
    // 恢复滚动位置
    restoreScrollPosition()
  })
}

// 组件卸载前保存滚动位置
onBeforeUnmount(() => {
  saveScrollPosition()
})

const imgurl = new URL('@/assets/images/book.png', import.meta.url).href
</script>
<style lang="scss" scoped>
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    height: 100vh;
    overflow-y: auto;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
    }
    .header-section {
        background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            height: 400px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                .info {
                    margin-left: 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}
</style>