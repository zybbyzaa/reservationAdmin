<template>
  <layout active-index="roleList">
    <h3 class="title">角色列表<el-button type="primary" icon="el-icon-plus" size="small" style="float:right" @click="dialogAddRoleVisible = true">新增角色</el-button></h3>
    <el-table :data="roleList" stripe style="width: 100%" :highlight-current-row="true">
      <el-table-column prop="id" label="编号" sortable align="center"></el-table-column>
      <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="showUpdateRoleDialog(scope.row)" type="text" size="small">
            <i class="iconfont icon-details"></i>修改</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">
            <i class="iconfont icon-delete"></i>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination layout="prev, pager, next, jumper, ->, sizes, total" :total="roleCount" :background="true" @current-change="pageChange" @size-change="pageSizeChange" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"></el-pagination>
    </div>
    <el-dialog title="新增角色" :visible.sync="dialogAddRoleVisible" width="40%">
      <el-form :model="form" @submit.native.prevent>
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRoleVisible = false;form.name = '';">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="dialogUpdateRoleVisible" width="40%">
      <el-form :model="form" @submit.native.prevent>
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateRoleVisible = false;form.name = '';">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import Layout from '@/components/Layout';
import { getRoleList, addRole, updateRole, deleteRoleById } from '../http/role';
export default {
  name: 'RoleList',
  components: {
    layout: Layout
  },
  data() {
    return {
      roleList: [],
      roleCount: 0,
      currentPage: 0,
      pageSize: 10,
      dialogAddRoleVisible: false,
      dialogUpdateRoleVisible: false,
      form: {
        name: ''
      },
      curId: 0
    };
  },
  mounted() {
    this.getRoleList({
      pageNum: this.currentPage + 1,
      pageSize: this.pageSize
    });
  },
  methods: {
    handleAdd() {
      if (!this.form.name) {
        this.$message.error('请输入角色名称');
      } else {
        addRole(this.form)
          .then(res => {
            this.dialogAddRoleVisible = false;
            this.form.name = '';
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.getRoleList({
              pageNum: Math.ceil((this.roleCount + 1) / this.pageSize),
              pageSize: this.pageSize
            });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    showUpdateRoleDialog(row) {
      this.dialogUpdateRoleVisible = true;
      this.form.name = row.name;
      this.curId = row.id;
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRoleById(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getRoleList({
                pageNum:
                  Math.ceil(this.roleCount / this.pageSize) ===
                  Math.ceil((this.roleCount - 1) / this.pageSize)
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
    handleUpdate() {
      this.dialogUpdateRoleVisible = false;
      form.name = '';
      if (!this.form.name) {
        this.$message.error('角色名称不能为空');
      } else {
        updateRole(this.curId, this.form)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.getRoleList({
              pageNum: this.currentPage,
              pageSize: this.pageSize
            });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    getRoleList(params) {
      getRoleList(params)
        .then(res => {
          if (res.data.rows.length > 0) {
            this.roleList = res.data.rows;
            this.roleCount = res.data.count;
            this.currentPage = params.currentPage;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    pageChange(currentPage) {
      this.getRoleList({
        pageNum: currentPage,
        pageSize: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getRoleList({
        pageNum: 1,
        pageSize: this.pageSize
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
