<template>
  <layout active-index="mealList">
    <h3 class="title">菜品列表<el-button type="primary" icon="el-icon-plus" size="small" style="float:right" @click="dialogAddMealVisible = true">新增菜品</el-button></h3>
    <el-table :data="mealList" stripe style="width: 100%" :highlight-current-row="true">
      <el-table-column prop="id" label="编号" sortable align="center"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="menu_id" label="所属菜品" align="center" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="showUpdateMealDialog(scope.row)" type="text" size="small">
            <i class="iconfont icon-details"></i>修改</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">
            <i class="iconfont icon-delete"></i>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination layout="prev, pager, next, jumper, ->, sizes, total" :total="mealCount" :background="true" @current-change="pageChange" @size-change="pageSizeChange" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"></el-pagination>
    </div>
    <el-dialog title="新增菜品" :visible.sync="dialogAddMealVisible" width="40%">
      <el-form :model="form" ref="addMealForm" :rules="rules">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" @keyup.enter.native="handleAdd('addMealForm')"></el-input>
        </el-form-item>
        <el-form-item label="所属菜品" label-width="80px" prop="menu_id">
          <el-select v-model="form.menu_id" placeholder="请选择菜单">
            <el-option v-for="menu in menuList"  :key="menu.id" :label="menu.name" :value="menu.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('addMealForm')">取 消</el-button>
        <el-button type="primary" @click="handleAdd('addMealForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改菜品" :visible.sync="dialogUpdateMealVisible" width="40%">
      <el-form :model="form" ref="updateMealForm" :rules="rules">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model="form.name" auto-complete="off" @keyup.enter.native="handleAdd('updateMealForm')"></el-input>
        </el-form-item>
        <el-form-item label="所属菜品" label-width="80px" prop="menu_id">
          <el-select v-model="form.menu_id" placeholder="请选择菜单">
            <el-option v-for="menu in menuList"  :key="menu.id" :label="menu.name" :value="menu.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('updateMealForm')">取 消</el-button>
        <el-button type="primary" @click="handleUpdate('updateMealForm')">确 定</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import Layout from '@/components/Layout';
import { getMenuList } from '../http/menu';
import { getMealList, addMeal, updateMeal, deleteMealById } from '../http/meal';
export default {
  name: 'MealList',
  components: {
    layout: Layout
  },
  data() {
    return {
      mealList: [],
      menuList: [],
      mealCount: 0,
      currentPage: 0,
      pageSize: 10,
      dialogAddMealVisible: false,
      dialogUpdateMealVisible: false,
      form: {
        name: '',
        menu_id: ''
      },
      rules: {
        name: [{ required: true, message: '请输入菜品名', trigger: 'blur' }],
        menu_id: [
          { required: true, message: '请选择一个菜单', trigger: 'blur' }
        ]
      },
      curId: 0
    };
  },
  mounted() {
    const params = {
      pageNum: this.currentPage + 1,
      pageSize: this.pageSize
    };
    Promise.all([getMenuList(), getMealList(params)])
      .then(([menus, meals]) => {
        if (menus.data.rows.length > 0) {
          this.menuList = menus.data.rows;
        }
        if (meals.data.rows.length > 0) {
          this.mealList = meals.data.rows;
          this.mealCount = meals.data.count;
          this.currentPage = params.currentPage;
        }
      })
      .catch(err => {
        this.$message.error(err.message);
      });
  },
  methods: {
    getMealList(params) {
      getMealList(params)
        .then(res => {
          if (res.data.rows.length > 0) {
            this.mealList = res.data.rows;
            this.mealCount = res.data.count;
            this.currentPage = params.currentPage;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    formatStatus(row, column, cellValue) {
      return this.menuList.filter(menu => menu.id === cellValue)[0].name;
    },
    closeDialog(formName) {
      // this.$refs[formName].resetFields();
      this.form.name = '';
      this.form.phone = '';
      this.form.enabled = false;
      this.curId = 0;
      switch (formName) {
        case 'addMealForm':
          this.dialogAddMealVisible = false;
          break;
        case 'updateMealForm':
          this.dialogUpdateMealVisible = false;
          break;
        default:
          break;
      }
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addMeal(this.form)
            .then(res => {
              this.closeDialog('addMealForm');
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getMealList({
                pageNum: Math.ceil((this.mealCount + 1) / this.pageSize),
                pageSize: this.pageSize
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    showUpdateMealDialog(row) {
      const { name, phone, enabled, id } = row;
      this.form.name = name;
      this.form.phone = phone;
      this.form.enabled = enabled;
      this.curId = id;
      this.dialogUpdateMealVisible = true;
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该菜品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMealById(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getMealList({
                pageNum:
                  Math.ceil(this.mealCount / this.pageSize) ===
                  Math.ceil((this.mealCount - 1) / this.pageSize)
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
          updateMeal(this.curId, this.form)
            .then(res => {
              this.closeDialog('updateMealForm');
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getMealList({
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
    getMealList(params) {
      getMealList(params)
        .then(res => {
          if (res.data.rows.length > 0) {
            this.mealList = res.data.rows;
            this.mealCount = res.data.count;
            this.currentPage = params.currentPage;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    pageChange(currentPage) {
      this.getMealList({
        pageNum: currentPage,
        pageSize: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getMealList({
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
