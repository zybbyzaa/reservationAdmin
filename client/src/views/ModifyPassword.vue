<template>
  <layout active-index="userList">
    <h3 class="title">修改密码</h3>
    <el-form :model="form" ref="updateUserForm" :rules="rules">
        <el-form-item label="新密码" label-width="80px" prop="password">
          <el-input v-model="form.password" auto-complete="off" @keyup.enter.native="submitForm('updateUserForm')" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px" prop="confirm_password">
          <el-input v-model="form.confirm_password" auto-complete="off" @keyup.enter.native="submitForm('updateUserForm')" type="password"></el-input>
        </el-form-item>
        <el-form-item label="" style="text-align: right;">
          <el-button type="primary" @click="submitForm('updateUserForm')">确定修改</el-button>
        </el-form-item>
      </el-form>
  </layout>
</template>

<script>
import { mapState } from 'vuex';
import Layout from '@/components/Layout';
import { updateUser } from '../http/user';
export default {
  name: 'ModifyPassword',
  components: {
    layout: Layout
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.confirm_password !== '') {
          this.$refs.updateUserForm.validateField('confirm_password');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        password: '',
        confirm_password: ''
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        confirm_password: [{ validator: validatePass2, trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateUser(this.user.userInfo.id, this.form)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.$router.push('/main');
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    }
  },
  computed: {
    ...mapState(['user'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
