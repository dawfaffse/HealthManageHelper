<template>

<div class="navbar" style="width: 100%;height: 75px;">
    <div class="flex-box">
        <el-button @click="toggleCollapsed">
            <el-icon><Expand/></el-icon>
         
        </el-button>
           <p class="page-title">{{ route.meta.title }}</p>
      
    </div>
    <div class="flex-box">

        <el-dropdown @command="handleCommand">
 
            <div class="flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">

                    </el-avatar>
                    <p class="user-name">admin</p>
                    <el-icon><ArrowDown/></el-icon>
                </div>
            <template #dropdown>
                
                <el-dropdown-menu>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    
                </el-dropdown-menu>
               
            </template>
        </el-dropdown>
    </div>
</div>
    

</template>

<script setup>
import {useAdminStore} from '@/store/admin'
import { useRoute, useRouter } from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {logout} from '@/api/admin'
const adminStore = useAdminStore()

const router = useRouter()
const route = useRoute()

const toggleCollapsed = () =>{
    adminStore.toggleCollapsed()
}
const handleCommand = (command) => {
    if(command === 'logout'){
       ElMessageBox.confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout().then(()=>{
            adminStore.clearToken()
            adminStore.clearUserInfo()
            adminStore.clearIsCollapsed()
            router.push('/auth/login')
        }).catch((error) => {
            console.error('退出登录失败:', error)
        })
      })
    }
}
</script>
<style lang="scss" scoped>
.navbar{
    height:64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e4e7ed;
    .flex-box{
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .page-title{
        margin-left:20px;
        font-size: 26px;
        font-weight: bold;
        color: #303133;
    }
}

  
</style>
