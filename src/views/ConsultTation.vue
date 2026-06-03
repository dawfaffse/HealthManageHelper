<template>
  <div class="consultation-container">
    <div class="sidebar">
      <!-- AI助手信息 -->
       <div class="ai-assistant-info">
        <div class="breathing-circle">
          <img :src="iconUrl1" alt="AI助手" style="width: 50px; height: 50px;" />
          
        </div>
        <h3 class="assistant-name">小伊AI助手</h3>
        <div class="online-status">
            <div class="status-dot"></div>
            小独角兽在线服务
        </div>
       
      </div>
       <!-- 情绪花园 -->
      <div class="emotion-garden">
         <div class="garden-header">
            <div class="garden-title">情绪花园</div>    
         </div>
         <div class="emotion-info">
        <div class="emotion-name">中</div>
        <div class="emotion-score">50</div>
      </div>
      <div class="warm-tips">
        <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <span class="status-emotion">{{ currentEmotion.isNegative?'需要关注':'很不错' }}</span>
        </div>
        <div class="emotion-intensity">
            <span class="intensity-dots">
                <span v-for="item in 3" :key="item" class="dot" :class="{'active':getIntensity(currentEmotion.emotionScore) >=item}"></span>
            </span>
            <span class="intensity-text">
                {{ getIntensityText(currentEmotion.riskLevel) }}
            </span>
           
        </div>
          <div class = "warm-suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text" v-if="currentEmotion.suggestion">{{ currentEmotion.suggestion }}</div>
            </div>
        </div>
        <div class = "healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
           <div class="actions-title">治愈小行动</div>
           <div class="actions-list">
            <div class="action-item"  v-for="item in currentEmotion.improvementSuggestions" :key="item"> 
                <div class="action-icon">✨</div>
                 <div class="action-text">{{ item }}</div>
            </div>
           </div>
          

        </div>
        <div class="risk-notice" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
             <div class="notice-icon">🤗</div>
             <div class="notice-title">温馨提示</div>
             <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
        </div>
        
         

        </div>
      </div>
      

      
       <!-- 会话列表 -->
       <div class="session-history">
        <h4 class="section-title">会话历史</h4>
        <div class="session-list">
          <div class="session-item" v-for="item in sessionList" :key="item.id" @click="handleSessionClick(item)">
            <div class="session-info">
               <div class="session-title">
                 <span>{{ item.sessionTitle }}</span>
                 <div class="session-meta">
                   <span class="session-time">{{ item.startedAt }}</span>
                 </div>
                 <div class="session-preview">
                  {{ item.lastMessageContent }}
                 </div>
                 <div class="session-stats">
                   <span><el-icon><ChatRound /></el-icon>
                  {{ item.messageCount || 0 }}</span>
                   <span></span>
                   <span><el-icon><Clock /></el-icon>
                  {{ item.durationMinutes || 0 }}分钟</span>
                   <span></span>
                 </div>
               </div>
               <div class="session-actions">
                <el-button type="danger" text size="small" @click.stop="handleDelete(item.id)"><el-icon><DeleteFilled /></el-icon></el-button>
               </div>
            </div>
          </div>
        </div>

       </div>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="iconUrl2" class="avatar-image" alt="AI头像" style="width: 30px; height: 30px;" />
            </div>
            <div class="chat-info">
            <h2>小伊AI助手</h2>
            <p>您专属的开心魔法小助手</p>
            </div>
          
        </div>
        <el-button circle @click="createNewSession" title="新增会话">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
      <!-- 聊天消息区域 -->
       <div  class="chat-messages" ref="msgContainer">
        <div class="message-item ai-message" v-if="message.length === 0">
          <div class="message-avatar">
            <el-image :src="iconUrl1"  alt="AI头像" style="width: 18px; height: 18px;" />
          </div>
          <div class="message-content"> 
            <div class="message-bubble">
              <p>你好呀☺ ! 我是小伊 , 你的专属魔法小助手 , 很高兴可以遇到你 , 你有什么烦恼都可以告诉我 , 我可以用魔法帮你解决哦 !</p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <!-- 消息列表 -->
         <div class="message-item" v-for="item in message" :key="item.id" :class="item.senderType ===1 ? 'user-message' : 'ai-message'">
          <div class="message-avatar">
            <el-image v-if="item.senderType ===1" :src="iconUrl3" alt="用户头像" style="width: 30px; height: 30px;" />
            <el-image v-if="item.senderType ===2" :src="iconUrl1" alt="AI头像" style="width: 30px; height: 30px;" />
          </div>
          <div class="message-content">
            <div class="message-bubble">
                <!-- ai无内容,返回3个点 -->
                <div v-if="item.senderType ===2 && isAiTyping && !item.content" class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <!-- AI错误的提示 -->
                 <div v-else-if="item.isError" class="error-message">
                    <p>{{ item.content }}</p>
                 </div>
                 <!-- 正常AI消息 -->
                 
                 <MarkdownRenderer v-else-if="item.senderType ===2 &&!item.isError" :content="item.content" :is-ai-message="true"/>
               
                 <!-- 用户消息 -->
                 
                 <p v-else-if="item.content" v-html="formatMessageContent(item.content)"></p>
                </div>
                 <div class="message-time">{{ item.senderType === 2 && isAiTyping ? '正在思考中...' : item.createdAt }}</div>
            </div>
           
          </div>
          
         </div>
          <!-- 消息输入区域 -->
        <div class="chat-input">
          <div class="input-container">
            <el-input v-model="userMessage" placeholder="请输入你现在的心情吧❤❤❤" type="textarea" :rows="3" :disabled="isAiTyping" @keyup.enter="handerKeyDown" class="message-input" clearable></el-input>
            <div class="input-footer">
                <span>按住Enter键发送,Shift+Enter发送换行</span>
                <span>{{ userMessage.length }}/500</span>
            </div>
          </div>
          <el-button class="send-btn" :disabled="userMessage.length === 0 || userMessage.length > 500" @click="sendMessage" type="primary"><el-icon><Promotion /></el-icon></el-button>
        </div>
        </div>
      
    </div>
    

  
