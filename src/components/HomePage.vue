<template>
  <div id="app" class="app-container">
    <!-- 左侧侧边栏 -->
    <div class="sidebar">
      <public-eye-sidebar></public-eye-sidebar>
    </div>

    <!-- 顶部导航栏 -->
    <div class="navbar">
      <navbar></navbar>
    </div>

    <!-- 右侧搜索栏 -->
    <div class="search-sidebar">
      <search-filter-bar @search="handleSearch"></search-filter-bar>
    </div>

    <div class="main-content">
      <el-row>
        <!-- 过滤面板 -->
        <el-col :span="24">
          <filter-panel></filter-panel>
        </el-col>

        <el-col :span="24" class="content">
          <el-col v-for="keyword in keywordsList" :key="keyword.id" :span="24">
            <sentiment-items :keyword="keyword"></sentiment-items>
          </el-col>
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
import SearchFilterBar from "./SearchFilterBar.vue";
import SentimentItems from "./SentimentItems.vue";

export default {
  name: "HomePage",
  components: {
    Navbar, // 引入 Navbar 组件
    SentimentItems, // 引入子组件
    FilterPanel, // 引入过滤面板组件
    SearchFilterBar, // 引入搜索过滤栏组件
    PublicEyeSidebar, // 引入侧边栏组件
  },
  data() {
    return {
      keywordsList: [], // 用于存储从后端获取的关键词列表
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      totalItems: 0, // 总记录数
      searchParams: {
        query: "", // 搜索关键词
      }, // 搜索参数
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
            query: this.searchParams.query,
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
    handleSearch(searchParams) {
      this.searchParams = searchParams;
      this.fetchKeywordsList();
    },
  },
};
</script>

<style>
/* 整体布局，左侧是侧边栏，右侧是导航栏和主内容 */
.app-container {
  display: grid;
  grid-template-areas:
    "sidebar navbar navbar"
    "sidebar main-content search-sidebar";
  grid-template-columns: 210px 1fr 300px;
  grid-template-rows: 40px 1fr;
  background-color: #eef5f9;
  height: 100vh; /* 占满整个视窗高度 */
}

/* 左侧全屏侧边栏 */
.sidebar {
  grid-area: sidebar;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 如果侧边栏内容很多，可以滚动 */
  height: 100%;
  padding: 20px;
}

/* 顶部导航栏 */
.navbar {
  grid-area: navbar;
  background-color: #f1f3f5;
  position: fixed; /* 固定在顶部 */
  /* 手动计算，静态配置 */
  top: 0;
  left: 200px; /* 确保导航栏与侧边栏对齐 */
  right: 0;
  height: 40px;
  z-index: 1000;
}

/* 主内容区域 */
.main-content {
  grid-area: main-content;
  /* 手动计算，静态配置 */
  top: 60px;
  left: 300px; /* 确保导航栏与侧边栏对齐 */
}

.content {
  top: 300px;
  left: 300px; /* 确保导航栏与侧边栏对齐 */
}

.search-sidebar {
  grid-area: search-sidebar;
  background-color: #fff;
  position: fixed; /* 固定 */
  /* 手动计算，静态配置 */
  top: 60px;
  right: 0;
  overflow-y: auto;
  height: 100%;
}
</style>
