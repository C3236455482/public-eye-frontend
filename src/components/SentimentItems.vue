<template>
  <div>
    <el-row :gutter="20">
      <el-card shadow="hover">
        <!-- 标题 -->
        <div slot="header" class="clearfix">
          <span>{{ keyword.keyword }}</span>
        </div>
        <!-- 简介 -->
        <div>
          <p>{{ keyword.representativeEvent.description }}</p>
        </div>
        <el-row type="flex" justify="space-between">
          <!-- 来源、涉及词、相似文章 -->
          <el-col :span="18">
            <div class="info-row">
              <!-- <span><strong>来源：</strong>{{ keyword.source }}</span> -->
              <span><strong>涉及词：</strong>{{ keyword.keyword }}</span>
              <!-- <span>
                  <strong>相似文章：</strong>
                  <a :href="keyword.similarArticleLink">{{
                    keyword.similarArticle
                  }}</a>
                </span> -->
            </div>
          </el-col>
          <!-- 情感分析 -->
          <el-col :span="6">
            <div>
              <el-tag :type="getTagType(keyword.representativeEvent.sentiment)">
                {{ getSentimentLabel(keyword.representativeEvent.sentiment) }}
              </el-tag>
              <el-button type="primary" block @click="goDetial(keyword.id)"
                >详情</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "SentimentItems",
  props: {
    keyword: {
      type: Object,
      required: true,
    },
  },
  methods: {
    goDetial(keywordId) {
      // 跳转到 EventTimeline 页面并传递 keywordId
      this.$router.push({
        name: "EventTimeline",
        params: { keywordId: keywordId, keyword: this.keyword.keyword },
      });
    },
    getTagType(sentiment) {
      if (sentiment >= 0.7 && sentiment <= 1) {
        return "success"; // 正面
      } else if (sentiment >= 0 && sentiment < 0.3) {
        return "danger"; // 负面
      } else {
        return "warning"; // 中性
      }
    },
    getSentimentLabel(sentiment) {
      if (sentiment >= 0.7 && sentiment <= 1) {
        return "正面";
      } else if (sentiment >= 0 && sentiment < 0.3) {
        return "负面";
      } else {
        return "中性";
      }
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-bottom: 10px; /* 为卡片间添加一些间距 */
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
