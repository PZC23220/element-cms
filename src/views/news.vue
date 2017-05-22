<template lang="html">
    <div>
        <!-- 筛选区域 -->
        <el-form label-width="80px" :inline="true">
          <el-form-item label="新闻ID">
            <el-input v-model="form.id"></el-input>
          </el-form-item>
          <el-form-item label="评论数量">
            <el-input v-model="form.comment_num"></el-input>
          </el-form-item>
          <el-form-item label="新闻标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="新闻分类">
            <el-select placeholder="请选择" v-model="form.category_value" clearable @change="selectCategory">
              <el-option v-for="item in options" :value="item.cid" :label="item.channel"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>

        <!-- table -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="编号" width="200"></el-table-column>
          <el-table-column prop="name" label="新闻ID" width="100"></el-table-column>
          <el-table-column prop="address" label="新闻标题"></el-table-column>
          <el-table-column prop="test" label="当前评论数"></el-table-column>
          <el-table-column prop="test2" label="扒取评论数"></el-table-column>
          <el-table-column prop="action" label="操作"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>

    </div>
</template>

<script>

import http from 'U/http.js';

export default {
    data() {
        return {
            options: [],
            form: {
                news_id: '',
                comment_num: '',
                news_title: '',
                category_value: ''
            },
            tableData: [{
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }]
            };
        },
        methods: {
            onSubmit() {
                console.log('submit!');
                console.log(this.form);
            },
            selectCategory(param) {
                console.log(param);
                this.category_value = param;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                console.log(`当前页: ${val}`);
            }
        },
        created: function(){
            var self = this;
            // 初始化新闻分类显示
            http.get('/api/v1/news/category').then(function(res){
                if(res.success){
                    self.options = res.data;
                }
            });
            // 获取新闻列表
        }
    }
</script>

<style lang="css">
</style>
