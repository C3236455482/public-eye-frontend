<template>
  <div id="app">
    <public-eye-sidebar></public-eye-sidebar>
    <el-row class="main-content">
      <el-col :span="16" :offset="4">
        <!-- 将 SentimentItems 组件添加到主内容区 -->
        <!-- 第一个 SentimentItems 组件 -->
        <sentiment-items></sentiment-items>
        <!-- 第二个 SentimentItems 组件，你可以修改其 props 来传递不同的数据 -->
        <sentiment-items></sentiment-items>
        <!-- 第三个 SentimentItems 组件 -->
        <sentiment-items></sentiment-items>
      </el-col>
      <el-col :span="4">
        <!-- 右侧空间，可以添加更多组件或内容 -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PublicEyeSidebar from "./components/PublicEyeSidebar.vue"; // 组件路径根据实际位置调整
import SentimentItems from "./components/SentimentItems.vue"; // 导入 SentimentItems 组件

export default {
  name: "App",
  components: {
    PublicEyeSidebar, // 侧边栏组件
    SentimentItems, // 舆情数据组件
  },
};
</script>

<style>
/* 假设主内容区域在 App.vue 或其他文件中定义 */
.main-content {
  margin-left: 300px; /* 与侧边栏宽度相同 */
  margin-right: 20px; /* 添加右侧间隔 */
}
</style>
