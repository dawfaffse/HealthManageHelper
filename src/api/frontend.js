// @ts-ignore
import service from '@/utils/request'

// @ts-ignore
export const register = (data) => {
  return service.post('/user/add',data)
}

// @ts-ignore
export const startSession = (data) => {
  return service.post('/psychological-chat/session/start',data)
}

export const getSessionList = (data)=>{
  return service.get('/psychological-chat/sessions', { params: data })
}

export const deleteSession = (id) =>{
  return service.delete(`/psychological-chat/sessions/${id}`)
}

export const getSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export const getSessionEmotion = (sessionId) => {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

export const submitEmotionDiary = (data) => {
  return service.post('/emotion-diary',data)
}

export const getKnowledgeArticle = (data) => {
  return service.get('/knowledge/article/page', { params: data })
}

export const getKnowledgeArticleDetail = (id) => {
  return service.get(`/knowledge/article/${id}`)
}