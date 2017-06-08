<template lang="html">
    <div>
        <!-- 筛选区域 -->
        <el-form label-width="80px" :inline="true">
          <el-form-item label="">
            <el-input placeholder="新闻ID" v-model="form.id" icon="search" :on-icon-click="searchSigleNews"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input placeholder="新闻标题" v-model="form.title" icon="search" :on-icon-click="searchNewsTitle"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select placeholder="新闻分类" v-model="form.category_value" clearable @change="selectCategory">
              <el-option v-for="item in options" :value="item.cid" :label="item.channel"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <!-- table -->
        <el-table :data="newsList" stripe border style="width: 100%">
          <el-table-column label="编号" width="200">
            <template scope="scope">
              <span size="small">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="新闻ID">
            <template scope="scope">
              <span size="small" @click="handleNews(scope.row.url)">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="新闻标题"></el-table-column>
          <el-table-column prop="commentCount" label="当前评论数"></el-table-column>
          <el-table-column label="评论" scope="scope">
            <template scope="scope">
              <el-button size="small" @click="toCommentPage(scope.row)">评论</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="立即推送">
            <template scope="scope">
              <el-button size="small" @click="handlePush(scope.row.id)">立即推送</el-button>
            </template>
          </el-table-column>
          <el-table-column label="修改新闻分类">
            <template scope="scope">
              <el-button @click="handleCategory(scope.$index, scope.row)">{{transformCategory_id(scope.row.category_id)}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="去重">
            <template scope="scope">
              <el-button size="small" @click="handleDistinct(scope.row.id)">去重</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[20, 50, 100]" :page-size="20" layout=" sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
        <!-- 修改分类 -->
        <el-dialog title="修改分类" size="tiny" v-model="editDialogVisible">
            <el-select placeholder="请选择分类" v-model="newsCategory">
                <el-option v-for="item in options" :value="item.cid" :label="item.channel" :key="item.cid">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickHandleEditDialog">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 观看新闻 -->
        <el-dialog :title="newsTitle" size="large" v-model="dialogNewsVisible" custom-class="dialog-video">
          <iframe width="100%" height="650" :src="dialogNewsSrc"></iframe>
        </el-dialog>

        <!-- 推送 -->
        <el-dialog :title="'推送新闻ID:'+pushId" size="small" v-model="pushVisible" v-loading="loading2" element-loading-text="正在推送。。。">
          <template>
            <el-checkbox-group v-model="platformList">
              请选择平台：
              <el-checkbox label="android"></el-checkbox>
              <el-checkbox label="ios"></el-checkbox>
            </el-checkbox-group>
          </template>
          <p style="margin-bottom:20px;">如果要更改新闻描述，新闻标题要一同编辑才会生效</p>
          <el-input placeholder="请输入新闻标题" v-model="editNewsTitle">
            <template slot="prepend">新闻标题：</template>
          </el-input>
          <el-input placeholder="请输入新闻描述" v-model="editNewsDesc">
            <template slot="prepend">新闻描述：</template>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="pushVisible = false">取 消</el-button>
            <el-button type="primary" @click="clickHandlePush()">确 定</el-button>
          </span>
        </el-dialog>

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
            newsList: []
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
            axios.all([http.get('/japi/news/hot?start=0&rows=20&version=2'), http.get('/api/v1/news/category')])
            .then(axios.spread(function(res1, res2){
                self.newsList = res1.data.top;
                self.options = res2.data;
            }));
        }
}
</script>

<style lang="css" scoped>
  .el-input, .el-checkbox-group {
    margin-bottom: 20px;
  }
  .el-dialog__footer{
    text-align: center ;
  }
  .el-pagination {
    margin-top: 20px;
  }
</style>

<style lang="css">
  .el-dialog__footer{
    text-align: center !important;
  }
</style>
