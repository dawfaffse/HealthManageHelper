<template>
  <div class="page-head">
    <p class="page-title">{{title}}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup>
   const props = defineProps({
    title:{
      type:String,
      default:'页面标题',


    }
   })
</script>

<style lang="scss" scoped>
.page-head {
  display: flex;
  
  justify-content: space-between;
 
  .page-title{
    font-size: 24px;
    color: #333333;
    margin-bottom: 20px;

  }
}
</style>
