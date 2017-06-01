<template lang="html">
    <div>
        <!-- 筛选区域 -->
        <el-form label-width="80px" :inline="true">
          <el-form-item label="视频ID">
            <el-input v-model="form.id"></el-input>
          </el-form-item>
          <el-form-item label="视频标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>

        <!-- table -->
        <el-table :data="videosList" stripe border style="width: 100%">
          <el-table-column prop="date" label="编号" width="200">
            <template scope="scope">
              <span size="small">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="视频ID" >
            <template scope="scope">
              <span size="small" @click="handleVideo(scope.row.video_id)">{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="视频标题"></el-table-column>
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
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[20, 50, 100]" :page-size="pageNum" :current-page="currentPage" layout=" sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
        
        <!-- 观看视频 -->
        <el-dialog :title="videoTitle" size="large" v-model="dialogVideoVisible" custom-class="dialog-video" :before-close="handleClose">
          <iframe width="100%" height="650" :src="dialogVideoSrc" frameborder="0" allowfullscreen></iframe>
        </el-dialog>
        
        <!-- 评论弹窗 -->
        <el-dialog title="视频评论" size="large" :visible.sync="dialogFormVisible">
          <div style="float:left;width:48%;padding-right: 3%;"> 
            <h3>已发表评论</h3>
            <el-form label-position="left" label-width="60px">
              <el-form-item label="" v-for="value in contentForm">
                <img :src="value.src" alt="">
                <el-input type="textarea" :rows="3" :value="value.content"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-left: 60px;padding-bottom: 20px;">
              <el-button type="primary" @click="dialogFormVisible = false">发  布</el-button>
            </div>
          </div>
          <div style="float:left;width:48%;">
            <h3>创建/扒取评论</h3>
            <el-form label-position="left" label-width="60px">
              <el-form-item label="" :data="contentForm">
                <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQQKSf64XtnT5E6zRFshC8qui6sjNZXV6tZnSuN940IARpruqlx" alt="">
                <el-input type="textarea" :rows="3"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-left: 60px;padding-bottom: 20px;">
              <el-button type="primary" @click="dialogFormVisible = false">发  布</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">添加更多</el-button>
            </div>
          </div>
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
            currentPage: 1,
            pageNum: 20,
            dialogVideoVisible: false,
            dialogFormVisible: true,
            dialogVideoSrc: '',
            videoTitle: '',
            form: {
                news_id: '',
                comment_num: '',
                news_title: '',
                category_value: ''
            },
            contentForm: [{
              src: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQQKSf64XtnT5E6zRFshC8qui6sjNZXV6tZnSuN940IARpruqlx',
              content: 'hahahahaha'
            },
            {
              src: 'http://wx3.sinaimg.cn/mw690/9fcdce0dgy1fbujko1cf6j20jg0jgjse.jpg',
              content: 'hehehehe'
            }],
            videosList: []
            };
        },
        methods: {
          onSubmit() {
              console.log('submit!');
              console.log(this.form);
          },
          // 点击视频预览
          handleVideo: function(params){
              var self = this;
              self.dialogVideoVisible = true;
              self.dialogVideoSrc = 'https://www.youtube.com/embed/' + params;
              console.log(params);
          },
          // 关闭视频预览
          handleClose(done) {
            var self = this;
            self.dialogVideoSrc = '';
            done();
          },
          handleSizeChange(val) {
            var self = this;
            self.pageNum = val;
            self.currentPage = 1,
            self.loading = true;
            http.get('/select_video',{
              params: {
                start: 0,
                rows: val
              }
            }).then(function(res){
              self.loading = false;
              self.videosList = res;
            });
          },
          handleCurrentChange(val) {
            var self = this;
            self.loading = true;
            self.currentPage = val;
            http.get('/select_video', {
                params:{
                  start: (val-1)*self.pageNum,
                  rows: self.pageNum
                }
            }).then(function(res){
                self.loading = false;
                self.videosList = res;
            });
          },
          // 点击推送
          handlePush: function(index, row){

          }
        },
        created: function(){
          var self = this;
          http.get('/select_video?start=0&rows=20').then(function(res){
              self.loading = false;
              self.videosList = res;
          });
        }
    }
</script>

<style lang="css">
.el-form img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  float: left;
  margin-right: 10px;
}
h3 {
  margin-bottom: 20px;
}
.el-form-item__content{
  margin-left: 0 !important;
}
.el-form .el-textarea {
  float: left;
  width: calc(100% - 50px);
}
</style>
