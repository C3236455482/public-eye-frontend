<template>
  <div class="sentiment-item-container" @click="goDetial(keyword.id)">
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
          <el-col :span="18">
            <div class="info-row">
              <!-- 来源-->
              <span>
                <i class="fas fa-globe" style="margin-right: 5px"></i>
                <strong>来源：微博</strong>{{ keyword.source }}
              </span>

              <!-- 涉及词-->
              <span>
                <i class="fas fa-tags" style="margin-right: 5px"></i>
                <strong>涉及词：</strong>{{ keyword.keyword }}
              </span>

              <!-- 相似文章数-->
              <span>
                <i class="fas fa-desktop" style="margin-right: 5px"></i>
                <strong>相似文章数：1</strong>
                <!-- <a :href="keyword.similarArticleLink">{{
                  keyword.similarArticle
                }}</a> -->
              </span>
            </div>
          </el-col>

          <!-- 情感分析 -->
          <el-col :span="6">
            <div>
              <span
                :class="
                  getSentimentClass(keyword.representativeEvent.sentiment)
                "
              >
                {{ getSentimentLabel(keyword.representativeEvent.sentiment) }}
              </span>
              <!-- <button class="custom-button" @click="goDetial(keyword.id)">
                详情
              </button> -->
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
    getSentimentClass(sentiment) {
      if (sentiment >= 0.7 && sentiment <= 1) {
        return "sentiment-positive"; // 正面情感
      } else if (sentiment >= 0 && sentiment < 0.3) {
        return "sentiment-negative"; // 负面情感
      } else {
        return "sentiment-neutral"; // 中性情感
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
.sentiment-item-container {
  max-width: 1850px;
  max-height: 400px;
  width: 100%; /* 宽度根据父容器调整 */
  height: auto; /* 高度自适应内容 */
}

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

/* 自定义情感标签样式 */
.sentiment-positive {
  background-color: #67c23a; /* 绿色表示正面情感 */
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.sentiment-neutral {
  background-color: #e6a23c; /* 黄色表示中性情感 */
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.sentiment-negative {
  background-color: #f56c6c; /* 红色表示负面情感 */
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

/* 自定义按钮样式 */
.custom-button {
  background-color: #409eff; /* 蓝色背景 */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #66b1ff; /* 悬停时背景颜色 */
}
</style>
