<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" v-for="item in sentimentData" :key="item.id">
        <el-card shadow="hover">
          <!-- 标题 -->
          <div slot="header" class="clearfix">
            <span>{{ item.title }}</span>
          </div>
          <!-- 简介 -->
          <div>
            <p>{{ item.description }}</p>
          </div>
          <el-row type="flex" justify="space-between">
            <!-- 来源、涉及词、相似文章 -->
            <el-col :span="18">
              <div class="info-row">
                <span><strong>来源：</strong>{{ item.source }}</span>
                <span
                  ><strong>涉及词：</strong>{{ item.keywords.join(", ") }}</span
                >
                <span>
                  <strong>相似文章：</strong>
                  <a :href="item.similarArticleLink">{{
                    item.similarArticle
                  }}</a>
                </span>
              </div>
            </el-col>
            <!-- 情感分析 -->
            <el-col :span="6">
              <div>
                <el-tag
                  v-for="tag in item.tags"
                  :key="tag"
                  :type="getTagType(tag)"
                  >{{ tag }}</el-tag
                >
                <el-button type="primary" block @click="goDetial"
                  >详情</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "SentimentItems",
  data() {
    return {
      sentimentData: [
        {
          id: 1,
          title: "示例标题1",
          description: "这里是关于示例标题1的简介内容。",
          source: "来源1",
          keywords: ["关键词1", "关键词2"],
          similarArticle: "相似文章标题1",
          similarArticleLink: "#",
          tags: ["正面", "负面"],
        },
        // 更多数据...
      ],
    };
  },
  methods: {
    goDetial() {
      this.$router.push({
        name: "EventTimeline",
      });
    },
    getTagType(tag) {
      if (tag === "正面") return "success";
      if (tag === "负面") return "danger";
      return "warning"; // 中性
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-bottom: 20px; /* 为卡片间添加一些间距 */
}
.el-col {
  padding: 0 !important; /* 移除内部默认填充 */
}
.info-row {
  display: flex;
  align-items: center; /* 确保内容在行中垂直居中 */
  font-size: 0.85em;
  color: #757575;
  margin-top: 10px;
}

.info-row span {
  margin-right: 20px; /* 每个元素之间增加20px的间距，可调整 */
}

.info-row span:last-child {
  margin-right: 0; /* 最后一个元素不需要右边距 */
}
</style>
