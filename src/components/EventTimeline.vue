<template>
  <div class="main-container">
    <el-aside
      width="100%"
      class="fixed-sidebar"
      style="background-color: #1f2d3d; color: white"
    >
      <div class="header-content">
        <span class="header-title">{{ this.keyword }}</span>
        <div class="button-group">
          <el-button
            class="analyze-button"
            type="primary"
            @click="analyzeEventChain"
            >分析事件链</el-button
          >
          <el-button class="return-button" type="primary" @click="goBack"
            >返回</el-button
          >
        </div>
      </div>
    </el-aside>

    <div
      class="timeline-container"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <div class="timeline-wrapper">
        <!-- 左箭头 -->
        <div class="arrow left-arrow" @click="moveLeft">
          <div class="arrow-icon">V</div>
        </div>
        <div class="timeline" @mousedown="startDrag">
          <div
            v-for="(event, index) in visibleEvents"
            :key="index"
            class="timeline-item"
          >
            <div
              class="event-title"
              :style="circleStyle(index)"
              @click="setActiveIndex(index)"
            >
              <!-- 显示“事件”详情 -->
              <div class="event-text">
                <span class="centered">{{
                  event.description.split(":")[0]
                }}</span
                ><br />
                <span class="limited">{{
                  event.description.split(":")[1].replace(/,/g, "")
                }}</span>
              </div>
            </div>
            <!-- 显示事件日期 -->
            <div class="event-date">{{ formatDate(event.eventDate) }}</div>
          </div>
        </div>
        <!-- 右箭头 -->
        <div class="arrow right-arrow" @click="moveRight">
          <div class="arrow-icon">V</div>
        </div>
      </div>
    </div>

    <!-- 底部显示框 -->
    <div class="display-screen">
      <div class="report-display">
        <!-- 显示 GPT 回复 -->
        <div v-if="gptResponse" class="gpt-response" v-html="gptResponse"></div>
        <!-- 如果没有 GPT 回复，显示提示信息 -->
        <p v-else>请在下方输入您的问题并点击提交。</p>
      </div>
      <!-- 输入区域 -->
      <div class="question-input-area">
        <el-input
          v-model="userInput"
          placeholder="请输入您的问题"
          type="textarea"
          rows="3"
          class="user-input"
        ></el-input>
        <el-button
          type="primary"
          @click="submitUserInput"
          class="submit-button"
        >
          提交
        </el-button>
      </div>
    </div>

    <!-- 事件详情弹出框 -->
    <el-dialog
      :visible.sync="isDialogVisible"
      width="40%"
      :class="'custom-dialog'"
      :style="{ 'text-align': 'center', overflow: 'hidden' }"
    >
      <template #title>
        <span
          style="
            font-size: 24px;
            font-weight: bold;
            font-family: 'Arial', sans-serif;
          "
        >
          事件详情
        </span>
      </template>

      <div style="text-align: center">
        <!-- 关键字 -->
        <p>
          <strong>关键字：</strong
          >{{
            selectedEvent.description
              ? selectedEvent.description.split(":")[0]
              : "无"
          }}
        </p>

        <!-- 引申词 -->
        <p>
          <strong>引申词：</strong
          >{{
            selectedEvent.description && selectedEvent.description.includes(":")
              ? selectedEvent.description.split(":")[1]
              : "无"
          }}
        </p>

        <!-- 链接 -->
        <p>
          <strong>链接：</strong>
          <a
            :href="selectedEvent.urls ? selectedEvent.urls : 'about:blank'"
            target="_blank"
            style="color: #3498db"
          >
            {{ selectedEvent.urls ? "查看详情" : "无链接" }}
          </a>
        </p>

        <!-- 返回按钮 -->
        <el-button type="primary" @click="closeDialog" style="margin-top: 20px"
          >返回</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EventTimeline",
  props: {
    keywordId: {
      type: String,
      required: true,
    },
    keyword: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      events: [], // 存储事件列表
      visibleCount: 6, // 确保显示6个大圆
      startX: 0, // 鼠标拖动开始时的 x 坐标
      startScrollOffset: 0, // 鼠标拖动开始时的滚动偏移量
      scrollOffset: 0, // 当前的滚动偏移量
      activeIndex: -1, // 当前激活的圆的索引
      isDragging: false, // 是否正在拖动
      dragOffset: 0, // 用于动画的拖动偏移量
      isDialogVisible: false, // 控制弹窗显示
      selectedEvent: {}, // 存储选中的事件详情
      parsedUrls: [], // 存储解析后的URLs
      userInput: "", // 用户输入的文本
      gptResponse: "", // GPT 的回复
    };
  },
  computed: {
    visibleEvents() {
      const totalEvents = this.events.length;
      const endIndex = Math.min(
        totalEvents,
        this.visibleCount + this.scrollOffset
      );
      return this.events.slice(this.scrollOffset, endIndex);
    },
  },
  mounted() {
    this.fetchEventsByKeywordId();
  },
  methods: {
    // 获取事件列表
    async fetchEventsByKeywordId() {
      try {
        const response = await axios.get(
          `/api/keyword/${this.keywordId}/events`
        );
        if (response.data.code === 1) {
          this.events = response.data.data;
        } else {
          console.error("获取事件失败: ", response.data.msg);
        }
      } catch (error) {
        console.error("请求错误: ", error);
      }
    },
    goBack() {
      this.$router.go(-1); // 返回到上一个页面
    },
    async submitUserInput() {
      if (!this.userInput.trim()) {
        this.$message.warning("请输入您的问题");
        return;
      }

      try {
        // 构建请求体
        const requestData = {
          keywordId: this.keywordId, // 从 props 获取的 keywordId
          question: this.userInput, // 用户输入的问题
        };

        // 发送 POST 请求到后端的 /analyze/ask 接口
        const response = await axios.post(
          "/api/keyword/analyze/ask",
          requestData
        );

        if (response.data.code === 1) {
          // 根据后端返回的 success 判断
          this.gptResponse = response.data.data; // 这里假设 data 包含回复
          this.$message.success("获取 GPT 回复成功");
        } else {
          this.$message.error(`获取 GPT 回复失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error("调用 GPT 接口出错:", error);
        this.$message.error("调用 GPT 接口出错");
      }
    },
    async analyzeEventChain() {
      if (!this.keywordId) {
        this.$message.warning("关键词 ID 不存在");
        return;
      }

      try {
        // 发送 GET 请求到后端的 /keyword/analyze/{id} 接口
        const response = await axios.get(
          `api/keyword/analyze/${this.keywordId}`
        );

        if (response.data.code === 1) {
          // 假设后端返回 success 的标识是 code 为 1
          this.analysisResult = response.data.data; // 假设 data 包含分析结果
          this.$message.success("事件链分析成功");
        } else {
          this.$message.error(`事件链分析失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error("调用事件链分析接口出错:", error);
        this.$message.error("调用事件链分析接口出错");
      }
    },
    // 计算圆形的样式
    circleStyle() {
      const maxSize = 150;
      const size = maxSize; // 所有圆为大圆

      return {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#1abc9c",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
        marginBottom: "10px",
        position: "relative",
        transition: "all 0.4s ease",
        cursor: "pointer",
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // 去除光亮效果
      };
    },
    // 设置当前选中的事件
    setActiveIndex(index) {
      // 确保 selectedEvent 被正确设置为当前点击的事件
      this.selectedEvent = this.events[index];

      // 输出 selectedEvent 到控制台进行调试，检查其内容
      console.log("Selected Event:", this.selectedEvent);

      // 显示弹窗
      this.isDialogVisible = true;
    },
    closeDialog() {
      this.isDialogVisible = false;
    },
    startDrag(event) {
      event.preventDefault();
      this.isDragging = true;
      this.startX = event.clientX;
      this.startScrollOffset = this.scrollOffset;
    },
    stopDrag() {
      this.isDragging = false;
      this.dragOffset = 0;
    },
    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      const deltaX = (event.clientX - this.startX) * 0.5;
      this.scrollOffset = Math.max(
        0,
        Math.min(
          this.events.length - this.visibleCount,
          this.startScrollOffset - Math.round(deltaX / 100)
        )
      );
      this.dragOffset = deltaX;
    },
    moveLeft() {
      if (this.scrollOffset > 0) {
        this.scrollOffset -= 1;
      }
    },
    moveRight() {
      if (this.scrollOffset + this.visibleCount < this.events.length) {
        this.scrollOffset += 1;
      }
    },
    // 日期格式化方法
    formatDate(date) {
      if (!date) return "无日期";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("zh-CN", options); // 格式化为 YYYY/MM/DD
    },
    generateReport() {
      const analysisReport = `
        <h2>舆情分析报告</h2>
        <p>
        当前社会，舆情分析成为决策管理的重要组成部分。通过收集和分析社交媒体、新闻报道、论坛讨论等多渠道的数据，我们可以更好地理解公众对特定事件的看法和情感走向。本次分析聚焦于近期某知名事件的舆情动态变化。
        </p>
        <p>
        首先，基于数据的初步统计，发现该事件在微博、微信等社交媒体平台上的讨论热度持续上升，尤其是在事件的关键时间节点，公众的关注度达到了高峰。通过情感分析技术，分析结果显示，讨论的情绪主要以负面为主，约占总讨论量的65%，而积极情绪的比例较低，仅为20%左右。
        </p>
        <p>
        值得注意的是，负面舆情主要集中在事件的处理方式以及相关人员的回应上，尤其是缺乏透明度的沟通方式引发了公众的不满。此外，不实信息的传播也助长了负面舆论的扩散。在这种情况下，政府和企业需要及时澄清谣言，并通过公开透明的方式与公众沟通，以缓解舆情压力。
        </p>
        <p>
        综合来看，未来的舆情管理应该更加重视网络平台上的动态变化，及时采取应对措施。同时，结合大数据和人工智能技术，我们能够更精准地预测舆情走势，从而制定更为有效的应对策略，保障社会的和谐与稳定。
        </p>
        <p>
        总结，舆情分析已成为现代治理中的关键工具，如何有效引导舆论走向将直接影响到事件的处理效果。本次报告为后续决策提供了数据支撑，建议相关部门尽快采取行动，缓解当前的负面舆情。
        </p>
      `;
      this.reportContent = analysisReport;
      this.reportGenerated = true;
    },
  },
};
</script>

