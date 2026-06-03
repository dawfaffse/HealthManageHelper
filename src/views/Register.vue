<template>
<div class="container">
  <div class="title">
    <div class="title-text">
    <h2>创建您的账户</h2>
    <p>请填写注册信息</p>
    </div>
  </div>
  <div class="form-container">
    <el-form :model="formData" label-position="top" :rules="rules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="用户名或邮箱" prop="username">
        <el-input  v-model="formData.username" placeholder="请输入用户名或邮箱" size="large" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" size="large" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称(可选)" size="large" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号(可选)" size="large" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码" type="password" size="large" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formData.confirmPassword" placeholder="请再次输入密码" type="password" size="large" show-password/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="large" @click="submitForm" class="btn">注册</el-button>
      </el-form-item>
      
      <el-form-item >
        <el-link type="primary"  @click="handleLogin">已有账号？登录</el-link>
      </el-form-item>

      </el-form>
  </div>
</div>


</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import {useAdminStore} from '@/store/admin'
import {register} from '@/api/frontend'

const adminStore = useAdminStore()

const router = useRouter()

const  ruleFormRef = ref(null)





const handleLogin = () => {
  router.push('/auth/login')
}

const formData = reactive({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": ""  ,
    "confirmPassword": "",
    "gender": 1,
    "userType": 1
})

const submitForm = async() => {
  if(!ruleFormRef.value){
    return
  }

  try {
    await ruleFormRef.value.validate()
    console.log('注册请求数据:', formData)
    const res = await register(formData)
    console.log('注册响应数据:', res)
    
    // 检查注册是否成功，根据API测试工具的响应，成功时code是200
    if(res.code === '200' || res.code === 200 || res.success === true){
      ElMessage.success('注册成功')
      router.push('/auth/login')
    }else{
      ElMessage.error(res.msg || res.message || '注册失败')
    }
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请重试')
  }
}

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ]
})

</script>
<style lang="scss" scoped>
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>
