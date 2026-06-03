<script setup>
import PageHead from '../components/PageHead.vue';
import TableSearch from '../components/TableSearch.vue';
import { ref } from 'vue'
import { categoryTree } from '@/api/admin'
import { onMounted } from 'vue'
import { articlePage } from '@/api/admin'
import ArticleDialog from '../components/ArticleDialog.vue'
import { updateArticle,getArticle,changeActiveStatus } from '@/api/admin'
import { ElMessage,ElMessageBox } from 'element-plus'
import { deleteArticle } from '@/api/admin'


const articleDialog = ref(null)
const handleAdd = () => {
  articleDialog.value.handleOpen()
}



const categoryMap = ref({})
const categoryOptions = ref([])
const tableData = ref([])

const pagination = ref({
  total:100,
  size:10,
  currentPage:1,
})

const handleChange = (currentPage)=>{
  pagination.value.currentPage = currentPage
  handleSearch()
}

const handleSizeChange = (size)=>{
  pagination.value.size = size
  handleSearch()
}

const formItems = ref([
  {
    type: 'input',
    label: '文章标题',
    prop: 'title',
    placeholder: '请输入文章标题',
  },
  {
    type: 'select',
    label: '分类',
    prop: 'categoryId',
    placeholder: '请选择分类',
  },
  {
    type: 'select',
    label: '状态',
    prop: 'status',
    placeholder: '请输入状态',
    options: [
      {
        label:'草稿',
        value:0
      },
        {
        label:'已发布',
        value:1
      },
        {
        label:'已下线',
        value:2
      },
    ]
  },
])

const handleUnpublish = async(row) => {
   ElMessageBox.confirm(
    `确认下线文章${row.title}吗？`,
    '确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await changeActiveStatus({id:row.id,status:2})
    ElMessage.success('下线成功')
    handleSearch()
  })
}

const handlePublish = async(row) => {
  ElMessageBox.confirm(
    `确认发布文章${row.title}吗？`,
    '确认',
    {
      confirmButtonText: '确定发布',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    await changeActiveStatus({id:row.id,status:1})
    ElMessage.success('发布成功')
    handleSearch()
  })
}


const handleDelete = async(row) => {
  ElMessageBox.confirm(
    `确认删除文章${row.title}吗？`,
    '确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(async () => {
    await deleteArticle(row.id)
    ElMessage.success('删除成功')
    handleSearch()
  })
}

const handleSearch = async(formData)=>{

  const params = {
    ...(formData || {}),
    ...pagination.value
  }


  
    const {records,total} = await articlePage(params)
   
    
    
   
    
  
    
    tableData.value = records || []
    pagination.value.total = total 
    console.log('搜索结果:', records)

}

// 编辑文章
const handleEdit = async(row) => {
  const res = await getArticle(row.id)
  articleDialog.value.handleOpen(res)
}

onMounted(async() => {
  handleSearch()
  console.log(pagination.value)
   
  const res = await categoryTree()
  console.log("分类树res:",res)

  categoryOptions.value = res.map(item =>{
    categoryMap.value[item.id] = item.categoryName
   
    return {
      label: item.categoryName,
      
      value: item.id
    }
      
    })

     formItems.value[1].options =categoryOptions.value



})


</script>

<template>
  <div class="knowledge-container">
    <PageHead title="知识文章">
      <template #buttons>
        <el-button size="default" @click="handleAdd">新增</el-button>
      
      </template>
    </PageHead>
    <ArticleDialog ref="articleDialog" :categoryOptions="categoryOptions" @submit="handleSearch" />
    <TableSearch :formItems="formItems" @search="handleSearch" />
    <el-table :data="tableData" style="width:100%;margin-top: 25px;" >
      <el-table-column  label="文章标题"  fixed="left">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="分类" width="300">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{  categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  prop="authorName" label="作者" width="150">  </el-table-column>
      <el-table-column  prop="readCount" label="阅读量" width="150">  </el-table-column>
      <el-table-column  prop="updateTime" label="发布时间" width="150">  </el-table-column>
      <el-table-column  label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary" size="default" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status === 0 || scope.row.status === 2" @click="handlePublish(scope.row)" text type="success" size="default">发布</el-button>
          <el-button v-else-if="scope.row.status === 1" @click="handleUnpublish(scope.row)" text type="warning" size="default">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger" size="default">删除</el-button>
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
    </div>
  </div>
</template>
<style lang="scss" scoped>
.knowledge-container{
  height: 100%;
  overflow: auto;
}

</style>
