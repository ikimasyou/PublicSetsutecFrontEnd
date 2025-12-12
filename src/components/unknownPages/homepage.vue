<template>
    <nav class="mat-toolbar primary-color">
      <span>SETSU TIME</span>
      <div class="user">
        <button @click="toggleUserMenu">用户名</button>
        <div v-if="showUserMenu">
          <button @click="navigateTo('/password')">修改密码</button>
          <!-- 其他用户菜单项 -->
        </div>
      </div>
    </nav>
    <div class="content">
      <div class="left" :class="{ 'display': display }">
        <div>
          <button @click="toggleMenu">勤務メエコー</button>
          <div v-if="showMenu">
            <button @click="navigateTo('/attendance')">勤务登录</button>
            <button @click="navigateTo('/settime')">勤務時間初期設定</button>
            <button @click="navigateTo('/handbook')">作業システムマニュアル</button>
            <!-- 其他菜单项 -->
          </div>
        </div>
        <button @click="navigateTo('/transportation')">交通費登録</button>
        <button @click="navigateTo('/contact')">勤務への連絡</button>
        <button @click="navigateTo('/traffic')">交通費</button>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        display: true, // 或者根据需要设置初始值
        showMenu: false,
        showUserMenu: false,
      };
    },
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
      },
      navigateTo(route) {
        this.$router.push(route);
      },
    },
  };
  </script>
  
  <style>

  </style>
  