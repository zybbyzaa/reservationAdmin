<template>
  <layout active-index="userList">
    <h3 class="title">用户详情</h3>
    <el-form :model="form" ref="updateUserForm" :rules="rules">
        <el-form-item label="用户名称" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" @keyup.enter.native="submitForm('updateUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" label-width="80px" prop="nickname">
          <el-input v-model="form.nickname" auto-complete="off" @keyup.enter.native="submitForm('updateUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" label-width="80px" prop="email">
          <el-input v-model="form.email" auto-complete="off" @keyup.enter.native="submitForm('updateUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" label-width="80px" prop="role_id">
          <el-radio-group v-model="form.role_id">
            <el-radio v-for="role in roleList"  :key="role.id" :label="role.id">
              {{ role.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" style="text-align: right;">
          <el-button type="primary" @click="submitForm('updateUserForm')">确定修改</el-button>
        </el-form-item>
      </el-form>
  </layout>
</template>

<script>
import Layout from '@/components/Layout';
import { getUser, updateUser } from '../http/user';
import { getRoleList } from '../http/role';
export default {
  name: 'UserDetail',
  components: {
    layout: Layout
  },
  data() {
    return {
      roleList: [],
      form: {
        name: '',
        nickname: '',
        role_id: 0,
        email: ''
      },
      rules: {
        name: [{ required: true, message: '请输入账号名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        email: [
          { type: 'email', message: '输入邮箱格式不正确', trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    Promise.all([getRoleList(), getUser(this.$route.params.id)])
      .then(([roles, user]) => {
        if (roles.data.rows.length > 0) {
          this.roleList = roles.data.rows;
        }
        if (user.data) {
          this.form = user.data;
        }
      })
      .catch(err => {
        this.$message.error(err.message);
      });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateUser(this.$route.params.id, this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
