// @ts-ignore
import service from '@/utils/request'




// @ts-ignore
export const login = (data) =>{

  return service.post('/user/login',data)


  
}

// @ts-ignore
export const categoryTree = () =>{
  return service.get('/knowledge/category/tree')
}

// @ts-ignore
export const articlePage = (params)=>{
  return service.get('/knowledge/article/page',{params})
}

// @ts-ignore
export const uploadFile = (file,businessInfo) =>{
  const formData = new FormData()
  formData.append('file',file)
  formData.append('businessType','ARTICLE')
  formData.append('businessId',businessInfo.businessId)
  formData.append('businessField','cover')

  return service.post('/file/upload',formData,{
    headers:{
    'Content-Type':'multipart/form-data'
    }
  })
}

// @ts-ignore
export const createArticle = (data) =>{
  return service.post('knowledge/article',data)
}

// @ts-ignore
export const updateArticle = (data) =>{
  return service.put(`/knowledge/article/${data.id}`,data)
}
// @ts-ignore

export const getArticle = (id) =>{
  return service.get(`/knowledge/article/${id}`)
}
// @ts-ignore
export const changeActiveStatus = (data) =>{
  return service.put(`/knowledge/article/${data.id}/status`,{status:data.status})
}
// @ts-ignore
export const deleteArticle = (id) =>{
  return service.delete(`knowledge/article/${id}`)
}

// @ts-ignore
export const getConsultations = (params) =>{
  return service.get('/psychological-chat/sessions',{params})
}

// @ts-ignore
export const getSessionDetail = (id) =>{
  return service.get(`/psychological-chat/sessions/${id}/messages`)
}

// @ts-ignore
export const getEmotionalDiary = (params) =>{
  return service.get('/emotion-diary/admin/page',{params})
}

 // @ts-ignore
 export const deleteEmotionalDiary = (id) =>{
  return service.delete(`/emotion-diary/admin/${id}`)
 }

 export const getOverview = () =>{
  return service.get('/data-analytics/overview')
 }

 export const logout = () =>{
  return service.post('/user/logout')
 }