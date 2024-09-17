<template>
  <div id="app">
    <public-eye-sidebar></public-eye-sidebar>
    <el-row class="main-content">
      <el-col :span="16" :offset="4">
        <!-- 动态渲染多个 SentimentItems 组件 -->
        <el-col v-for="keyword in keywordsList" :key="keyword.id" :span="24">
          <sentiment-items :keyword="keyword"></sentiment-items>
        </el-col>
      </el-col>

      <el-col :span="4">
        <!-- 右侧空间，可以添加更多组件或内容 -->
      </el-col>
    </el-row>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="totalItems"
      style="text-align: center; margin-top: 20px"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import PublicEyeSidebar from "./PublicEyeSidebar.vue"; // 组件路径根据实际位置调整
import SentimentItems from "./SentimentItems.vue"; // 导入 SentimentItems 组件

export default {
  name: "HomePage",
  components: {
    SentimentItems, // 引入子组件
    PublicEyeSidebar, // 引入侧边栏组件
  },
  data() {
    return {
      keywordsList: [], // 用于存储从后端获取的关键词列表
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      totalItems: 0, // 总记录数
    };
  },
  mounted() {
    // 页面加载后获取关键词列表
    this.fetchKeywordsList();
  },
  methods: {
    async fetchKeywordsList() {
      try {
        const response = await axios.get(`/api/keywords/list`, {
          params: {
            page: this.currentPage, // 当前页
            size: this.pageSize, // 每页大小
          },
        });
        if (response.data.code === 1) {
          // 成功获取数据，将其赋值给 keywordsList
          this.keywordsList = response.data.data.records;
          this.totalItems = response.data.data.total; // 设置总条数
        } else {
          console.error("获取数据失败: ", response.data.msg);
        }
      } catch (error) {
        console.error("请求错误: ", error);
      }
    },
    // 当每页条数改变时
    handleSizeChange(size) {
      this.pageSize = size;
      this.fetchKeywordsList();
    },
    // 当页码改变时
    handleCurrentChange(page) {
      this.currentPage = page;
      this.fetchKeywordsList();
    },
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
