import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useAdminStore = defineStore('admin',()=>{
  const isCollapsed = ref(false)

  const toggleCollapsed = () =>{
    isCollapsed.value = !isCollapsed.value
    console.log(isCollapsed.value);
  }

  const token = ref('')

  const userInfo = ref({})

  // @ts-ignore
  const setToken = (newToken) =>{
    token.value = newToken
  }

  // @ts-ignore
  const setUserInfo = (newUserInfo) =>{
    userInfo.value = newUserInfo
  }

  const clearToken = () =>{
    token.value = ''
  }

  const clearUserInfo = () =>{
    userInfo.value = {}
  }

  const clearIsCollapsed = () =>{
    isCollapsed.value = false
  }

  return{
    isCollapsed,
    toggleCollapsed,
    token,
    userInfo,
    setToken,
    setUserInfo,
    clearToken,
    clearUserInfo,
    clearIsCollapsed
  }
   
},{  persist: {
    key: 'admin',
    storage: localStorage,
    paths: ['token', 'userInfo', 'isCollapsed']
  }
})