</template>
<script setup>
import { ref ,onMounted} from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { startSession,getSessionList,deleteSession,getSessionDetail } from '@/api/frontend'
import { ElMessage } from 'element-plus'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useAdminStore } from '@/store/admin'
import { nextTick } from 'vue'
import { getSessionEmotion } from '@/api/frontend'













const iconUrl1 = new URL('@/assets/iconPNG(1)/独角兽 unicorn.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/iconPNG(1)/gengduomaochong.png', import.meta.url).href

const createNewFrontendSession = () => {
    console.log('新增会话')
}

const handerKeyDown = (e) => {
   
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }

}

const currentEmotion = ref({
    primaryEmotion:'中',
    emotionScore:50,
    isNegative:false,
    riskLevel:0,
    suggestion:'情绪状态平稳',
    improvementSuggestions:[]
   })

const loadSessionEmotion = (sessionId) => {
   const id =  sessionId.toString().startsWith('session_')? sessionId :  'session_'+sessionId
  getSessionEmotion(id).then((res)=>{
    console.log(res)
    currentEmotion.value = res
  })
}   

//点击会话历史更新
const handleSessionClick = (item) => {
  console.log(item)
  getSessionDetail(item.id).then((res)=>{
    console.log(res)
    message.value = res
  })
  loadSessionEmotion(item.id)
  //点击后把点击的会话设置为当前会话
  currentSession.value .sessionId = "session_"+item.id
  currentSession.value.status = 'ACTIVE'
  currentSession.value.sessionTitle = item.sessionTitle
  scrollToBottom()
  
}

//格式化消息内容,将Markdown转换为HTML,处理简单的换行元素
const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br>')
}



const handleDelete = async (id) => {
  await deleteSession(id)
  getSessionPage()

  // 如果删的是当前会话，清空消息
  if (currentSession.value.sessionId === 'session_' + id) {
    message.value = []
    createNewSession()
  }
}