<style scoped>
/* 全局背景 */
body {
  background: linear-gradient(135deg, #f0f0f0 0%, #d1e9e9 100%);
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.question-input-area {
  position: relative; /* 相对定位，使得提交按钮能够绝对定位在输入框内 */
  width: 100%;
}

/* 输入框的样式 */
.user-input {
  width: 100%;
  padding-right: 90px; /* 留出空间给提交按钮 */
}
.gpt-response {
  white-space: pre-wrap;
}

/* 调整提交按钮的位置，使它在输入框的右侧 */
.submit-button {
  position: absolute;
  right: 5px;
  top: 5px;
  height: auto;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
}

/* 顶部黑色框样式 */
.fixed-sidebar {
  width: 100%;
  background-color: #1f2d3d;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-left: 20px;
}

.return-button {
  background-color: #3498db;
  border-color: #3498db;
  margin-right: 20px;
}

.analyze-button {
  background-color: #3498db;
  border-color: #3498db;
  margin-right: 10px !important;
}

.button-group {
  display: flex;
  align-items: center;
}

.analyze-button:hover {
  background-color: #2980b9; /* 与返回按钮相同的悬停颜色 */
  border-color: #2980b9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 悬停时添加阴影效果 */
}

.return-button:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

/* 主容器样式 */
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.timeline-wrapper {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%;
  position: relative;
  gap: 20px;
}

.timeline {
  display: flex;
  justify-content: center; /* 水平居中时间轴中的圆形 */
  gap: 30px; /* 圆之间的间隙 */
  flex-grow: 1;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.timeline-item:hover {
  transform: scale(1.15);
}

.event-title {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #1abc9c;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  cursor: pointer;
}

/* 事件编号样式 */
.event-text {
  font-size: 16px;
  color: white;
}

.event-date {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
  margin-top: 10px;
}
.display-screen {
  width: 80%;
  height: 50vh;
  background-color: #ecf0f1;
  border-radius: 15px;
  border: 1px solid #7f8c8d;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 报告内容和按钮之间保持间隔 */
  overflow: hidden;
  margin-top: 50px;
}

.report-display {
  width: 100%;
  flex-grow: 1; /* 报告内容占据上方剩余空间 */
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 1.6;
  color: #34495e;
}

.button-area {
  width: 100%;
  padding: 10px 0;
  background-color: #ecf0f1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #7f8c8d; /* 按钮和报告部分的分隔线 */
}

.generate-report-button {
  background-color: #2ecc71;
  border-color: #2ecc71;
  font-size: 16px;
  padding: 10px 20px;
}

.generate-report-button:hover {
  background-color: #27ae60;
  border-color: #27ae60;
}

/* 用来作为显示框与按钮容器之间的过渡线 */
.separator-line {
  width: 80%;
  height: 2px;
  background-color: #7f8c8d; /* 与边框颜色一致 */
  margin: 0; /* 不要间距，让它紧贴在显示框和按钮容器之间 */
}

.button-container {
  width: 80%;
  padding: 10px 0;
  background-color: #ecf0f1;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border: 1px solid #7f8c8d; /* 保持完整边框 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.generate-report-button {
  background-color: #2ecc71;
  border-color: #2ecc71;
  font-size: 16px;
  padding: 10px 20px;
}

.generate-report-button:hover {
  background-color: #27ae60;
  border-color: #27ae60;
}

/* 弹出框居中样式 */
.el-dialog__wrapper {
  top: 0% !important;
  left: 50% !important;
  position: absolute !important;
  transform: translate(-50%, -50%) !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-dialog {
  width: 200px !important; /* 重新设置弹出框的宽度 */
  max-height: 300px !important; /* 设置弹出框的高度 */
  text-align: center;
}
/* 自定义弹出框样式 */
.custom-dialog .el-dialog {
  background-color: #f9f9f9; /* 设置弹出框背景颜色 */
  border-radius: 15px; /* 设置更大圆角 */
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 加强阴影效果 */
  overflow: hidden; /* 去除滚动条 */
}

.custom-dialog .el-dialog__title {
  font-size: 24px;
  color: #2c3e50; /* 标题颜色 */
  margin-bottom: 20px;
}

.custom-dialog p {
  font-size: 18px;
  color: #34495e; /* 描述文字颜色 */
  margin: 10px 0;
}

.custom-dialog a {
  color: #3498db; /* 链接颜色 */
  text-decoration: none;
}

.custom-dialog a:hover {
  text-decoration: underline; /* 链接 hover 时显示下划线 */
}

.custom-dialog .el-button {
  background-color: #3498db;
  border-color: #3498db;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
}

.custom-dialog .el-button:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

/* 弹出框外部 */
.el-dialog__wrapper {
  position: absolute !important;
  top: 40% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 50px;
  background-color: #cecece; /* 灰色背景 */
  color: white; /* 白色箭头 */
  cursor: pointer;
  user-select: none;
  z-index: 1;
  transition: background-color 0.3s ease;
  font-size: 30px;
  margin-top: -40px;
}

.left-arrow {
  transform: rotate(90deg); /* 旋转90度形成V字形 */
}

.right-arrow {
  transform: rotate(-90deg); /* 旋转-90度形成V字形 */
}

/* 箭头hover时效果 */
.arrow:hover {
  background-color: #9e9d9d;
}

/* 箭头中的图标样式 */
.arrow-icon {
  font-size: 30px;
}

/* 确保在缩放时各部分保持相对位置 */
.timeline-container,
.timeline-item,
.event-title,
.event-text {
  box-sizing: border-box;
  flex-shrink: 0;
}
.fixed-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #1f2d3d;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 2; /* 确保黑色框在顶层 */
}
.event-text .centered {
  display: block;
  text-align: center;
}
.event-text .limited {
  display: block;
  text-align: center;
  width: 14ch; /* 限制每行最多显示8个字符 */
  word-wrap: break-word; /* 长单词换行 */
  white-space: normal; /* 默认换行 */
}
</style>
