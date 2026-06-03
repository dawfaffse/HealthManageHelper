<template>

    <div class="consultations-container">
        <PageHead title="咨询记录" />
        <el-table :data="tableData" style="width: 100%" v-loading="loadingTable">
         <el-table-column  label="会话ID" width="120" >
            <template #default="scope">
                 <el-avatar>{{ scope.row.userNickname }}</el-avatar>
            </template>
         </el-table-column>
         <el-table-column label="情绪日志"  >
            <template #default="scope">
               <div class="sessin-title">{{ scope.row.sessionTitle }}</div>
               <div class="sessin-preview">{{ scope.row.lastMessageContent }}</div>
            </template>
         </el-table-column>
          <el-table-column label="消息数" width="180" prop="messageCount"  />
           <el-table-column label="时间" width="180" prop="lastMessageTime"  />
           <el-table-column label="操作" width="100" >
            <template #default="scope">
               <el-button type="primary" @click="viewSessionDetail(scope.row)" text >详情</el-button>
            </template>
         </el-table-column>
   
        </el-table>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
      <el-pagination
        layout="prev, pager, next, sizes, total"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        @change="handleChange"
        @size-change="handleSizeChange"      
      />
      
      <!-- //:close-on-click-modal 关闭弹窗时是否点击遮罩层关闭弹窗，默认是 -->
      <el-dialog width="70%" v-model="showDetailDialog" title="咨询详情" :close-on-click-modal="false">
       <div class="session-datail">
        <div class="datail-header">
            <div class="datail-row">
                <div class="datail-laber">用户:</div>
                <div class="datail-value">{{ sessionDetail.userNickname }}</div>
            </div>
             <div class="datail-row">
                <div class="datail-laber">开始时间:</div>
                <div class="datail-value">{{ sessionDetail.startedAt }}</div>
            </div>
             <div class="datail-row">
                <div class="datail-laber">消息数:</div>
                <div class="datail-value">{{ sessionDetail.messageCount }}</div>
            </div>
        </div>
       
        <div class="messagea-container">
            <div class="messages-header">
                <h4>对话记录</h4>
            </div>
            <div class="messages-list" v-loading="loadingMessages">
                <div v-for="item in sessionMessages" :key="item.id" class="message-item" :class="item.senderType === 1 ? 'user-message' : 'ai-message'">
                    <div class="message-header">
                        <span class="sender">{{ item.senderType === 1 ? '用户' : 'AI助手' }}</span>
                        <span class="time">{{ item.createdAt }}</span>
                    </div>
                    <div class="message-content">{{ item.content }}</div>
                </div>
            </div>

        </div>
   </div>
   <template #footer>
    <el-button  @click="handleClose">关闭</el-button>
   </template>
        
      </el-dialog>
       
    
    </div>
    </div>

</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import { getConsultations } from '@/api/admin'
import { ref,onMounted } from 'vue'
import { getSessionDetail } from '@/api/admin'




const handleClose = () => {
  showDetailDialog.value = false
}

const showDetailDialog = ref(false)
const loadingMessages = ref(false)



const pagination = ref({
  currentPage:1,
  size:10,
  total:0
})

const tableData = ref([
    
])
const handleSearch = async () =>{
 const {total,records} = await getConsultations(pagination.value)
  pagination.value.total = total
  tableData.value = records
}

const loadingTable = ref(true)



onMounted(async () => {

 handleSearch()
  loadingTable.value = false
 


 


})

const handleChange = (currentPage)=>{
  pagination.value.currentPage = currentPage
  loadingTable.value = true
  handleSearch()
  loadingTable.value = false
}

const handleSizeChange = (size)=>{
    loadingTable.value = true
  pagination.value.size = size
  handleSearch()
  loadingTable.value = false
}

const sessionDetail = ref({})
const sessionMessages = ref([])

const viewSessionDetail = async (row) => {
 showDetailDialog.value = true
 loadingMessages.value = true

  
   await getSessionDetail(row.id).then((res) => {
    
      
     loadingMessages.value = false
     sessionDetail.value = row
    sessionMessages.value = res
   
   
   })
  
 
  
}

</script>
<style lang="scss" scoped>
.consultations-container{
  height: 100%;
  overflow: auto;
}
.session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-datail {
    max-height: 70vh;
    overflow-y: auto;
    .datail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .datail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .datail-laber {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .datail-value {
        color: #333;
      }
    }
  }
  .messagea-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>
