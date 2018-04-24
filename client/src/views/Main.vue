<template>
  <layout active-index="main">
    <h3>今日菜单</h3>
    <el-checkbox-group
      v-model="checkedMeals">
      <el-checkbox v-for="meal in mealList" :label="meal.name" :key="meal.id">{{meal.name}}</el-checkbox>
    </el-checkbox-group>
    <el-button type="primary" @click="takeOrder" style="margin-top: 20px;">点餐</el-button>
  </layout>
</template>

<script>
import Layout from '@/components/Layout';
import { getLastestMealList } from '../http/meal';
import { addOrder, updateOrder, getOrderByUserName } from '../http/order';
export default {
  name: 'Main',
  components: {
    layout: Layout
  },
  data() {
    return {
      order: {},
      mealList: [],
      checkedMeals: []
    };
  },
  mounted() {
    Promise.all([getOrderByUserName(), getLastestMealList()])
      .then(([order, meals]) => {
        if (meals.data.count > 0) {
          this.mealList = meals.data.rows;
        }
        if (order.data) {
          this.order = order.data;
          this.checkedMeals = order.data.meal_list.split(',');
        }
      })
      .catch(err => {
        this.$message.error(err.message);
      });
  },
  methods: {
    takeOrder() {
      if (!this.order.id) {
        if (this.checkedMeals.length === 0) {
          this.$message.error('请至少选择一个菜');
          return;
        }
        addOrder({
          meal_list: this.checkedMeals.join(',')
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.order = res.data;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else {
        if (this.checkedMeals.length === 0) {
          this.$message.error('请至少选择一个菜');
          return;
        }
        updateOrder(this.order.id, {
          meal_list: this.checkedMeals.join(',')
        })
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
