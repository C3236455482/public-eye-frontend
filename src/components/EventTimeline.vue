<template>
  <div class="main-container">
    <!-- 顶部黑色框 -->
    <el-aside
      width="100%"
      class="fixed-sidebar"
      style="background-color: #1f2d3d; color: white"
    >
      <div class="header-content">
        <span class="header-title">示例标题1详情</span>
        <el-button class="return-button" type="primary" @click="goBack">
          返回
        </el-button>
      </div>
    </el-aside>

    <div
      class="timeline-container"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <!-- 左箭头按钮 -->
      <div v-if="scrollOffset > 0" class="arrow left-arrow" @click="moveLeft">
        <i class="el-icon-arrow-left"></i>
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
            :class="{ active: activeIndex === index }"
          >
            <div
              v-if="activeIndex === index"
              class="event-description"
              @click="goToUrl(events[activeIndex].url)"
            >
              {{ event.description }}
            </div>
            <div v-else class="event-number">
              {{ index + scrollOffset + 1 }}
            </div>
          </div>
          <div class="event-date">{{ event.date }}</div>
        </div>

        <!-- 在第三个和第四个圆之间插入一条线，确保居中 -->
        <div class="center-line"></div>
      </div>

      <!-- 右箭头按钮 -->
      <div
        v-if="scrollOffset + visibleCount < events.length"
        class="arrow right-arrow"
        @click="moveRight"
      >
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <!-- 底部提示框 -->
    <div class="footer-bar">
      <span>按左右箭头或拖动事件圆查看事件脉络</span>
    </div>
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
  },
  data() {
    return {
      events: [],
      visibleCount: 6, // 初始显示事件的数量
      startX: 0, // 鼠标拖动开始时的 x 坐标
      startScrollOffset: 0, // 鼠标拖动开始时的滚动偏移量
      scrollOffset: 0, // 当前的滚动偏移量
      activeIndex: -1, // 当前激活的圆的索引
      isDragging: false, // 是否正在拖动
      dragOffset: 0, // 用于动画的拖动偏移量
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
    async fetchEventsByKeywordId() {
      try {
        const response = await axios.get(
          `/api/keywords/${this.keywordId}/events`
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
    // 跳转到对应的URL
    goToUrl(url) {
      window.open(url, "_blank"); // 在新标签页打开
    },

    // 计算圆形的样式
    circleStyle(index) {
      const maxSize = 150;
      const minSize = 100; // 设置大圆最小大小为100px
      const smallCircleSize = 50; // 小圆固定为50px

      if (this.activeIndex === index) {
        const size = Math.max(
          Math.min(
            maxSize - (Math.abs(this.dragOffset) * (maxSize - minSize)) / 100,
            maxSize
          ),
          minSize
        );
        return this.createCircleStyle(
          size,
          "#1abc9c",
          "0px 6px 12px rgba(0,0,0,0.2)"
        );
      } else {
        return this.createCircleStyle(smallCircleSize, "#bdc3c7", "none");
      }
    },

    createCircleStyle(size, backgroundColor, boxShadow) {
      return {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
        marginBottom: "10px",
        position: "relative",
        transition: "all 0.3s ease",
        cursor: "pointer",
        boxShadow,
      };
    },

    setActiveIndex(index) {
      this.activeIndex = index;
      this.dragOffset = 0;
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
  },
};
</script>

<style scoped>
/* 全局背景 */
body {
  background: linear-gradient(135deg, #f0f0f0 0%, #d1e9e9 100%);
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
}

.return-button {
  background-color: #3498db;
  border-color: #3498db;
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
  height: 100%;
}

.timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  width: 100%; /* 增加宽度 */
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  justify-content: center;
  height: 80vh;
  position: relative;
}

.timeline {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  position: relative;
  cursor: grab;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-right: 30px; /* 减少圆之间的间距 */
  transition: transform 0.3s ease;
}

.timeline-item:hover {
  transform: scale(1.05);
}

.event-title {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 10px;
  position: relative;
}

.event-number {
  font-size: 20px;
}

.event-description {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 16px;
  padding: 5px;
  background: rgba(3, 3, 3, 0.5);
  border-radius: 10px;
  cursor: pointer;
}

.event-date {
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin-top: 10px;
}

/* 底部提示框样式 */
.footer-bar {
  width: 100%; /* 增加宽度 */
  background-color: #3498db;
  font-size: 25px;
  color: white;
  padding: 30px 0;
  text-align: center;
  position: absolute;
  bottom: 0;
}

/* 左右箭头的样式 */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-80%);
  font-size: 36px;
  color: #3498db;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 确保箭头在最上层 */
}

.arrow:hover {
  background-color: #2980b9;
  color: white;
}

.left-arrow {
  left: 500px; /* 左箭头的位置 */
}

.right-arrow {
  right: 500px; /* 右箭头的位置 */
}
</style>
