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
        <el-table :data="newsList" stripe border style="width: 100%">
          <el-table-column label="编号" width="200">
            <template scope="scope">
              <span size="small">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="新闻ID"></el-table-column>
          <el-table-column prop="title" label="新闻标题"></el-table-column>
          <el-table-column prop="commentCount" label="当前评论数"></el-table-column>
          <el-table-column label="评论" scope="scope">
            <template scope="scope">
              <el-button size="small" @click="handlePush(scope.$index, scope.row)">评论</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="立即推送">
            <template scope="scope">
              <el-button size="small" @click="handlePush(scope.$index, scope.row)">立即推送</el-button>
            </template>
          </el-table-column>
          <el-table-column label="修改新闻分类">
            <template scope="scope">
              <el-button>{{transformCategory_id(scope.row.category_id)}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="去重">
            <template scope="scope">
              <el-button size="small" @click="handlePush(scope.$index, scope.row)">去重</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[20, 50, 100]" :page-size="20" layout=" sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>

    </div>
</template>

<script>

import http from 'U/http.js';
import axios from 'axios';

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
            newsList: []
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
          },
          // 点击推送
          handlePush: function(index, row){

          },
          // category_id中英文map
          transformCategory_id: function(cid){
              var self = this;
              var newMap = {};
              for(var i = 0, len = self.options.length; i < len; i++){
                  newMap[self.options[i]['cid']] = self.options[i]['channel'];
              }
              console.log(newMap);
              return newMap[cid];
          }
        },
        created: function(){
            var self = this;
            axios.all([http.get('japi/news/hot?start=0&rows=20&version=2'), http.get('/api/v1/news/category')])
            .then(axios.spread(function(res1, res2){
                self.newsList = res1.data.top;
              console.log(self.newsList);
                self.options = res2.data;
                console.log(res2);
            }));
        }
    }
</script>

<style lang="css">
</style>
