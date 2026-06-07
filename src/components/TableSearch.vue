<template>
 <el-form :model="formData">
  <el-row :gutter="24">
    <template v-for="item in props.formItems" :key="item.prop" >
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
        <el-form-item :label="item.label" :prop="item.prop" >
          <component 
            :is="`el-${item.type}`" 
            v-model="formData[item.prop]"
            :placeholder="item.placeholder"
            :options="item.options"
          />
        </el-form-item>
      </el-col>
    </template>
  </el-row>
  <el-row>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-row>
 </el-form>
</template>
<script setup>
import { ref } from 'vue'
const formData = ref({})
const emit = defineEmits(['search'])
const props = defineProps({
  formItems:{
    type:Array,
    default:()=>[]
  }
})
const handleSearch = () => {
  emit('search', formData.value)
}
const resetForm = () => {
  formData.value = {}
  handleSearch()
}
</script>