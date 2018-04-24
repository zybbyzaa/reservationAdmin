<template>
  <layout active-index="orderList">
    <h3 class="title">订单列表<el-button type="primary" size="small" style="float:right" @click="dialogAddOrderVisible = true">点餐</el-button></h3>
    <el-table :data="orderList" stripe style="width: 100%" :highlight-current-row="true">
      <el-table-column prop="id" label="编号" sortable align="center"></el-table-column>
      <el-table-column prop="user_name" label="订餐人" align="center"></el-table-column>
      <el-table-column prop="meal_list" label="订餐菜式" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="showUpdateOrderDialog(scope.row)" type="text" size="small">
            <i class="iconfont icon-details"></i>修改</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">
            <i class="iconfont icon-delete"></i>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination layout="prev, pager, next, jumper, ->, sizes, total" :total="orderCount" :background="true" @current-change="pageChange" @size-change="pageSizeChange" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"></el-pagination>
    </div>
    <el-dialog title="点餐" :visible.sync="dialogAddOrderVisible" width="40%">
      <el-form :model="form" ref="addOrderForm" :rules="rules">
        <el-form-item label="订餐人" label-width="80px" prop="user_name">
          <el-select v-model="form.user_name" placeholder="请选择订餐人">
            <el-option v-for="user in userList"  :key="user.id" :label="user.nickname" :value="user.nickname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订餐菜式" label-width="80px" prop="meal_list">
          <el-checkbox-group
            v-model="form.meal_list">
            <el-checkbox v-for="meal in mealList" :label="meal.name" :key="meal.id">{{meal.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('addOrderForm')">取 消</el-button>
        <el-button type="primary" @click="handleAdd('addOrderForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改订单" :visible.sync="dialogUpdateOrderVisible" width="40%">
      <el-form :model="form" ref="updateOrderForm" :rules="rules">
        <el-form-item label="订餐人" label-width="80px" prop="user_name">
          <el-select v-model="form.user_name" placeholder="请选择订餐人" disabled>
            <el-option v-for="user in userList"  :key="user.id" :label="user.nickname" :value="user.nickname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订餐菜式" label-width="80px" prop="meal_list">
          <el-checkbox-group
            v-model="form.meal_list">
            <el-checkbox v-for="meal in mealList" :label="meal.name" :key="meal.id">{{meal.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('updateOrderForm')">取 消</el-button>
        <el-button type="primary" @click="handleUpdate('updateOrderForm')">确 定</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import Layout from '@/components/Layout';
import { getLastestMealList } from '../http/meal';
import { getUserList } from '../http/user';
import {
  getOrderList,
  addOrder,
  updateOrder,
  deleteOrderById
} from '../http/order';
import { debug } from 'util';
export default {
  name: 'OrderList',
  components: {
    layout: Layout
  },
  data() {
    return {
      orderList: [],
      mealList: [],
      userList: [],
      orderCount: 0,
      currentPage: 0,
      pageSize: 10,
      dialogAddOrderVisible: false,
      dialogUpdateOrderVisible: false,
      form: {
        user_name: '',
        meal_list: []
      },
      rules: {
        user_name: [
          { required: true, message: '请选择一个点餐人', trigger: 'blur' }
        ],
        meal_list: [
          { required: true, message: '至少选择一个菜式', trigger: 'blur' }
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
    Promise.all([getLastestMealList(), getUserList(), getOrderList(params)])
      .then(([meals, users, orders]) => {
        if (meals.data.rows.length > 0) {
          this.mealList = meals.data.rows;
        }
        if (users.data.rows.length > 0) {
          this.userList = users.data.rows;
        }
        if (orders.data.rows.length > 0) {
          this.orderList = orders.data.rows;
          this.orderCount = orders.data.count;
          this.currentPage = params.currentPage;
        }
      })
      .catch(err => {
        this.$message.error(err.message);
      });
  },
  methods: {
    closeDialog(formName) {
      // this.$refs[formName].resetFields();
      this.form.user_name = '';
      this.form.meal_list = [];
      this.curId = 0;
      switch (formName) {
        case 'addOrderForm':
          this.dialogAddOrderVisible = false;
          break;
        case 'updateOrderForm':
          this.dialogUpdateOrderVisible = false;
          break;
        default:
          break;
      }
    },
    handleAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addOrder({
            ...this.form,
            meal_list: this.form.meal_list.join(',')
          })
            .then(res => {
              this.closeDialog('addOrderForm');
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getOrderList({
                pageNum: Math.ceil((this.orderCount + 1) / this.pageSize),
                pageSize: this.pageSize
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    showUpdateOrderDialog(row) {
      const { user_name, meal_list, id } = row;
      this.form.user_name = user_name;
      this.form.meal_list = meal_list.split(',');
      this.curId = id;
      this.dialogUpdateOrderVisible = true;
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOrderById(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getOrderList({
                pageNum:
                  Math.ceil(this.orderCount / this.pageSize) ===
                  Math.ceil((this.orderCount - 1) / this.pageSize)
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
          updateOrder(this.curId, {
            ...this.form,
            meal_list: this.form.meal_list.join(',')
          })
            .then(res => {
              this.closeDialog('updateOrderForm');
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getOrderList({
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
    getOrderList(params) {
      getOrderList(params)
        .then(res => {
          if (res.data.rows.length > 0) {
            this.orderList = res.data.rows;
            this.orderCount = res.data.count;
            this.currentPage = params.currentPage;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    pageChange(currentPage) {
      this.getOrderList({
        pageNum: currentPage,
        pageSize: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getOrderList({
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
