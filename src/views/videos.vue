<template lang="html">
    <div>
        <!-- 筛选区域 -->
        <el-form label-width="80px" :inline="true">
          <el-form-item label="">
            <el-input placeholder="视频ID" v-model="form.id" icon="search" :on-icon-click="searchSigleVideo"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input placeholder="视频标题" v-model="form.title" icon="search" :on-icon-click="searchVideoTitle"></el-input>
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
              <el-button size="small" @click="toCommentPage(scope.row)">评论</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="立即推送">
            <template scope="scope">
              <el-button size="small" @click="handlePush(scope.row.id)">立即推送</el-button>
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
          <el-input placeholder="请输入视频标题" v-model="editVideoTitle">
            <template slot="prepend">视频标题：</template>
          </el-input>
          <el-input placeholder="请输入视频描述" v-model="editVideoDesc">
            <template slot="prepend">视频描述：</template>
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
            currentPage: 1,
            pageNum: 20,
            dialogVideoVisible: false,
            dialogFormVisible: true,
            pushVisible: false,
            loading2: false,
            pushId: '',
            dialogVideoSrc: '',
            videoTitle: '',
            editVideoTitle: '',
            editVideoDesc: '',
            form: {
                id: '',
                title: ''
            },
            platformList: [],
            videosList: []
            };
        },
        methods: {
          searchSigleVideo() {
            var self = this;
            if(self.form.id != '') {
              http.get('/japi/video/get',{
                params: {
                  id: self.form.id
                }
              }).then(function(res){
                self.videosList = [];
                self.videosList.push(res.data);
                console.log(self.videosList)
              });
            } else {
              location.reload();
            }
          },
          searchVideoTitle() {
            var self = this;
            if(self.form.title != '') {
              http.get('/solr/videos/select?wt=json&fl=title,vid,commentCount,category_id:cid,desc&sort=score%20desc&q=title:' + self.form.title + '&rows=100').then(function(res){
                self.videosList = res.response.docs;
              });
            } else {
              location.reload();
            }

          },
          // 点击视频预览
          handleVideo: function(params){
              var self = this;
              self.dialogVideoVisible = true;
              self.dialogVideoSrc = 'https://www.youtube.com/embed/' + params;
              self.videoTitle = '视频源链接：' +dialogVideoSrc;
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
          // 评论
          toCommentPage(obj) {
            console.log(obj);
            var title = encodeURI(obj.title);
            var _href = 'http://' + window.location.host + '/#/newsjet/comment?title' +title+ '&public_time=' + obj.public_time + '&aid='+ obj.id+ '&url=' + obj.url + '&imgs=' + obj.imgs;
            console.log(_href);
            window.location.href= _href;
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
                pushtype: 'video'
              }
              if (self.editNewsTitle) {
                  dataParams.title = self.editVideoTitle;
              }
              if (self.editNewsDesc) {
                  dataParams.body = self.editVideoDesc;
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
  .el-pagination {
    margin-top: 20px;
  }
</style>
