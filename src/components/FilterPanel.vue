<template>
  <div class="filter-container">
    <el-row>
      <!-- 涉及行业 -->
      <el-col :span="24" class="filter-section">
        <span class="filter-label">涉及行业：</span>
        <el-tag
          v-for="(industry, index) in displayedIndustries"
          :key="index"
          :type="selectedIndustry === industry.name ? 'primary' : ''"
          @click="selectIndustry(industry.name)"
          class="filter-tag"
        >
          {{ industry.name }}({{ industry.count }})
        </el-tag>
        <el-button type="text" @click="toggleMoreIndustries">
          {{ showMoreIndustries ? "收起" : "更多" }}
        </el-button>
      </el-col>

      <!-- 涉及事件 -->
      <el-col :span="24" class="filter-section">
        <span class="filter-label">涉及事件：</span>
        <el-tag
          v-for="(event, index) in displayedEvents"
          :key="index"
          :type="selectedEvent === event.name ? 'primary' : ''"
          @click="selectEvent(event.name)"
          class="filter-tag"
        >
          {{ event.name }}({{ event.count }})
        </el-tag>
        <el-button type="text" @click="toggleMoreEvents">
          {{ showMoreEvents ? "收起" : "更多" }}
        </el-button>
      </el-col>

      <!-- 涉及省份 -->
      <el-col :span="24" class="filter-section">
        <span class="filter-label">涉及省份：</span>
        <el-tag
          v-for="(province, index) in displayedProvinces"
          :key="index"
          :type="selectedProvince === province.name ? 'primary' : ''"
          @click="selectProvince(province)"
          class="filter-tag"
        >
          {{ province }}
        </el-tag>
        <el-button type="text" @click="toggleMoreProvinces">
          {{ showMoreProvinces ? "收起" : "更多" }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      industries: [
        { name: "互联网", count: 611 },
        { name: "法律司法", count: 322 },
        { name: "教育行业", count: 201 },
        // 更多行业...
      ],
      events: [
        { name: "网事小说", count: 598 },
        { name: "突发事件", count: 506 },
        { name: "历史事件", count: 174 },
        // 更多事件...
      ],
      provinces: ["北京", "上海", "江苏", "安徽", "广东", "四川", "辽宁"],
      selectedIndustry: "",
      selectedEvent: "",
      selectedProvince: "",
      showMoreIndustries: false,
      showMoreEvents: false,
      showMoreProvinces: false,
    };
  },
  computed: {
    displayedIndustries() {
      return this.showMoreIndustries
        ? this.industries
        : this.industries.slice(0, 6);
    },
    displayedEvents() {
      return this.showMoreEvents ? this.events : this.events.slice(0, 6);
    },
    displayedProvinces() {
      return this.showMoreProvinces
        ? this.provinces
        : this.provinces.slice(0, 6);
    },
  },
  methods: {
    selectIndustry(industry) {
      this.selectedIndustry = industry;
    },
    selectEvent(event) {
      this.selectedEvent = event;
    },
    selectProvince(province) {
      this.selectedProvince = province;
    },
    toggleMoreIndustries() {
      this.showMoreIndustries = !this.showMoreIndustries;
    },
    toggleMoreEvents() {
      this.showMoreEvents = !this.showMoreEvents;
    },
    toggleMoreProvinces() {
      this.showMoreProvinces = !this.showMoreProvinces;
    },
  },
};
</script>

<style scoped>
.filter-container {
  max-width: 1820px;
  width: 100%;
  height: auto; /* 高度自适应内容 */
  background-color: #fff;
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 1px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.filter-section {
  margin-bottom: 5px;
}
.filter-label {
  color: #888;
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 5px;
  margin-right: 5px;
}
.filter-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
