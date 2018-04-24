<template>
  <el-container>
    <el-header style="color: #fff;font-size: 16px;background-color: #24292e;">
      <el-dropdown @command="clickItem">
        <span class="el-dropdown-link">
          {{user.userInfo.nickname}}<i class="el-icon-caret-bottom" style="margin-left: 8px;margin-right: 8px;font-size: 14px;"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="modify">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <h3 class="title">管理系统</h3>
    </el-header>
    <el-container>
      <el-aside width="180px">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo">
          <el-menu-item index="main">
            <i class="el-icon-menu"></i>
            <span slot="title"><router-link to="/main">今日菜单</router-link></span>
          </el-menu-item>
          <el-submenu index="role" v-if="user.userInfo.role_id === 1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>角色管理</span>
            </template>
            <el-menu-item index="roleList"><router-link to="/roleList">角色列表</router-link></el-menu-item>
          </el-submenu>
          <el-submenu index="user" v-if="user.userInfo.role_id === 1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="userList"><router-link to="/userList">用户列表</router-link></el-menu-item>
          </el-submenu>
          <el-submenu index="dinner" v-if="user.userInfo.role_id === 1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订餐管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="menuList"><router-link to="/menuList">菜单列表</router-link></el-menu-item>
              <el-menu-item index="mealList"><router-link to="/mealList">菜式列表</router-link></el-menu-item>
              <el-menu-item index="orderList"><router-link to="/orderList">订单列表</router-link></el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <slot>
        </slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'Layout',
  props: ['activeIndex'],
  data() {
    return {
      userInfo: {}
    };
  },
  methods: {
    ...mapMutations(['LOGOUT']),
    clickItem(command) {
      switch (command) {
        case 'modify': //修改密码
          this.$router.push('/modifyPassword');
          break;
        case 'logout': // 退出登录
          location.href = '/api/auth/logout';
          break;
      }
    }
  },
  computed: {
    ...mapState(['user'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-dropdown {
  line-height: 60px;

  float: right;

  color: #fff;
}
.el-menu-vertical-demo {
  height: 100%;
}
.el-menu-vertical-demo a {
  text-decoration: none;

  color: #000;
}
.el-menu-vertical-demo .is-active > a {
  color: #409eff;
}
</style>