//给后端发消息让他建一个新的会话,这个是给临时会话用的
const createNewSession = async () => {
 const newSession = {
  sessionId:`temp-${Date.now()}`,//时间戳创建会话的唯一标识
  status:'TEMP',
  sessionTitle:'新对话'
 }
  message.value = [] // 关键：清空旧消息
 currentSession.value = newSession
}

//表明当前是在哪一个会话中,每创建一个新会话,就会有一个新的currentSession
const currentSession = ref({})
const sessionList = ref([])
const message = ref([])

const isAiTyping = ref(false)

const userMessage = ref('')
const msgContainer = ref(null) // 消息滚动容器
// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const el = msgContainer.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

//发消息的事件
const sendMessage = ()=>{
  if(!userMessage.value.trim()){//去掉首尾空格
    return
  }
  if(isAiTyping.value){
    ElMessage({
      message:'AI正在思考中,请稍后'
    })
    return
  }

  const msgContent = userMessage.value.trim() 
  userMessage.value = ''


  //添加用户消息到消息列表
  const userMessageObj = {
    id:`user_${Date.now()}-${Math.random().toString(36).substring(2,9)}`,
    senderType:1,
    sendType:1,
    content:msgContent,
    createdAt:new Date().toISOString()
  }
  message.value.push(userMessageObj)
  scrollToBottom()



  //如果是临时会话(就是一开始ai发的那一段话),就创建一个新的会话，因为一开始或者创建新会话时都是那个临时会话
  if(currentSession.value.status === 'TEMP'){
    //如果是临时会话,就创建一个新的会话
    startNewSession(msgContent)//发送时创建一个真正用来对话的会话

    return
  }
   StartAIResponse(currentSession.value.sessionId,msgContent)
}

const startNewSession = async (message) => {
  const sessionParams = {
    initialMessage:message,
    sessionTitle:''
  }
  if(currentSession.value.sessionTitle ==='新对话'){
    sessionParams.sessionTitle = `小伊AI助手 - ${new Date().toLocaleString()}`
  }else{
    //如果不是新对话,就用当前的会话标题
    sessionParams.sessionTitle = currentSession.value.sessionTitle
  }
//得到新对话的会话信息

    const res = await startSession(sessionParams)
    const sessionDtat = {
      sessionId:res.sessionId,
      sessionTitle:sessionParams.sessionTitle,
      status:res.status
    }
    //看有没有临时会话，如果有，就直接代替临时会话
    if(currentSession.value && currentSession.value.status === 'TEMP'){
      currentSession.value = sessionDtat
    }else{
      //没有就表明是正式对话,合并数据,将新会话的信息赋值给currentSession.value
      Object.assign(currentSession.value,sessionDtat)
    }
    //更新会话列表
    getSessionPage()
    
    //开始流式对话
    StartAIResponse(currentSession.value.sessionId,message)
  
  

}

//ai开始流式对话,要将这个表示Ai正在思考中,请稍后设置为true
const StartAIResponse = async (sessionId,userMessage) => {
    //防止重复发送
    const adminStore = useAdminStore()
    if(isAiTyping.value){
      ElMessage({
        message:'AI正在思考中,请稍后'
      })
      return
    }
        isAiTyping.value = true
  const aiMessage = {
    id:`ai_${Date.now()}-${Math.random().toString(36).substring(2,9)}`,
    senderType:2,

    content:'',
    sendType:2,
    createdAt:new Date().toISOString()
  }
message.value.push(aiMessage)

    //调用流式接口,要下载插件,引入再使用
    //结束请求的方法,要关闭流
    const ctrl = new AbortController()//用来终止请求
    
    fetchEventSource(('/api/psychological-chat/stream'),{
        method:'POST',
        headers:{
        'Content-Type':'application/json',
        'Token':adminStore.token,
        'Accept':'text/event-stream'
        },
       body:JSON.stringify({
        sessionId,
        userMessage
       }),
       signal:ctrl.signal,
       onopen:(response)=>{//失败的返回
        console.log(response)
        if(response.headers.get('content-type') !== 'text/event-stream'){
            
            ElMessage({
                message:'流式接口返回的不是text/event-stream,请检查接口是否正常'
            })
            isAiTyping.value = false
            ctrl.abort()//中断请求
            return
        }
       },
       onmessage:(event)=>{//成功的返回
        console.log(event)
        const raw = event.data.trim()
        if(raw){
          const eventName = event.event
          //当前会话的AI消息
          const aiMessage = message.value[message.value.length-1]//将一点一点返回的数据赋值给当前AI消息的内容

          if(eventName === 'done'){
            isAiTyping.value = false
            ctrl.abort()//中断请求
             loadSessionEmotion(currentSession.value.sessionId)
          
            return
          }

          const payload = JSON.parse(raw)
         
          if(String(payload.code) === '200' && payload.data && payload.data.content){
            //如果返回的内容不是空字符串,就将返回的内容添加到当前AI消息的内容中
            aiMessage.content += payload.data.content
          }
        }else if(String(payload.code) !== '200'){
            handleError(payload.message || 'AI回复失败')
            return
        }
        scrollToBottom()
       
        },
        onerror:(err)=>{
          handleError(err|| 'AI回复失败')
          throw err
        },
        onclose:()=>{
          loadSessionEmotion(currentSession.value.sessionId)
        }
        })
}

