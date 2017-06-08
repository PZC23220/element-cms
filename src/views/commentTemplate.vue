<template lang="html">
    <div class="">
        <!-- 筛选区域 -->
        <el-form label-width="80px" :inline="true">
          <el-form-item label="">
            <el-input placeholder="关键词" v-model="form.title" icon="search" :on-icon-click="searchNewsTitle"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select placeholder="新闻分类" v-model="form.category_value" clearable @change="selectCategory">
              <el-option v-for="item in options" :value="item.cid" :label="item.channel"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <!-- table -->
        <el-table :data="commentList" stripe border style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="title" label="新闻分类"></el-table-column>
          <el-table-column prop="commentCount" label="当前评论数"></el-table-column>
          <el-table-column label="内容" prop="content"></template>
          </el-table-column>
          <el-table-column label="修改" scope="scope">
            <template scope="scope">
              <el-button size="small" @click="toCommentPage(scope.row)">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column label="删除">
            <template scope="scope">
              <el-button size="small" @click="handleDistinct(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
</template>

<script>

import http from 'U/http.js';
import axios from 'axios';

export default {
  data() {
    return {
      options: [],
      newsTitle: '',
      pushTitle: '',
      editDialogVisible: false, // 是否显示修改分类dialog
      dialogNewsVisible: false,
      pushVisible: false,
      loading2: false,
      pushId: '',
      dialogNewsSrc: '',
      newsCategory: '',
      newsId: '',
      platformList: [],
      editNewsTitle:'',
      editNewsDesc:'',
      form: {
          news_id: '',
          comment_num: '',
          news_title: '',
          category_value: ''
      },
      commentList: []
    };
  },
  methods: {
    selectCategory() {
      var self = this;
      if(self.form.category_value != '') {
        http.get('/news/category/search',{
          params: {
            cid: self.form.category_value
          }
        }).then(function(res){
          self.newsList = res.data;
        });
      }
    },
    searchSigleNews() {
      var self = this;
      if(self.form.id != '') {
        http.get('/japi/news/get',{
          params: {
            id: self.form.id
          }
        }).then(function(res){
          self.newsList = [];
          self.newsList.push(res.data);
          console.log(self.newsList)
        });
      }
    },
    searchNewsTitle() {
      var self = this;
      if(self.form.title != '') {
        http.get('/japi/news/search',{
          params: {
            keyword: self.form.title,
            beforeDays: 7,
            rows: 100
          }
        }).then(function(res){
          self.newsList = res.data;
        });
      }

    },
    handleSizeChange(val) {
      var self = this;
      self.pageNum = val;
      self.currentPage = 1,
      self.loading = true;
      http.get('/japi/news/hot',{
        params: {
          start: 0,
          rows: val
        }
      }).then(function(res){
        self.loading = false;
        self.newsList = res.data.top;
      });
    },
    handleCurrentChange(val) {
      var self = this;
      self.loading = true;
      self.currentPage = val;
      http.get('/japi/news/hot', {
          params:{
            start: (val-1)*self.pageNum,
            rows: self.pageNum
          }
      }).then(function(res){
          self.loading = false;
          self.newsList = res.data.top;
      });
    },
     // 点击视频预览
    handleNews: function(params){
        var self = this;
        self.dialogNewsVisible = true;
        self.dialogNewsSrc = params;
        self.newsTitle = '新闻源链接：' +params;
    },
    // 评论
    toCommentPage(obj) {
      console.log(obj);
      var title = encodeURI(obj.title);
      var _href = 'http://' + window.location.host + '/#/newsjet/comment?title' +title+ '&public_time=' + obj.public_time + '&aid='+ obj.id+ '&url=' + obj.url + '&imgs=' + obj.imgs;
      console.log(_href);
      window.location.href= _href;
    },
    // 点击修改分类
    handleCategory: function(index, row){
      var self = this;
      self.newsCategory = row.category_id;
      self.newsId = row.id;
      self.editDialogVisible = true;
    },
    // 修改分类点击确定
    clickHandleEditDialog: function(){
        var self = this;
        http.post('/api/v1/news/editcid', {
            aid: self.newsId,
            cid: self.newsCategory
        }).then(function(res){
            self.editDialogVisible = false;
            console.log(res);
            if(res.success){
                self.$message({
                  message: '修改分类成功',
                  type: 'success'
                });
                // 刷新当前页面数据
                self.handleCurrentChange(self.currentPage);
            }else{
                self.$message.error('修改分类失败');
            }
        });
    },

    // 点击去重
    handleDistinct: function(num){
      console.log(num)
      var self = this;
      var con = window.confirm('去重后，这条新闻会下线');
      console.log(con);
      if (con) {
        http.get('/api/v1/news/edit_status', {
            params:{
              aid: num
            }
        }).then(function(res){
            if (res.success) {
                self.$message({
                  message: '去重成功',
                  type: 'success'
                });
                // 刷新当前页面数据
                self.handleCurrentChange(self.currentPage);
            }
        });
      }
    },
    // 点击推送
    handlePush: function(aid){
      var self = this;
      self.pushVisible = true;
      self.pushId = aid;
    },
    clickHandlePush() {
      var self = this;
      self.loading2 = true;
      self.platformList.forEach(function(value){
        var dataParams = {
          aid: self.pushId,
          type: value,
          pushtype: 'news'
        }
        if (self.editNewsTitle) {
            dataParams.title = self.editNewsTitle;
        }
        if (self.editNewsDesc) {
            dataParams.body = self.editNewsDesc;
        }
        console.log(dataParams)
        http.get('/people_push', {
            params:dataParams
        }).then(function(res){
            console.log(res);
            self.loading2 = false;
            window.location.reload();
        });
        setTimeout(() => {
          self.loading2 = false;
        }, 30000);
      });
    },
    // category_id中英文map
    transformCategory_id: function(cid){
        var self = this;
        var newMap = {};
        for(var i = 0, len = self.options.length; i < len; i++){
            newMap[self.options[i]['cid']] = self.options[i]['channel'];
        }
        return newMap[cid];
    }
  },
  created: function(){
    var self = this;
    http.get('/api/commentTemplate/read', {
        params:{
          size: 30,
          from: 0
        }
    }).then(function(res){
        self.commentList = res.data.data;
        console.log(self.commentList);
    });
  }
}
</script>

<style lang="css">
</style>
