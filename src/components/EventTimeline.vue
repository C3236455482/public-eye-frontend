<template>
  <div class="timeline-container">
    <div class="timeline">
      <div v-for="(event, index) in events" :key="index" class="timeline-item">
        <div class="event-title">{{ event.date }}</div>
        <div class="event-content">{{ event.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventTimeline",
  data() {
    return {
      events: [
        { date: "24.09.01", description: "事件描述1" },
        { date: "24.09.04", description: "事件描述2" },
        { date: "24.09.05", description: "事件描述3" },
        // 添加更多事件
      ],
    };
  },
};
</script>

<style scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%; /* 确保容器宽度充满父容器 */
}

.timeline {
  display: flex;
  flex-direction: row;
  overflow-x: auto; /* 允许横向滚动 */
  padding: 20px;
  width: 100%;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐标题和内容 */
  margin-right: 50px; /* 时间点之间的间距 */
}

.event-title {
  background-color: pink;
  color: white;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 10px; /* 标题与内容的间距 */
}

.event-content {
  text-align: center;
  max-width: 200px; /* 控制内容宽度 */
}
</style>