//错误处理函数
const handleError = (error) => {
  const aiMessage1 = message.value[message.value.length-1]
  if (aiMessage1){
    
    aiMessage1.content = 'AI回复失败,请稍后重试'
  }
  isAiTyping.value = false
  ElMessage({
    message:error
  })
}

const getSessionPage = async () => {
  getSessionList({
    pageNum:1,
    pageSize:10
  }).then((res)=>{
    console.log(res)
    sessionList.value = res.records
  })
}

const session = ref({
   
})

const getIntensity = (item) => {
  if(item>=61){
    return 3
  }else if(item>=31){
    return 2
  }else{
    return 1
  }
}

const getIntensityText = (level) => {
  switch(level){
    case 0:
      return '正常'
    case 1:
      return '关注'
    case 2:
      return '预警'
    case 3:
      return '危机'
    default:
    return '未知'
  }
}



onMounted(() => {
    createNewSession()
    getSessionPage()
})

</script>
<style lang="scss" scoped>
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;
    .sidebar {
        width: 320px;
        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            .breathing-circle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #d295f7 0%, #98dee3 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(219, 60, 251, 0.25);
                position: relative;
            }
            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #3c82fb, #b47ce7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }
            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }
        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }
                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }
                    .session-info {
                        flex: 1;
                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 6px;
                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .session-stats {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }
                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }
                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .emotion-garden {
            background: linear-gradient(135deg, #fce4ec 0%, #e0f7fa 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;
            
            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }
            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;
                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }
            .warm-tips {
                text-align: center;
                margin-bottom: 16px;
                .emotion-status-text {
                    margin-bottom: 12px;
                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }
                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }
                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    .intensity-dots {
                        display: flex;
                        gap: 4px;
                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;
                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }
                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }
                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .suggestion-content {
                        text-align: left;
                        flex: 1;
                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }
                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }
                .healing-actions {
                    margin-bottom: 16px;
                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 16px;
                    }
                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;
                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }
                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }
                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .notice-content {
                        flex: 1;
                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }
                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }
    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        .chat-header {
           background: linear-gradient(135deg, #fce4ec 0%, #e0f7fa 100%);
            color: rgba(63, 28, 94, 0.683);
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;
            .header-left {
                display: flex;
                align-items: center;
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    p {
                        font-size: 14px;
                    }
                }
            }
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                .message-avatar {
                    
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }
                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #d295f7 0%, #98dee3 100%);
                       box-shadow: 0 6px 24px rgba(219, 60, 251, 0.25);
                    }
                }
                &.user-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }
                .message-content {
                    max-width: 70%;
                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;
                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;
                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }
                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }   
                            }
                        }
                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }
                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }
        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            width: 100%;
           
            .input-container {
                flex: 1;
            }
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }
            .send-btn {
                height: 60px;
                width: 60px;
                border-radius: 16px;
                 background: linear-gradient(135deg, #d295f7 0%, #98dee3 100%);
                border: none !important;
                box-shadow: 0 6px 20px rgba(162, 60, 251, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
</style>
