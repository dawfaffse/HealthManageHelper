import { createRouter, createWebHistory } from "vue-router";


// @ts-ignore
import BackendLayout from "@/views/BackendLayout.vue";
import {useAdminStore} from '@/store/admin'
import {ElMessage} from 'element-plus'
import FrontendLayout from '@/components/FrontendLayout.vue'




//@路径要先在vite.config.js中配置才能使用
const FrontendRouter = [
    {
      path: "/",
      component: FrontendLayout,
      redirect: "/home",
      children:[
      {
        path: "home",
        // @ts-ignore
        component: () => import("@/views/Home.vue"),
        meta:{
          title:"首页",
         
        }
      },
      {
        path: "consultations",
        // @ts-ignore
        component: () => import("@/views/ConsultTation.vue"),
        meta:{
          title:"AI咨询",
         
        }
      },
      {
        path: "emtion-diary",
        // @ts-ignore
        component: () => import("@/views/EmotionalDiary.vue"),
        meta:{
          title:"情绪日记",
         
        }
      },
      {
        path: "knowledge",
        // @ts-ignore
        component: () => import("@/views/KnowLedgee.vue"),
        meta:{
          title:"知识库",
         
        }
      },
       {
          path:"/knowledge/article/:id",
          component: () => import("@/views/Article.vue"),
        }
        
     ]
    },
]



const BackendRouter = [
    
    {
      path: "/back",
       redirect: "/back/dashboard",
      component: BackendLayout,
      children: [
        {
          path: "dashboard",
          // @ts-ignore
          component: () => import("@/views/DashBoard.vue"),
          meta:{
            title:"数据分析",
            icon:"PieChart",
          }


        }
        ,
        {
          path: "consultations",
          // @ts-ignore
          component: () => import("@/views/ConsulTations.vue"),
          meta:{
            title:"咨询记录",
            icon:"Message",
          }
        },
         {
          path: "knowledge",
          // @ts-ignore
          component: () => import("@/views/KnowLedge.vue"),
          meta:{
            title:"知识文章",
            icon:"ChatLineSquare",
          }
        },
         {
          path: "emotional",
          // @ts-ignore
          component: () => import("@/views/Emotional.vue"),
          meta:{
            title:"情绪日志",
            icon:"User",
          }
        },
       
      ],
      
    },
     {
          path: "/auth",
          // @ts-ignore
          component: () => import("@/components/Authlayout.vue"),
         children :[
          {
            path: "login",
            // @ts-ignore
            component: () => import("@/views/Login.vue"),
            meta:{
              title:"登录",
         
            }
          },
          {
            path: "register",
            // @ts-ignore
            component: () => import("@/views/Register.vue"),
            meta:{
              title:"注册",
         
            }
          }
         ]
        },
  ]




const router = createRouter({
  history: createWebHistory(),
  routes: [...FrontendRouter,...BackendRouter]
  
});

router.beforeEach((to, from, next) => {
   const adminStore = useAdminStore()
   const token = adminStore.token
   console.log(token);
   
   if(token ){
    const userInfo = adminStore.userInfo
    if(userInfo.userType === 2){
      if(to.path.startsWith('/back')){
        next()
      }
      else{
        next('/back/dashboard')
        
      }
    }else if(userInfo.userType === 1){
      if(to.path.startsWith('/auth')|| to.path.startsWith('/back')){
        next('/home')
      }
      else{
        next()
        
      }
    // }
}
   
   }else{
    if(to.path.startsWith('/back')){
      //后台跳转到登陆页面
     next('/auth/login')
     
    }else if(to.path === '/consultations'||to.path === '/emtion-diary'){
      next('/auth/login')
      


    }else{
      next()
    }
   }
})

export default router
