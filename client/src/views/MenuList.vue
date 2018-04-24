<template>
  <layout active-index="menuList">
    <h3 class="title">菜单列表<el-button type="primary" icon="el-icon-plus" size="small" style="float:right" @click="dialogAddMenuVisible = true">新增菜单</el-button></h3>
    <el-table :data="menuList" stripe style="width: 100%" :highlight-current-row="true">
      <el-table-column prop="id" label="编号" sortable align="center"></el-table-column>
      <el-table-column prop="name" label="菜单名称" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="enabled" label="菜单状态" align="center" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="showUpdateMenuDialog(scope.row)" type="text" size="small">
            <i class="iconfont icon-details"></i>修改</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">
            <i class="iconfont icon-delete"></i>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination layout="prev, pager, next, jumper, ->, sizes, total" :total="menuCount" :background="true" @current-change="pageChange" @size-change="pageSizeChange" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"></el-pagination>
    </div>
    <el-dialog title="新增菜单" :visible.sync="dialogAddMenuVisible" width="40%">
      <el-form :model="form" ref="addMenuForm" :rules="rules">
        <el-form-item label="菜单名称" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" @keyup.enter.native="handleAdd('addMenuForm')"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="80px" prop="phone">
          <el-input v-model="form.phone" auto-complete="off" @keyup.enter.native="handleAdd('addMenuForm')"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" label-width="80px" prop="enabled">
          <el-switch
            v-model="form.enabled">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('addMenuForm')">取 消</el-button>
        <el-button type="primary" @click="handleAdd('addMenuForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改菜单" :visible.sync="dialogUpdateMenuVisible" width="40%">
      <el-form :model="form" ref="updateMenuForm" :rules="rules">
        <el-form-item label="菜单名称" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" @keyup.enter.native="handleAdd('updateMenuForm')"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="80px" prop="phone">
          <el-input v-model="form.phone" auto-complete="off" @keyup.enter.native="handleAdd('updateMenuForm')"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" label-width="80px" prop="enabled">
          <el-switch
            v-model="form.enabled">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('updateMenuForm')">取 消</el-button>
        <el-button type="primary" @click="handleUpdate('updateMenuForm')">确 定</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import Layout from '@/components/Layout';
import { getMenuList, addMenu, updateMenu, deleteMenuById } from '../http/menu';
export default {
  name: 'MenuList',
  components: {
    layout: Layout
  },
  data() {
    return {
      menuList: [],
      menuCount: 0,
      currentPage: 0,
      pageSize: 10,
      dialogAddMenuVisible: false,
      dialogUpdateMenuVisible: false,
      form: {
        name: '',
        phone: '',
        enabled: false
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名', trigger: 'blur' }]
      },
      curId: 0
    };
  },
  mounted() {
    this.getMenuList({
      pageNum: this.currentPage + 1,
      pageSize: this.pageSize
    });
  },
  methods: {
    closeDialog(formName) {
      // this.$refs[formName].resetFields();
      this.form.name = '';
      this.form.phone = '';
      this.form.enabled = false;
      this.curId = 0;
      switch (formName) {
        case 'addMenuForm':
          this.dialogAddMenuVisible = false;
          break;
        case 'updateMenuForm':
          this.dialogUpdateMenuVisible = false;
          break;
        default:
          break;
      }
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addMenu(this.form)
            .then(res => {
              this.closeDialog('addMenuForm');
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getMenuList({
                pageNum: Math.ceil((this.menuCount + 1) / this.pageSize),
                pageSize: this.pageSize
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    showUpdateMenuDialog(row) {
      const { name, phone, enabled, id } = row;
      this.form.name = name;
      this.form.phone = phone;
      this.form.enabled = enabled;
      this.curId = id;
      this.dialogUpdateMenuVisible = true;
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMenuById(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getMenuList({
                pageNum:
                  Math.ceil(this.menuCount / this.pageSize) ===
                  Math.ceil((this.menuCount - 1) / this.pageSize)
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
    handleUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateMenu(this.curId, this.form)
            .then(res => {
              this.closeDialog('updateMenuForm');
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getMenuList({
                pageNum: this.currentPage,
                pageSize: this.pageSize
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    getMenuList(params) {
      getMenuList(params)
        .then(res => {
          if (res.data.rows.length > 0) {
            this.menuList = res.data.rows;
            this.menuCount = res.data.count;
            this.currentPage = params.currentPage;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    pageChange(currentPage) {
      this.getMenuList({
        pageNum: currentPage,
        pageSize: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getMenuList({
        pageNum: 1,
        pageSize: this.pageSize
      });
    },
    formatStatus(row, column, cellValue) {
      return !cellValue ? '已禁用' : '已启用';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
