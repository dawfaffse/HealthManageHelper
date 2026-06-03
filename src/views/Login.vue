<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon @click="handleBackHome"><back/></el-icon>
        <p class="page-title">返回首页</p>
        
      </div>
      <div class="title-text">
        <h2>登录您的账号</h2>
        <p >请输入登录信息</p>

      </div>
    </div>
    
    <div class="form-container">
      <!-- 设置label的位置为顶部 -->
      <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-position="top">
     <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>
       <el-button class="btn" type="primary" @click="submitForm">登录账号</el-button>
      <div class="footer"> 
       
      <p class="register">还没有账号？<router-link to="/auth/register" >去注册</router-link></p>
      </div>
     
    </div>
  </div>
  

</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {login} from '@/api/admin'
import {useAdminStore} from '@/store/admin'

const adminStore = useAdminStore()

const router = useRouter()

const ruleFormRef = ref(null)

const formData = ref({
  username: '',
  password: ''
})

const handleBackHome = () => {
  router.push('/home')
}

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' 
     
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const submitForm = async() => {
  await ruleFormRef.value.validate()
  const res = await login(formData.value)
  if(res.token){
    console.log(res)
    adminStore.setToken(res.token)
    adminStore.setUserInfo(res.userInfo)
   
    
    if(res.roleType === "2"){
      router.push('/back/dashboard')
    }else if(res.roleType === "1"){
      
       router.push('/home')
      
    }
  }else{
    ElMessage.error('登录失败')
  }
  
}

// 另一种接收参数的写法
// const submitFrom = ()=>{
//   ruleFormRef.value.validate((vaild) =>{
//     if(vaild){
//       router.push('/home')
//     }
//   })
// }

  




</script>

<style lang="scss" scoped>
.container{
   width:384px;
  .title{
    .back-home{
      cursor: pointer;
      margin-bottom: 60px;
       &:hover {
          color: #4A90E2;
       }
    }
    .title-text{
      text-align: center;
      h2{
        font-size: 24px;
       
        margin-bottom: 10px;
      }
      p{
        font-size: 16px;
        color: #909399;
        
      }
    }
    
  }
  .form-container{
    margin-top: 30px;
     .btn{
        margin-top: 40px;
        width: 100%;
        height: 40px;
       
      }
    .footer{
     padding:30px;
     text-align: center;

     
     
    }
  }

}
</style>


