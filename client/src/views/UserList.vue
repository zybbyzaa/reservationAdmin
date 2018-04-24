<template>
  <layout active-index="userList">
    <h3 class="title">用户列表<el-button type="primary" icon="el-icon-plus" size="small" style="float:right" @click="dialogAddUserVisible = true">新增用户</el-button></h3>
    <el-table :data="userList" stripe style="width: 100%" :highlight-current-row="true">
      <el-table-column prop="id" label="编号" sortable align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="role_id" label="角色" :formatter="formatStatus" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)" type="text" size="small">
            <i class="iconfont icon-details"></i>查看</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">
            <i class="iconfont icon-delete"></i>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination layout="prev, pager, next, jumper, ->, sizes, total" :total="userCount" :background="true" @current-change="pageChange" @size-change="pageSizeChange" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"></el-pagination>
    </div>
    <el-dialog title="新增用户" :visible.sync="dialogAddUserVisible" width="40%">
      <el-form :model="form" ref="addUserForm" :rules="rules">
        <el-form-item label="用户名称" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" @keyup.enter.native="handleAdd('addUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" label-width="80px" prop="password">
          <el-input v-model="form.password" auto-complete="off" type="password" @keyup.enter.native="handleAdd('addUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" label-width="80px" prop="nickname">
          <el-input v-model="form.nickname" auto-complete="off" @keyup.enter.native="handleAdd('addUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" label-width="80px" prop="email">
          <el-input v-model="form.email" auto-complete="off" @keyup.enter.native="handleAdd('addUserForm')"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" label-width="80px" prop="role_id">
          <el-radio-group v-model="form.role_id">
            <el-radio v-for="role in roleList"  :key="role.id" :label="role.id">
              {{ role.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" style="text-align: right;">
          <el-button @click="closeAddUserDialog('addUserForm')">取 消</el-button>
          <el-button type="primary" @click="handleAdd('addUserForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </layout>
</template>

<script>
import Layout from '@/components/Layout';
import { getRoleList } from '../http/role';
import { getUserList, deleteUserById, addUser } from '../http/user';
export default {
  name: 'UserList',
  components: {
    layout: Layout
  },
  data() {
    return {
      userList: [],
      roleList: [],
      userCount: 0,
      currentPage: 0,
      pageSize: 10,
      dialogAddUserVisible: false,
      form: {
        name: '',
        password: '',
        nickname: '',
        email: '',
        role_id: 1
      },
      rules: {
        name: [{ required: true, message: '请输入账号名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
    const params = {
      pageNum: this.currentPage + 1,
      pageSize: this.pageSize
    };
    Promise.all([getRoleList(), getUserList(params)])
      .then(([roles, users]) => {
        if (roles.data.rows.length > 0) {
          this.roleList = roles.data.rows;
        }
        if (users.data.rows.length > 0) {
          this.userList = users.data.rows;
          this.userCount = users.data.count;
          this.currentPage = params.currentPage;
        }
      })
      .catch(err => {
        this.$message.error(err.message);
      });
  },
  methods: {
    getUserList(params) {
      getUserList(params)
        .then(res => {
          if (res.data.rows.length > 0) {
            this.userList = res.data.rows;
            this.userCount = res.data.count;
            this.currentPage = params.currentPage;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    formatStatus(row, column, cellValue) {
      return this.roleList.filter(role => role.id === cellValue)[0].name;
    },
    closeAddUserDialog(formName) {
      this.$refs[formName].resetFields();
      this.dialogAddUserVisible = false;
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUser(this.form)
            .then(res => {
              this.closeAddUserDialog('addUserForm');
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getUserList({
                pageNum: Math.ceil((this.userCount + 1) / this.pageSize),
                pageSize: this.pageSize
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    handleDetail(row) {
      this.$router.push(`/user/${row.id}`);
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUserById(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getUserList({
                pageNum:
                  Math.ceil(this.userCount / this.pageSize) ===
                  Math.ceil((this.userCount - 1) / this.pageSize)
                    ? this.currentPage
                    : this.currentPage - 1,
                pageSize: this.pageSize
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    pageChange(currentPage) {
      this.getUserList({
        pageNum: currentPage,
        pageSize: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getUserList({
        pageNum: 1,
        pageSize: this.pageSize
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-radio-group {
  display: flex;
  flex-wrap: wrap;
}
.el-radio-group .el-radio {
  line-height: 40px;

  width: 25%;
  margin-left: 0;
}
</style>
