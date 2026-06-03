<template>
  <el-dialog title="文章详情"
    v-model="dialogVisible"
    width="50%"
  
   >

   <el-form :model="formData" :props="props" label-width="120px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="formData.title"   placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
    </el-form-item>
    <el-form-item label="所属分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择所属分类" clearable>
        <el-option v-for="item in props.categoryOptions"  :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章摘要" prop="summary">
      <!-- // row 4 为行数,4个输入框高度 -->
      <el-input v-model="formData.summary" type="textarea" :rows="4" placeholder="请输入文章摘要" maxlength="1000" show-word-limit clearable></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tagArray">
      <el-select v-model="formData.tagArray" placeholder="请选择标签" multiple filterable allow-create style="width: 100%;" placement="bottom">
        <el-option v-for="item in commonTags" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上传图片">
      <div class="cover-upload">
        <el-upload
            class="upload-demo"
            action="#"
           :before-upload="beforeUpload"
           :http-request="handleUploadRequest"
           accept=".jpg,.png"
           :show-file-list="false"
        >
          <div class="cover-placeholder">
            <p v-if="!imgUrl">点击上传封面</p>
            <el-image v-if="imgUrl" :src="imgUrl" class="cover-image" alt="封面图片" />
          </div>
       
      </el-upload>
      <div v-if="imgUrl" class="cover-remove">
        <el-button type="danger" @click="removeImage">删除图片</el-button>
      </div>
  </div>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <RichTextEditor 
      v-model="formData.content" 
      
      
      min-height="400px" 
      :maxcharCount="5000"
      
      placeholder="请输入文章内容"
      @change="handleContentChange"
      @create="handleEditorCreate"
      />
    </el-form-item>

    

   </el-form>
   <div v-if="btnPreview">
      <p>预览效果:</p>
      <div v-html="formData.content"></div>
    </div>
   <template #footer>
    
    <el-button  @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
    <el-button  @click="handleClose">取消</el-button>
    <el-button  v-if="!formData.id" @click="handleSubmit"  :loading="loading">提交文章</el-button>
    <el-button  v-else @click="handleUpdate" :loading="loading">更新文章</el-button>
    
   
   </template>
    


    
   
  </el-dialog>  
</template>
  <script setup>
  import { uploadFile ,createArticle, updateArticle} from '@/api/admin'
import { ref ,nextTick} from 'vue'
import { ElMessage } from 'element-plus'
import { fileBaseurl } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { defineEmits } from 'vue'


const emit = defineEmits(['submit'])
//before-upload的方法必须返回ture时才会继续执行下面的方法
const beforeUpload = (file) => {
  // 上传前的操作,可以对上传的数据进行校验
  // 判断上传的文件类型是不是图片
  const isImage = file.type .startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if(!isImage){
    ElMessage.error('请上传图片文件')
    return false
  }
  if(!isLt5M){
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true


 
}

const btnPreview = ref(false)
const ruleFormRef = ref(null)



const handleContentChange = (content) => {
  formData.value.content = content.html
   console.log(content.html )
}


//editor创建时,把content赋值给editor,editor是富文本编辑器的实例,必须等editor创建完成,才能赋值,而赋值是异步操作,要用到nextTick
const handleEditorCreate = (editor) => {
  if(formData.value.content && editor){
    nextTick(() => {
      editor.setHTML(formData.value.content)
    })
  }
}








const removeImage = () => {
  imgUrl.value = ''
  formData.value.coverImage = ''
}



const handleUploadRequest = async({file}) => {

  // 生成唯一标识符，使用时间戳和随机数的组合，确保兼容性
  const businessId = crypto.randomUUID()
  console.log(businessId);
  



  
  const res = await uploadFile(file,{
    businessId:businessId,
   
  })
  console.log(res);

    //拼接完整路径,你给后端上传文件之后他会给你返1个filePath,你需要拼接上基础文件地址,才能得到完整的路径，
    
    imgUrl.value = fileBaseurl + res.filePath
    console.log(imgUrl.value);
    // 还要把这个路径在最后提交的时候和其他的数据一起返回给后端
    formData.value.coverImage = res.filePath
  }


const imgUrl = ref('')

const rules = ref({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 200, message: '文章标题长度必须在1到200个字符之间', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择所属分类', trigger: 'blur' },

  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 2, max: 5000, message: '文章内容长度必须在2到5000个字符之间', trigger: 'blur' },
  ],
 
})








const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]


const dialogVisible = ref(false)

const formData = ref({
  id:'',
  title:'',
  content:'',
  categoryId:'',
  coverImage:'',
  summary:'',
  tagArray:[]
})

const props = defineProps({
  categoryOptions: {
    type: Array,
    default: () => [],
  },
})

const handleOpen = (data) => {
  dialogVisible.value = true
  if(data){
    formData.value = data
    imgUrl.value = fileBaseurl + data.coverImage
  } else {
    formData.value = {
      id:'',
      title:'',
      content:'',
      categoryId:'',
      coverImage:'',
      summary:'',
      tagArray: []
    }
    imgUrl.value = ''
  }
  }

const handleClose = () => {
  dialogVisible.value = false
}

const loading = ref(false)

const handleSubmit = async () => {
  try {
    if (ruleFormRef.value) {
      await ruleFormRef.value.validate()
    }
    loading.value = true
    const submitData = {
      ...formData.value,
      tags:formData.value.tagArray.join(',') 
    }
    delete submitData.tagArray
    
   
     
      await createArticle(submitData)
    
    
    loading.value = false
    handleClose()
    emit('submit')
    ElMessage.success('提交成功')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
    loading.value = false
  }
}

const handleUpdate = async () => {
  try {
    if (ruleFormRef.value) {
      await ruleFormRef.value.validate()
    }
    loading.value = true
    const submitData = {
      ...formData.value,
      tags:formData.value.tagArray.join(',') 
    }
    delete submitData.tagArray
    
    
    await updateArticle(submitData)
    
    
    loading.value = false
    handleClose()
    emit('submit')
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败，请重试')
    loading.value = false
  }
}



defineExpose({
  handleOpen,

})






</script>

<style  lang="scss" scoped>
.cover-placeholder{
  width:200px;
  height:120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  background: #ebf0f97d;
}
.cover-image{
  width: 200px;
  height: 120px;
  display: block;
}
</style>
