<template>
  <el-aside
    width="200px"
    class="fixed-sidebar"
    style="background-color: #1f2d3d; color: white"
  >
    <div
      class="brand"
      style="
        padding: 20px;
        font-size: 19px;
        font-weight: bold;
        display: flex;
        align-items: center;
      "
    >
      <img
        src="http://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png"
        alt="微博图标"
        style="width: 24px; height: 24px; margin-right: 10px"
      />
      微博舆情分析
    </div>

    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#1F2D3D"
      text-color="#fff"
      active-text-color="#409EFF"
    >
      <el-submenu index="1">
        <template #title><i class="el-icon-s-platform"></i> 舆情分析</template>
        <!-- <el-menu-item index="1-1">Rainbow</el-menu-item> -->
      </el-submenu>
      <el-submenu index="2">
        <template #title><i class="el-icon-document"></i> Reports</template>
        <el-menu-item index="2-1">Email reports</el-menu-item>
        <el-menu-item index="2-2">PDF report</el-menu-item>
        <el-menu-item index="2-3">Excel report</el-menu-item>
        <el-menu-item index="2-4">Infographic</el-menu-item>
      </el-submenu>
    </el-menu>
    <!-- <el-button type="success" style="margin: 20px; width: 90%"
      >Video Walkthrough</el-button
    >
    <div style="padding: 20px">
      <h3>UPCOMING WEBINAR</h3>
      <p>Get an Internet monitoring certificate with Brand24</p>
      <p>Date: Wednesday, September 18, 2024</p>
    </div> -->
  </el-aside>
</template>

<script>
export default {
  name: "PublicEyeSidebar",
};
</script>

<style scoped>
.fixed-sidebar {
  height: 100vh; /* 视窗高度 */
  position: fixed; /* 固定位置 */
  top: 0; /* 顶部对齐 */
  left: 0; /* 左侧对齐 */
  overflow-y: auto; /* 允许纵向滚动 */
}

.el-menu-vertical-demo,
.el-menu-item,
.el-submenu__title {
  margin: 0 !important; /* 移除任何外边距 */
  border: 0 !important; /* 移除任何边框 */
}
</style>
