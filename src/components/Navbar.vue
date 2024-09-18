<template>
  <div class="navbar">
    <!-- 左侧菜单图标 -->
    <div class="left-menu">
      <i class="fas fa-bars"></i>
    </div>

    <!-- 右侧图标和用户名 -->
    <div class="right-section">
      <div class="icon">
        <i class="fas fa-sun"></i>
      </div>
      <div class="icon">
        <i class="fas fa-moon"></i>
      </div>
      <div class="username">昭昭玉</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 1px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07);
}

.left-menu {
  font-size: 24px;
  padding: 10px;
}

.right-section {
  display: flex;
  align-items: center;
}

.icon {
  font-size: 24px;
  margin-right: 10px;
}

.username {
  margin-left: 10px;
}
</style>
