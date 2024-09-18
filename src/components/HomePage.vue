<template>
  <div id="app" class="app-container">
    <!-- 侧边栏组件 -->
    <public-eye-sidebar class="sidebar"></public-eye-sidebar>

    <div class="right-content">
      <!-- 导航栏组件 -->
      <navbar></navbar>

      <el-row class="main-content">
        <!-- 过滤 -->
        <filter-panel></filter-panel>

        <br />

        <el-col :span="16" :offset="1">
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

      <br />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "./Navbar.vue";
import PublicEyeSidebar from "./PublicEyeSidebar.vue";
import FilterPanel from "./FilterPanel.vue";
import SentimentItems from "./SentimentItems.vue";

export default {
  name: "HomePage",
  components: {
    Navbar, // 引入 Navbar 组件
    SentimentItems, // 引入子组件
    FilterPanel, // 引入过滤面板组件
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
/* 整体布局，左侧是侧边栏，右侧是导航栏和主内容 */
.app-container {
  background-color: #eef5f9;
  display: flex;
  height: 100vh; /* 占满整个视窗高度 */
}

/* 左侧全屏侧边栏 */
.sidebar {
  width: 250px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 如果侧边栏内容很多，可以滚动 */
}

/* 右侧区域，包含导航栏和内容 */
.right-content {
  margin-left: 200px; /* 与侧边栏宽度相同 */
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 右侧区域填充剩余空间 */
}

/* 顶部导航栏 */
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  height: 40px;
  z-index: 1000;
  background-color: #f1f3f5;
  padding: 10px;
}

/* 主内容区域 */
.main-content {
  margin-top: 100px; /* 顶部导航栏高度 */
  background-color: #f1f3f5;
}
</style>
